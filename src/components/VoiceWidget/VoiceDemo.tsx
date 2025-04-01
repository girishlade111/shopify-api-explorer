import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Menu, Mic, MicOff, RefreshCw, Volume2, VolumeX, X } from 'lucide-react';
import { TranscriptProvider } from './contexts/TranscriptContext';
import { EventProvider } from './contexts/EventContext';
import CopilotDemoApp from './CopilotDemoApp';
import { SessionStatus } from './types';
import { createRealtimeConnection, cleanupConnection } from './lib/realtimeConnection';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

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
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [tools, setTools] = useState<any[]>([]);
  const [connectionRetries, setConnectionRetries] = useState(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const isInitialConnectionRef = useRef<boolean>(true);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem('voiceWidgetSettings');
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        if (settings.isTranscriptionEnabled !== undefined) {
          setIsTranscriptionEnabled(settings.isTranscriptionEnabled);
        }
        if (settings.isAudioEnabled !== undefined) {
          setIsAudioEnabled(settings.isAudioEnabled);
        }
      } catch (e) {
        console.error('Error parsing stored voice widget settings:', e);
      }
    }
  }, []);

  useEffect(() => {
    connectToService();
    return () => {
      cleanupResources();
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('voiceWidgetSettings', JSON.stringify({
      isTranscriptionEnabled,
      isAudioEnabled,
      wasConnected: sessionStatus === 'CONNECTED'
    }));
  }, [isTranscriptionEnabled, isAudioEnabled, sessionStatus]);

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

  const cleanupResources = () => {
    cleanupConnection(pcRef.current);
    pcRef.current = null;
    dcRef.current = null;
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
    }
  };

  const connectToService = async () => {
    if (connectionRetries >= MAX_CONNECTION_RETRIES) {
      setError(`Maximum connection attempts (${MAX_CONNECTION_RETRIES}) reached. Please try again later.`);
      setSessionStatus('DISCONNECTED');
      return;
    }

    setSessionStatus('CONNECTING');
    setError(null);

    try {
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
          setConnectionRetries(0);

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

      const timeoutPromise = new Promise<void>((_, reject) => {
        connectionTimeoutRef.current = setTimeout(() => {
          reject(new Error('Connection timed out. Please try again.'));
        }, 10000);
      });

      await Promise.race([connectionPromise, timeoutPromise]);

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
      
      setConnectionRetries(prev => prev + 1);

      if (connectionRetries < MAX_CONNECTION_RETRIES - 1) {
        console.log(`Retrying connection (attempt ${connectionRetries + 1}/${MAX_CONNECTION_RETRIES})...`);
        setTimeout(() => {
          connectToService();
        }, 2000);
      }
    }
  };

  const switchToTextMode = () => {
    window.history.back();
    setTimeout(() => {
      const textButton = document.querySelector('input[type="text"]');
      if (textButton) {
        (textButton as HTMLElement).focus();
      }
    }, 100);
    setSheetOpen(false);
  };

  const speakToHuman = () => {
    console.log("Speak to human functionality would be implemented here");
    setSheetOpen(false);
  };

  const resetChat = () => {
    cleanupResources();
    connectToService();
    setSheetOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full md:w-[400px] h-[600px] bg-white rounded-t-xl md:rounded-xl shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="flex flex-col py-4">
              <button 
                className="flex items-center gap-3 py-4 px-6 hover:bg-gray-100 w-full text-left"
                onClick={switchToTextMode}
              >
                <Mic className="w-6 h-6" />
                <span className="text-lg">Switch to Text</span>
              </button>
              
              <button 
                className="flex items-center gap-3 py-4 px-6 hover:bg-gray-100 w-full text-left"
                onClick={speakToHuman}
              >
                <Headphones className="w-6 h-6" />
                <span className="text-lg">Speak to Human</span>
              </button>
              
              <button 
                className="flex items-center gap-3 py-4 px-6 hover:bg-gray-100 w-full text-left"
                onClick={resetChat}
              >
                <RefreshCw className="w-6 h-6" />
                <span className="text-lg">Reset Chat</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
        <h2 className="text-xl font-semibold">Enzo AI</h2>
        <div className="flex items-center gap-1">
          <button 
            role="switch"
            aria-checked={isTranscriptionEnabled}
            onClick={() => setIsTranscriptionEnabled(!isTranscriptionEnabled)}
            className={`
              p-3 rounded-full transition-all duration-200
              ${sessionStatus !== 'CONNECTED' ? 'opacity-50 cursor-not-allowed' : ''}
              ${
                isTranscriptionEnabled
                  ? 'bg-[#33C3F0] text-white hover:bg-[#30B4DD] cursor-pointer'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
              }
            `}
            disabled={sessionStatus !== 'CONNECTED'}
          >
            {isTranscriptionEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button 
            role="switch"
            aria-checked={isAudioEnabled}
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`
              p-3 rounded-full transition-all duration-200
              ${sessionStatus !== 'CONNECTED' ? 'opacity-50 cursor-not-allowed' : ''}
              ${
                isAudioEnabled
                  ? 'bg-[#33C3F0] text-white hover:bg-[#30B4DD] cursor-pointer'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
              }
            `}
            disabled={sessionStatus !== 'CONNECTED'}
          >
            {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => window.history.back()}
            className="p-2 ml-1"
            aria-label="Close voice assistant"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
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
            isVoiceMode={true}
          />
        </EventProvider>
      </TranscriptProvider>
    </div>
  );
}
