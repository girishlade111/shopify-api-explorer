
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { Mic, X, MicOff, VolumeX, Send } from 'lucide-react';
import { createRealtimeConnection, cleanupConnection } from '../VoiceWidget/lib/realtimeConnection';

interface Message {
  id: string;
  text: string;
  sender: 'local' | 'remote';
  timestamp: Date;
}

export const TextChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const [remotePeerId, setRemotePeerId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [minimized, setMinimized] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const ephemeralKeyRef = useRef<string>('');
  const connectionAttemptRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: crypto.randomUUID(),
        text: "Hello! I am Enzo, your AI Agent to help you shop.",
        sender: 'remote',
        timestamp: new Date()
      }]);
    }

    // Generate a dummy ephemeral key for demo purposes
    // In a real application, this would be fetched from your backend
    ephemeralKeyRef.current = "sk-" + Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, "0")).join("");
      
    // Initialize audio element
    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.autoplay = false;
      audio.muted = true; // Always muted in text chat
      audioElementRef.current = audio;
    }
    
    // Auto-connect when the component mounts
    if (!isConnected && !isConnecting && !connectionAttemptRef.current) {
      connectionAttemptRef.current = true;
      initializeConnection();
    }
    
    return () => {
      // Clean up WebRTC resources when component unmounts
      cleanupResources();
    };
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const cleanupResources = () => {
    if (isConnected) {
      setIsConnected(false);
    }
    
    // Always cleanup any real-time connections to ensure microphone is released
    cleanupConnection(pcRef.current);
    pcRef.current = null;
    dcRef.current = null;
    
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
    }
  };
  
  const initializeConnection = async () => {
    setIsConnecting(true);
    try {
      console.log("Initializing WebRTC connection for text chat");
      // Create real-time connection with audio stream disabled
      const { pc, dc } = await createRealtimeConnection(
        ephemeralKeyRef.current,
        audioElementRef,
        false, // isAudioEnabled
        true   // skipAudioStream - this will keep the microphone muted
      );
      
      pcRef.current = pc;
      dcRef.current = dc;
      
      console.log("Connection established successfully");
      
      // Set up data channel event handlers
      dc.onmessage = (event) => {
        try {
          console.log("Received message:", event.data);
          const data = JSON.parse(event.data);
          if (data?.type === "response.done") {
            // Handle response.done event
            if (data?.response?.output?.[0]?.content?.[0]?.transcript) {
              const transcript = data.response.output[0].content[0].transcript;
              setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                text: transcript,
                sender: 'remote',
                timestamp: new Date()
              }]);
            }
          }
          else if (data?.item?.content?.[0]?.text || data?.item?.content?.[0]?.transcript) {
            const messageText = data.item.content[0].text || data.item.content[0].transcript;
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              text: messageText,
              sender: 'remote',
              timestamp: new Date()
            }]);
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };
      
      dc.onopen = () => {
        console.log("Data channel opened");
        setIsConnected(true);
        setIsConnecting(false);
        
        // Initialize the session with text-only mode
        const sessionUpdateEvent = {
          type: "session.update",
          session: {
            modalities: ["text"],
            instructions: "You are Enzo, a helpful AI shopping assistant.",
            tools: [],
            voice: "alloy",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: null,
            turn_detection: null,
          },
        };
        
        dc.send(JSON.stringify(sessionUpdateEvent));
      };
      
      dc.onclose = () => {
        console.log("Data channel closed");
        setIsConnected(false);
      };
      
      dc.onerror = (error) => {
        console.error("Data channel error:", error);
        setIsConnected(false);
        setIsConnecting(false);
        toast.error("Connection error. Please try again.");
      };
      
      const newConnectionId = crypto.randomUUID().substring(0, 8);
      setConnectionId(newConnectionId);
      
      toast.success('Connection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize connection:', error);
      toast.error('Failed to initialize connection: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsConnecting(false);
      cleanupResources();
    }
  };
  
  const joinConnection = async () => {
    if (!remotePeerId) {
      toast.error('Please enter a connection ID');
      return;
    }
    
    setIsConnecting(true);
    try {
      // For the demo, we'll just initialize a new connection instead of
      // actually joining an existing one
      await initializeConnection();
      
      toast.success('Connected successfully');
    } catch (error) {
      console.error('Failed to join connection:', error);
      toast.error('Failed to join connection');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
    try {
      // Add message to local state
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        text: inputValue,
        sender: 'local',
        timestamp: new Date()
      }]);
      
      // Send message through data channel if connected
      if (isConnected && dcRef.current && dcRef.current.readyState === 'open') {
        const messageObj = {
          type: "conversation.item.create",
          item: {
            id: crypto.randomUUID(),
            type: "message",
            role: "user",
            content: [{ type: "input_text", text: inputValue }],
          },
        };
        dcRef.current.send(JSON.stringify(messageObj));
        
        // Request a response
        const responseObj = {
          type: "response.create"
        };
        dcRef.current.send(JSON.stringify(responseObj));
      } else {
        console.error('Cannot send message: not connected');
        toast.error('Not connected to AI. Please try reconnecting.');
      }
      
      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleClose = () => {
    setMinimized(true);
  };
  
  const handleReconnect = () => {
    cleanupResources();
    setTimeout(() => {
      initializeConnection();
    }, 500);
  };
  
  if (minimized) {
    return (
      <div 
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 right-6 bg-white rounded-full shadow-lg p-4 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all z-50"
      >
        <div className="w-10 h-10 rounded-full bg-[#33C3F0] flex items-center justify-center">
          {/* Empty blue circle */}
        </div>
        <span className="font-bold">Enzo AI</span>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 w-[320px] h-[500px] bg-white rounded-[20px] shadow-xl overflow-hidden flex flex-col z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center">
          <h2 className="text-lg font-medium">Enzo AI</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-gray-400 flex items-center">
            <MicOff size={16} className="mr-1" />
            <VolumeX size={16} />
          </div>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {!isConnected && !isConnecting ? (
        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Start a new chat</h3>
              <p className="text-sm text-gray-500 mb-4">Connect with our AI shopping assistant</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={initializeConnection}
                disabled={isConnecting}
                className="w-full bg-[#33C3F0] hover:bg-[#2AA9D2]"
              >
                {isConnecting ? 'Connecting...' : 'Connect to AI Assistant'}
              </Button>
              
              {connectionId && (
                <div className="text-sm border p-3 rounded bg-gray-50 text-center">
                  Connected successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isConnecting ? (
        <div className="flex-1 p-4 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33C3F0]"></div>
          <p className="mt-4 text-gray-500">Connecting to AI Assistant...</p>
        </div>
      ) : (
        <ScrollArea className="flex-1 py-2">
          <div className="space-y-4 px-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'local' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'remote' && (
                  <div className="w-8 h-8 rounded-full bg-[#33C3F0] flex-shrink-0 mr-2 flex items-center justify-center">
                    {/* AI icon could go here */}
                  </div>
                )}
                <div 
                  className={`max-w-[75%] px-4 py-2 rounded-[18px] ${
                    message.sender === 'local' 
                      ? 'bg-[#33C3F0] text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}
      
      {isConnected && (
        <div className="px-4 py-3 pb-4 mt-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="flex-1 bg-gray-100 rounded-full overflow-hidden flex items-center pl-4 pr-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
              <button 
                type="submit"
                className="w-8 h-8 rounded-full bg-[#33C3F0] flex items-center justify-center text-white"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
          
          {!isConnected && (
            <div className="mt-2 text-center">
              <button 
                onClick={handleReconnect} 
                className="text-xs text-[#33C3F0] hover:underline"
              >
                Connection lost. Click to reconnect.
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextChatComponent;
