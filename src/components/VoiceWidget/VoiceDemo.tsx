
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle, MessageCircle, X } from 'lucide-react';
import { TranscriptProvider } from './contexts/TranscriptContext';
import { EventProvider } from './contexts/EventContext';
import CopilotDemoApp from './CopilotDemoApp';
import { SessionStatus } from './types';
import { createRealtimeConnection, cleanupConnection } from './lib/realtimeConnection';

// Default values for environment variables
const DEFAULT_NGROK_URL = "https://voice-conversation-engine.dev.appellatech.net";
const DEFAULT_STORE_URL = "appella-test.myshopify.com";

// Use environment variables or fallback to defaults
const NGROK_URL = import.meta.env.VITE_NGROK_URL || DEFAULT_NGROK_URL;
const STORE_URL = import.meta.env.VITE_STORE_URL || DEFAULT_STORE_URL;

// Maximum number of connection retries
const MAX_CONNECTION_RETRIES = 3;

export default function VoiceDemo() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('DISCONNECTED');
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [tools, setTools] = useState<any[]>([]);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const isInitialConnectionRef = useRef<boolean>(true);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load persisted settings on component mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('voiceWidgetSettings');
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        setIsTranscriptionEnabled(settings.isTranscriptionEnabled ?? false);
        setIsAudioEnabled(settings.isAudioEnabled ?? false);
        setIsWidgetOpen(settings.isWidgetOpen ?? false);
        
        // Auto-connect if it was previously connected
        if (settings.wasConnected && isInitialConnectionRef.current) {
          isInitialConnectionRef.current = false;
          // Use setTimeout to ensure component is fully mounted
          setTimeout(() => {
            handleToggleConnection();
          }, 1000);
        }
      } catch (e) {
        console.error('Error parsing stored voice widget settings:', e);
      }
    }
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('voiceWidgetSettings', JSON.stringify({
      isTranscriptionEnabled,
      isAudioEnabled,
      isWidgetOpen,
      wasConnected: sessionStatus === 'CONNECTED'
    }));
  }, [isTranscriptionEnabled, isAudioEnabled, isWidgetOpen, sessionStatus]);

  useEffect(() => {
    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.autoplay = true;
      audioElementRef.current = audio;
    }

    if (audioElementRef.current) {
      audioElementRef.current.muted = !isAudioEnabled;
      
      if (isAudioEnabled && audioElementRef.current.srcObject) {
        audioElementRef.current.play().catch((err) => {
          console.warn("Autoplay prevented:", err);
        });
      }
    }
  }, [isAudioEnabled]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      cleanupResources();
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  const cleanupResources = () => {
    // Clean up RTCPeerConnection
    cleanupConnection(pcRef.current);
    pcRef.current = null;
    
    // Clear data channel reference
    dcRef.current = null;
    
    // Clear audio element
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
    }
  };

  const handleToggleConnection = async () => {
    if (sessionStatus === 'CONNECTED' || sessionStatus === 'CONNECTING') {
      cleanupResources();
      setSessionStatus('DISCONNECTED');
      setError(null);
      setInstructions("");
      setTools([]);
      setConnectionRetries(0);
    } else {
      await connectToService();
    }
  };

  const connectToService = async () => {
    // Don't try to connect if we've exceeded the retry limit
    if (connectionRetries >= MAX_CONNECTION_RETRIES) {
      setError(`Maximum connection attempts (${MAX_CONNECTION_RETRIES}) reached. Please try again later.`);
      setSessionStatus('DISCONNECTED');
      return;
    }

    setSessionStatus('CONNECTING');
    setError(null);

    try {
      // Set a connection timeout
      const connectionPromise = new Promise<void>(async (resolve, reject) => {
        try {
          const response = await fetch(`${NGROK_URL}/openai-realtime/session/${STORE_URL}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to get session data: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const clientSecret = data.result?.client_secret?.value;
          const sessionInstructions = data.result?.instructions;
          const sessionTools = data.result?.tools || [];

          if (!clientSecret) {
            throw new Error('No client secret found in response');
          }

          // Clean up any existing connections before creating a new one
          cleanupResources();

          const { pc, dc } = await createRealtimeConnection(
            clientSecret,
            audioElementRef,
            isAudioEnabled
          );

          pcRef.current = pc;
          dcRef.current = dc;
          setInstructions(sessionInstructions || "");
          setTools(sessionTools);
          setSessionStatus('CONNECTED');
          setIsWidgetOpen(true);
          setConnectionRetries(0); // Reset retries on successful connection

          if (audioElementRef.current && isAudioEnabled) {
            try {
              await audioElementRef.current.play();
            } catch (err) {
              console.warn('Autoplay prevented:', err);
            }
          }
          
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      // Set a connection timeout
      const timeoutPromise = new Promise<void>((_, reject) => {
        connectionTimeoutRef.current = setTimeout(() => {
          reject(new Error('Connection timed out. Please try again.'));
        }, 10000); // 10 second timeout
      });

      // Race the connection promise against the timeout
      await Promise.race([connectionPromise, timeoutPromise]);
      
      // Clear the timeout if successful
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    } catch (error) {
      console.error('Error connecting:', error);
      cleanupResources();
      
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to connect. Please try again.'
      );
      setSessionStatus('DISCONNECTED');
      
      // Increment retry counter
      setConnectionRetries(prev => prev + 1);
      
      // If we haven't exceeded the retry limit, try again after a delay
      if (connectionRetries < MAX_CONNECTION_RETRIES - 1) {
        console.log(`Retrying connection (attempt ${connectionRetries + 1}/${MAX_CONNECTION_RETRIES})...`);
        setTimeout(() => {
          connectToService();
        }, 2000); // Wait 2 seconds before retrying
      }
    }
  };

  function getConnectionButtonLabel() {
    if (sessionStatus === 'CONNECTED') return 'Disconnect';
    if (sessionStatus === 'CONNECTING') return 'Connecting...';
    return 'Connect';
  }

  function getConnectionButtonClasses() {
    const baseClasses =
      'text-white text-base px-8 py-3 rounded-full transition-all duration-200';
    const cursorClass =
      sessionStatus === 'CONNECTING' ? 'cursor-not-allowed' : 'cursor-pointer';

    if (sessionStatus === 'CONNECTED') {
      return `bg-red-600 hover:bg-red-700 ${cursorClass} ${baseClasses}`;
    }
    return `bg-[#5856d6] hover:bg-[#4745ac] ${cursorClass} ${baseClasses}`;
  }

  const IconButton = ({
    checked,
    onChange,
    icon: Icon,
    iconOff: IconOff,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    icon: React.ComponentType<any>;
    iconOff: React.ComponentType<any>;
  }) => (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        p-3 rounded-full transition-all duration-200
        ${
          checked
            ? 'bg-[#5856d6] text-white hover:bg-[#4745ac] cursor-pointer'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
        }
      `}
    >
      {checked ? <Icon className="w-6 h-6" /> : <IconOff className="w-6 h-6" />}
    </button>
  );

  return (
    <>
      {/* Chat Widget Toggle Button */}
      <button
        onClick={() => setIsWidgetOpen(!isWidgetOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#5856d6] text-white p-4 rounded-full shadow-lg hover:bg-[#4745ac] transition-all duration-200"
      >
        {isWidgetOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Widget Container */}
      <div
        className={`fixed bottom-24 right-6 z-40 w-[400px] bg-white rounded-xl shadow-2xl transition-all duration-300 transform ${
          isWidgetOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Atelier Assistant</h2>
            <div className="flex gap-2">
              <IconButton
                checked={isTranscriptionEnabled}
                onChange={setIsTranscriptionEnabled}
                icon={Mic}
                iconOff={MicOff}
              />
              <IconButton
                checked={isAudioEnabled}
                onChange={setIsAudioEnabled}
                icon={Volume2}
                iconOff={VolumeX}
              />
            </div>
          </div>

          <button
            onClick={handleToggleConnection}
            className={`w-full ${getConnectionButtonClasses()}`}
            disabled={sessionStatus === 'CONNECTING'}
          >
            {getConnectionButtonLabel()}
          </button>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg mt-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          {instructions && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-semibold mb-1">Current Instructions:</p>
              <p className="text-gray-700">{instructions}</p>
            </div>
          )}
        </div>

        <TranscriptProvider>
          <EventProvider>
            <CopilotDemoApp
              initialSessionStatus={sessionStatus}
              onSessionStatusChange={setSessionStatus}
              peerConnection={pcRef.current}
              dataChannel={dcRef.current}
              isTranscriptionEnabled={isTranscriptionEnabled}
              isAudioEnabled={isAudioEnabled}
              instructions={instructions}
              tools={tools}
            />
          </EventProvider>
        </TranscriptProvider>
      </div>
    </>
  );
}
