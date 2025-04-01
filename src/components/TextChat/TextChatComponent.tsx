
import React, { useEffect, useState, useRef } from 'react';
import * as TextChatConnection from './TextChatConnection';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { Mic, X } from 'lucide-react';

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
  
  // Add initial welcome message when chat first loads
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
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle incoming messages
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
    };
  }, [isConnected]);
  
  const initializeConnection = async () => {
    setIsConnecting(true);
    try {
      // Initialize WebRTC connection (no audio stream)
      const peerConnection = TextChatConnection.initializeConnection();
      
      // Create an offer
      const offer = await TextChatConnection.createOffer();
      
      // Here you would typically send this offer to your signaling server
      // For demo purposes, we'll generate a connection ID
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
      // Here you would typically fetch the offer from your signaling server using the remotePeerId
      // For demo purposes, we'll simulate receiving an offer
      const simulatedOffer = { type: 'offer', sdp: 'simulated-sdp' } as RTCSessionDescriptionInit;
      
      // Initialize connection and handle the offer
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
      
      // Add message to local state
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        text: inputValue,
        sender: 'local',
        timestamp: new Date()
      }]);
      
      // Clear input
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
  
  // Main chat component
  return (
    <div className="fixed bottom-6 right-6 w-[350px] h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col z-50 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <div className="w-5 h-[3px] bg-gray-600 rounded-full mb-1"></div>
          <div className="w-5 h-[3px] bg-gray-600 rounded-full mb-1"></div>
          <div className="w-5 h-[3px] bg-gray-600 rounded-full"></div>
        </button>
        <h2 className="text-xl font-bold">Enzo AI</h2>
        <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Chat area */}
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
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'local' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'remote' && (
                  <div className="w-8 h-8 rounded-full bg-[#33C3F0] flex-shrink-0 mr-2"></div>
                )}
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.sender === 'local' 
                      ? 'bg-[#33C3F0] text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}
      
      {/* Message input */}
      {isConnected && (
        <div className="p-4 bg-gray-50">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 bg-white rounded-full border pl-4 pr-2 py-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
            <button 
              type="submit"
              className="w-10 h-10 bg-[#33C3F0] rounded-full flex items-center justify-center text-white"
            >
              <Mic className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TextChatComponent;
