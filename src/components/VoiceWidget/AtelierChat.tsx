
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Mic, Headphones, RefreshCw } from 'lucide-react';
import { TranscriptProvider } from './contexts/TranscriptContext';
import { EventProvider } from './contexts/EventContext';
import CopilotDemoApp from './CopilotDemoApp';
import { SessionStatus } from './types';
import { createRealtimeConnection, cleanupConnection } from './lib/realtimeConnection';
import { useToast } from "@/hooks/use-toast";

const DEFAULT_NGROK_URL = "https://voice-conversation-engine.dev.appellatech.net";
const DEFAULT_STORE_URL = "appella-test.myshopify.com";

const NGROK_URL = import.meta.env.VITE_NGROK_URL || DEFAULT_NGROK_URL;
const STORE_URL = import.meta.env.VITE_STORE_URL || DEFAULT_STORE_URL;

const MAX_CONNECTION_RETRIES = 3;
const CONNECTION_TIMEOUT_MS = 15000;

interface AtelierChatProps {
  onClose: (e: React.MouseEvent) => void;
}

export default function AtelierChat({ onClose }: AtelierChatProps) {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('DISCONNECTED');
  const [error, setError] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [tools, setTools] = useState<any[]>([]);
  const [connectionRetries, setConnectionRetries] = useState(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();
  const isMountedRef = useRef(true); // Track component mount state
  const connectionInProgressRef = useRef(false); // Prevent multiple connection attempts

  useEffect(() => {
    const audioEl = new Audio();
    audioEl.autoplay = true;
    audioEl.muted = true;
    audioElementRef.current = audioEl;
    
    // Only start connecting if we're not already trying to connect
    if (!connectionInProgressRef.current) {
      connectToService();
    }
    
    return () => {
      isMountedRef.current = false;
      cleanupResources();
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const cleanupResources = () => {
    cleanupConnection(pcRef.current);
    pcRef.current = null;
    dcRef.current = null;
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
    }
  };

  const connectToService = async () => {
    if (!isMountedRef.current) return;
    
    if (connectionRetries >= MAX_CONNECTION_RETRIES) {
      const errorMsg = `Maximum connection attempts (${MAX_CONNECTION_RETRIES}) reached. Please try again later.`;
      setError(errorMsg);
      setSessionStatus('DISCONNECTED');
      console.error(errorMsg);
      return;
    }

    // Set flag to prevent multiple connection attempts
    connectionInProgressRef.current = true;
    
    setSessionStatus('CONNECTING');
    setError(null);
    
    // Cancel any existing abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    
    let timeoutTriggered = false;
    connectionTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      
      timeoutTriggered = true;
      if (isMountedRef.current && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      setError('Connection timed out. Please try again.');
      setSessionStatus('DISCONNECTED');
      connectionInProgressRef.current = false;
      
      setConnectionRetries(prev => prev + 1);
      
      if (connectionRetries < MAX_CONNECTION_RETRIES - 1) {
        console.log(`Retrying connection (attempt ${connectionRetries + 1}/${MAX_CONNECTION_RETRIES})...`);
        setTimeout(() => {
          if (isMountedRef.current) {
            connectToService();
          }
        }, 2000);
      } else {
        console.error(`Failed to connect after ${MAX_CONNECTION_RETRIES} attempts. Please try again later.`);
      }
    }, CONNECTION_TIMEOUT_MS);

    try {
      console.log("Attempting to fetch session data from:", `${NGROK_URL}/openai-realtime/session/${STORE_URL}`);
      
      const response = await fetch(`${NGROK_URL}/openai-realtime/session/${STORE_URL}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal
      });

      if (!isMountedRef.current) return;

      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }

      if (timeoutTriggered) {
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to get session data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Session data received:", data);
      
      const clientSecret = data.result?.client_secret?.value;
      const sessionInstructions = data.result?.instructions;
      const sessionTools = data.result?.tools || [];

      if (!clientSecret) {
        throw new Error('No client secret found in response');
      }

      cleanupResources();

      console.log("Creating new real-time connection with received client secret");
      const { pc, dc } = await createRealtimeConnection(
        clientSecret,
        audioElementRef,
        false, // isAudioEnabled
        true  // skipAudioStream - we want to keep the microphone muted for text chat
      );

      if (!isMountedRef.current) {
        // Clean up if component unmounted during connection
        cleanupConnection(pc);
        return;
      }

      // Store the peer connection and data channel refs for later use
      pcRef.current = pc;
      dcRef.current = dc;
      
      // Add extra event listeners for connection stability
      dc.onclose = () => {
        console.log("Data channel closed unexpectedly");
        if (isMountedRef.current && sessionStatus === 'CONNECTED') {
          setSessionStatus('DISCONNECTED');
          toast.error("Connection lost. Attempting to reconnect...");
          setTimeout(() => {
            if (isMountedRef.current) connectToService();
          }, 2000);
        }
      };
      
      pc.oniceconnectionstatechange = () => {
        console.log(`ICE connection state: ${pc.iceConnectionState}`);
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          if (isMountedRef.current && sessionStatus === 'CONNECTED') {
            setSessionStatus('DISCONNECTED');
            toast.error("Connection lost. Attempting to reconnect...");
            setTimeout(() => {
              if (isMountedRef.current) connectToService();
            }, 2000);
          }
        }
      };

      setInstructions(sessionInstructions || "");
      setTools(sessionTools);
      setSessionStatus('CONNECTED');
      setConnectionRetries(0);
      connectionInProgressRef.current = false;
      
      console.log("Chat session established successfully.");
      toast.success("Connected successfully!");
      
    } catch (error) {
      if (!isMountedRef.current) return;
      
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    
      if (timeoutTriggered) {
        return;
      }
    
      // Only log this if it's not an AbortError or if it is but the component is still mounted
      if (!(error instanceof DOMException && error.name === 'AbortError') || isMountedRef.current) {
        console.error('Error connecting:', error);
      }
      
      cleanupResources();
      
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to connect. Please try again.';
      
      setError(errorMessage);
      setSessionStatus('DISCONNECTED');
      connectionInProgressRef.current = false;
      
      setConnectionRetries(prev => prev + 1);
      
      if (connectionRetries < MAX_CONNECTION_RETRIES - 1) {
        console.log(`Retrying connection (attempt ${connectionRetries + 1}/${MAX_CONNECTION_RETRIES})...`);
        setTimeout(() => {
          if (isMountedRef.current) {
            connectToService();
          }
        }, 2000);
      } else {
        console.error(`Failed to connect after ${MAX_CONNECTION_RETRIES} attempts. Please try again later.`);
        toast.error("Failed to connect after multiple attempts. Please try again later.");
      }
    }
  };

  const switchToVoiceMode = () => {
    onClose({ preventDefault: () => {} } as React.MouseEvent);
    setTimeout(() => {
      const voiceModeButton = document.getElementById('voice-mode-button');
      if (voiceModeButton) {
        voiceModeButton.click();
      } else {
        const event = new CustomEvent('activateVoiceMode');
        document.dispatchEvent(event);
      }
    }, 100);
    setMenuOpen(false);
  };

  const speakToHuman = () => {
    console.log("Speak to human functionality would be implemented here");
    setMenuOpen(false);
  };

  const resetChat = () => {
    cleanupResources();
    setConnectionRetries(0); // Reset retry counter on manual reset
    connectToService();
    setMenuOpen(false);
  };

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 left-6 z-50 bg-white text-black py-3 px-4 rounded-full shadow-none hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 cursor-pointer"
        aria-label="Expand chat widget"
      >
        <div className="w-10 h-10 rounded-full bg-[#33C3F0] flex items-center justify-center">
          {/* Empty blue circle without an icon */}
        </div>
        <span className="text-lg font-serif font-bold">Enzo AI</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 w-[320px] h-[440px] bg-white rounded-[20px] shadow-none transition-all duration-300 overflow-hidden flex flex-col">
      <div className="sticky top-0 z-20 bg-white flex items-center justify-between p-3 border-b border-gray-100">
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="p-2"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-lg font-serif font-bold">Enzo AI</h2>
        <div className="flex items-center">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Minimize chat assistant"
          >
            <span className="w-4 h-1.5 bg-gray-500 rounded-full block"></span>
          </button>
        </div>
        
        {menuOpen && (
          <div className="absolute top-12 left-2 bg-white rounded-xl shadow-none w-[230px] z-50">
            <div className="flex flex-col py-2">
              <button 
                className="flex items-center gap-3 py-2.5 px-4 hover:bg-gray-100 w-full text-left"
                onClick={switchToVoiceMode}
              >
                <Mic className="w-4 h-4" />
                <span className="text-sm">Switch to Voice</span>
              </button>
              
              <button 
                className="flex items-center gap-3 py-2.5 px-4 hover:bg-gray-100 w-full text-left"
                onClick={speakToHuman}
              >
                <Headphones className="w-4 h-4" />
                <span className="text-sm">Speak to Human</span>
              </button>
              
              <button 
                className="flex items-center gap-3 py-2.5 px-4 hover:bg-gray-100 w-full text-left"
                onClick={resetChat}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Reset Chat</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mx-3 mb-2">
          <div className="flex">
            <div className="ml-2">
              <p className="text-xs text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {sessionStatus === 'CONNECTING' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mx-3 mb-2">
          <div className="flex items-center">
            <div className="mr-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-xs text-blue-700">
              Connecting to assistant...
            </p>
          </div>
        </div>
      )}

      <TranscriptProvider>
        <EventProvider>
          <CopilotDemoApp
            initialSessionStatus={sessionStatus}
            onSessionStatusChange={setSessionStatus}
            peerConnection={pcRef.current}
            dataChannel={dcRef.current}
            isTranscriptionEnabled={false}
            isAudioEnabled={false}
            instructions={instructions}
            tools={tools}
            onSwitchToVoiceMode={switchToVoiceMode}
          />
        </EventProvider>
      </TranscriptProvider>
    </div>
  );
}
