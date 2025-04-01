
import React, { useEffect, useState, useRef } from 'react';
import * as TextChatConnection from './TextChatConnection';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { Mic, X, MicOff, VolumeX } from 'lucide-react';
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
  
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: crypto.randomUUID(),
        text: "Hello! I am Enzo, your AI Agent to help you shop.",
        sender: 'remote',
        timestamp: new Date()
      }]);
    }
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    const handleMessage = (message: string) => {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        text: message,
        sender: 'remote',
        timestamp: new Date()
      }]);
    };
    
    if (isConnected) {
      TextChatConnection.onMessageReceived(handleMessage);
    }
    
    return () => {
      if (isConnected) {
        TextChatConnection.closeConnection();
      }
      // Always cleanup any real-time connections to ensure microphone is released
      cleanupConnection(pcRef.current);
      pcRef.current = null;
      if (audioElementRef.current) {
        audioElementRef.current.srcObject = null;
      }
    };
  }, [isConnected]);

  // Always ensure audio is muted in text chat mode
  useEffect(() => {
    // Create a silent audio element to maintain compatibility with WebRTC
    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.autoplay = false;
      audio.muted = true; // Always muted in text chat
      audioElementRef.current = audio;
    }
    
    // Ensure any active microphone track is disabled
    if (pcRef.current) {
      pcRef.current.getSenders().forEach(sender => {
        if (sender.track && sender.track.kind === 'audio') {
          sender.track.enabled = false;
        }
      });
    }
  }, []);
  
  const initializeConnection = async () => {
    setIsConnecting(true);
    try {
      const peerConnection = TextChatConnection.initializeConnection();
      const offer = await TextChatConnection.createOffer();
      const newConnectionId = crypto.randomUUID().substring(0, 8);
      setConnectionId(newConnectionId);
      setIsConnected(true);
      toast.success('Connection initialized. Share your connection ID with others.');
    } catch (error) {
      console.error('Failed to initialize connection:', error);
      toast.error('Failed to initialize connection');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const joinConnection = async () => {
    if (!remotePeerId) {
      toast.error('Please enter a connection ID');
      return;
    }
    
    setIsConnecting(true);
    try {
      const simulatedOffer = { type: 'offer', sdp: 'simulated-sdp' } as RTCSessionDescriptionInit;
      TextChatConnection.initializeConnection();
      await TextChatConnection.handleOffer(simulatedOffer);
      setIsConnected(true);
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
      if (isConnected) {
        TextChatConnection.sendMessage(inputValue);
      }
      
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        text: inputValue,
        sender: 'local',
        timestamp: new Date()
      }]);
      
      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleClose = () => {
    setMinimized(true);
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

      {!isConnected ? (
        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Start a new chat</h3>
              <p className="text-sm text-gray-500 mb-4">Connect with others to chat</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={initializeConnection}
                disabled={isConnecting}
                className="w-full bg-[#33C3F0] hover:bg-[#2AA9D2]"
              >
                Create New Chat
              </Button>
              
              {connectionId && (
                <div className="text-sm border p-3 rounded bg-gray-50 text-center">
                  Share this ID: <span className="font-bold">{connectionId}</span>
                </div>
              )}
              
              <div className="relative mt-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or join existing</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                <Input
                  value={remotePeerId}
                  onChange={(e) => setRemotePeerId(e.target.value)}
                  placeholder="Enter connection ID"
                  className="flex-1"
                />
                <Button 
                  onClick={joinConnection}
                  disabled={isConnecting || !remotePeerId}
                  variant="outline"
                >
                  Join
                </Button>
              </div>
            </div>
          </div>
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
                <MicOff className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TextChatComponent;
