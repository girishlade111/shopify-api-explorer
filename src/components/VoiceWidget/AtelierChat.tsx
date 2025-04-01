
import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Menu, Mic, RefreshCw, X } from 'lucide-react';
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
  const isInitialConnectionRef = useRef<boolean>(true);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Auto-connect when component mounts
  useEffect(() => {
    connectToService();
    
    // Disconnect when component unmounts
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
            false // Audio is always disabled for text chat
          );

          pcRef.current = pc;
          dcRef.current = dc;
          setInstructions(sessionInstructions || "");
          setTools(sessionTools);
          setSessionStatus('CONNECTED');
          setConnectionRetries(0); // Reset retries on successful connection
          
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

  const switchToVoiceMode = () => {
    // Instead of window.history.back()
    onClose({ preventDefault: () => {} } as React.MouseEvent);
    setTimeout(() => {
      const voiceButton = document.querySelector('.bg-[#33C3F0].rounded-full.p-3.mx-2');
      if (voiceButton) {
        (voiceButton as HTMLElement).click();
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
    <div className="fixed bottom-6 left-6 z-40 w-[400px] h-[600px] bg-white rounded-[24px] shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
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
                onClick={switchToVoiceMode}
              >
                <Mic className="w-6 h-6" />
                <span className="text-lg">Switch to Voice</span>
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
        <button 
          onClick={onClose}
          className="p-2"
          aria-label="Close chat assistant"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <TranscriptProvider>
        <EventProvider>
          <CopilotDemoApp
            initialSessionStatus={sessionStatus}
            onSessionStatusChange={setSessionStatus}
            peerConnection={pcRef.current}
            dataChannel={dcRef.current}
            isTranscriptionEnabled={false} // Always false for text chat
            isAudioEnabled={false} // Always false for text chat
            instructions={instructions}
            tools={tools}
          />
        </EventProvider>
      </TranscriptProvider>
    </div>
  );
}
