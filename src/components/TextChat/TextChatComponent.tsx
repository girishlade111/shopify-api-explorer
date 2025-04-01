
import React, { useEffect, useState, useRef } from 'react';
import * as TextChatConnection from './TextChatConnection';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';

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
    if (!inputValue.trim() || !isConnected) return;
    
    try {
      TextChatConnection.sendMessage(inputValue);
      
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
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="text-lg font-semibold">Text Chat</h2>
        {isConnected ? (
          <p className="text-sm text-green-600">Connected</p>
        ) : (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2">
              <Button 
                onClick={initializeConnection} 
                disabled={isConnecting}
                variant="outline"
                size="sm"
              >
                Create New Chat
              </Button>
              {connectionId && (
                <div className="text-sm border px-2 py-1 rounded bg-gray-50">
                  ID: {connectionId}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
                placeholder="Enter connection ID"
                className="text-sm h-9"
              />
              <Button 
                onClick={joinConnection} 
                disabled={isConnecting || !remotePeerId}
                variant="outline"
                size="sm"
              >
                Join
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'local' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.sender === 'local' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-200 rounded-bl-none'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs ${message.sender === 'local' ? 'text-blue-100' : 'text-gray-500'} text-right mt-1`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={!isConnected}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!isConnected || !inputValue.trim()}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TextChatComponent;
