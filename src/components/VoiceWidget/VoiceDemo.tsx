
import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Mic, MicOff, RefreshCw, Volume2, VolumeX, X } from 'lucide-react';
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
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  // Effect to handle AI speaking state for the video animation
  useEffect(() => {
    // This would be connected to actual AI speaking events
    // For now it's just a simple demo
    const toggleSpeakingInterval = setInterval(() => {
      // For demo purposes only. In a real implementation,
      // this should be connected to actual AI speaking events
      if (sessionStatus === 'CONNECTED') {
        setIsAiSpeaking(prev => !prev);
      }
    }, 5000);

    return () => clearInterval(toggleSpeakingInterval);
  }, [sessionStatus]);

  // Effect to control the video playback based on AI speaking state
  useEffect(() => {
    if (videoRef.current) {
      if (isAiSpeaking) {
        videoRef.current.play().catch(err => {
          console.warn("Video play prevented:", err);
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isAiSpeaking]);

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
    <div className="fixed bottom-6 left-6 z-40 bg-white rounded-full shadow-lg transition-all duration-300 overflow-hidden max-w-[300px]">
      <div className="flex items-center py-2 px-4">
        <div className="w-10 h-10 rounded-full bg-[#33C3F0] flex items-center justify-center mr-3 overflow-hidden">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            src="https://static.videezy.com/system/resources/previews/000/052/425/original/4K-34.mp4"
            type="video/mp4"
            loop
            muted
            playsInline
          />
        </div>
        <div className="flex-1">
          <p className="text-sm">Listening...</p>
        </div>
        <button 
          onClick={() => window.history.back()}
          className="p-2 ml-1"
          aria-label="Close voice assistant"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="hidden">
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
    </div>
  );
}
