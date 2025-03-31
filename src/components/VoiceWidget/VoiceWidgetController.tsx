import React, { useState, useEffect, useRef } from 'react';
import { TranscriptProvider } from './contexts/TranscriptContext';
import { EventProvider } from './contexts/EventContext';
import ModeSelection from './components/ModeSelection';
import VoiceMode from './components/VoiceMode';
import TextMode from './components/TextMode';
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

type Mode = 'selection' | 'voice' | 'text';

const VoiceWidgetController: React.FC = () => {
  const [mode, setMode] = useState<Mode>('selection');
  const [isConnected, setIsConnected] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>>([]);
  
  // Connection states
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('DISCONNECTED');
  const [error, setError] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [tools, setTools] = useState<any[]>([]);
  const [connectionRetries, setConnectionRetries] = useState(0);
  
  // References
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
        setIsMicMuted(!settings.isTranscriptionEnabled);
        setIsSpeakerMuted(!settings.isAudioEnabled);
        
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
      isTranscriptionEnabled: !isMicMuted,
      isAudioEnabled: !isSpeakerMuted,
      wasConnected: sessionStatus === 'CONNECTED'
    }));
  }, [isMicMuted, isSpeakerMuted, sessionStatus]);

  useEffect(() => {
    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.autoplay = true;
      audioElementRef.current = audio;
    }

    if (audioElementRef.current) {
      audioElementRef.current.muted = isSpeakerMuted;
      
      if (!isSpeakerMuted && audioElementRef.current.srcObject) {
        audioElementRef.current.play().catch((err) => {
          console.warn("Autoplay prevented:", err);
        });
      }
    }
  }, [isSpeakerMuted]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      cleanupResources();
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  // Setup data channel event listeners
  useEffect(() => {
    if (dcRef.current && dcRef.current.readyState === 'open') {
      // Setup message handler
      const handleDataChannelMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle text messages from assistant
          if (data.type === 'text') {
            addMessage({
              role: 'assistant',
              content: data.text || '',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          }
        } catch (error) {
          console.error('Error parsing data channel message:', error);
        }
      };
      
      dcRef.current.onmessage = handleDataChannelMessage;
      
      // Clean up on unmount
      return () => {
        if (dcRef.current) {
          dcRef.current.onmessage = null;
        }
      };
    }
  }, [dcRef.current]);

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

  const handleConnect = async () => {
    await connectToService();
  };

  const handleDisconnect = async () => {
    cleanupResources();
    setSessionStatus('DISCONNECTED');
    setIsConnected(false);
    setError(null);
    setInstructions("");
    setTools([]);
    setConnectionRetries(0);
    console.log('Disconnected from server');
  };

  const handleToggleConnection = () => {
    if (sessionStatus === 'CONNECTED' || sessionStatus === 'CONNECTING') {
      handleDisconnect();
    } else {
      handleConnect();
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
            !isSpeakerMuted
          );

          pcRef.current = pc;
          dcRef.current = dc;
          
          // Set up data channel message handler
          if (dc && dc.readyState === 'open') {
            dc.onmessage = (event) => {
              try {
                const data = JSON.parse(event.data);
                if (data.type === 'text') {
                  addMessage({
                    role: 'assistant',
                    content: data.text || '',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  });
                }
              } catch (error) {
                console.error('Error parsing data channel message:', error);
              }
            };
          }

          setInstructions(sessionInstructions || "");
          setTools(sessionTools);
          setSessionStatus('CONNECTED');
          setIsConnected(true);
          setConnectionRetries(0); // Reset retries on successful connection

          if (audioElementRef.current && !isSpeakerMuted) {
            try {
              await audioElementRef.current.play();
            } catch (err) {
              console.warn('Autoplay prevented:', err);
            }
          }
          
          // Add a welcome message
          addMessage({
            role: 'assistant',
            content: 'Hello! I am your Atelier Assistant. How can I help you today?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          
          console.log('Connected to server');
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
      setIsConnected(false);
      
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

  const handleToggleMic = () => {
    // Toggle microphone state
    setIsMicMuted(!isMicMuted);
  };

  const handleToggleSpeaker = () => {
    // Toggle speaker state
    setIsSpeakerMuted(!isSpeakerMuted);
  };

  const addMessage = (message: {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }) => {
    setMessages(prev => [...prev, {
      ...message,
      timestamp: message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSendMessage = (message: string) => {
    if (isConnected) {
      // Add user message to transcript
      addMessage({
        role: 'user',
        content: message,
      });
      
      // If we have a data channel, send the message through it
      if (dcRef.current && dcRef.current.readyState === 'open') {
        try {
          dcRef.current.send(JSON.stringify({
            type: 'text',
            text: message,
          }));
          console.log('Message sent through data channel:', message);
        } catch (error) {
          console.error('Error sending message:', error);
          // Fallback if sending fails
          setTimeout(() => {
            addMessage({
              role: 'assistant',
              content: "I'm sorry, there was an error sending your message. Please try disconnecting and connecting again.",
            });
          }, 500);
        }
      } else {
        console.warn('Data channel not ready:', dcRef.current?.readyState);
        // Fallback if data channel isn't available
        setTimeout(() => {
          addMessage({
            role: 'assistant',
            content: "I'm sorry, the connection isn't fully established. Please try disconnecting and connecting again.",
          });
        }, 500);
      }
    }
  };

  const handleSelectMode = (selectedMode: 'voice' | 'text') => {
    // Disconnect if connected before changing modes
    if (isConnected) {
      handleDisconnect();
    }
    
    setMode(selectedMode);
    // Reset UI states
    setIsMicMuted(false);
    setIsSpeakerMuted(false);
    setMessages([]);
  };

  const handleChangeMode = () => {
    // Disconnect if connected before changing modes
    if (isConnected) {
      handleDisconnect();
    }
    
    // Toggle between voice and text modes, or go back to selection
    if (mode === 'voice') {
      setMode('text');
    } else if (mode === 'text') {
      setMode('voice');
    } else {
      setMode('selection');
    }
    
    // Reset messages when changing modes
    setMessages([]);
  };

  // Render appropriate mode
  if (mode === 'selection') {
    return (
      <div className="fixed bottom-24 right-6 z-50 max-w-md w-full">
        <ModeSelection onSelectMode={handleSelectMode} />
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <TranscriptProvider>
        <EventProvider>
          {mode === 'voice' ? (
            <VoiceMode
              isConnected={isConnected}
              onToggleConnection={handleToggleConnection}
              onToggleMic={handleToggleMic}
              onToggleSpeaker={handleToggleSpeaker}
              isMicMuted={isMicMuted}
              isSpeakerMuted={isSpeakerMuted}
              onChangeMode={handleChangeMode}
              messages={messages}
            />
          ) : (
            <TextMode
              isConnected={isConnected}
              onToggleConnection={handleToggleConnection}
              onSendMessage={handleSendMessage}
              messages={messages}
              onChangeMode={handleChangeMode}
            />
          )}
        </EventProvider>
      </TranscriptProvider>
    </div>
  );
};

export default VoiceWidgetController;
