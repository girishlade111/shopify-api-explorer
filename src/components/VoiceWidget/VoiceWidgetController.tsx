
import React, { useState, useEffect, useRef } from 'react';
import { TranscriptProvider } from './contexts/TranscriptContext';
import { EventProvider } from './contexts/EventContext';
import ModeSelection from './components/ModeSelection';
import VoiceMode from './components/VoiceMode';
import TextMode from './components/TextMode';
import { ServerEvent } from './types';

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
  
  // Setup for handling server events
  const [sessionStatus, setSessionStatus] = useState('DISCONNECTED');
  
  useEffect(() => {
    // Disconnect when component unmounts
    return () => {
      if (isConnected) {
        handleDisconnect();
      }
    };
  }, []);

  const handleConnect = async () => {
    try {
      // Simulate connection
      setIsConnected(true);
      setSessionStatus('CONNECTED');
      
      // Add a welcome message
      addMessage({
        role: 'assistant',
        content: 'Hello! I am your Atelier Assistant. How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      
      console.log('Connected to server');
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Simulate disconnection
      setIsConnected(false);
      setSessionStatus('DISCONNECTED');
      console.log('Disconnected from server');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      handleDisconnect();
    } else {
      handleConnect();
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
      
      // Simulate a response after a short delay
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: `I received your message: "${message}"`,
        });
      }, 1000);
    }
  };

  const handleSelectMode = (selectedMode: 'voice' | 'text') => {
    // Disconnect if connected before changing modes
    if (isConnected) {
      handleDisconnect();
    }
    
    setMode(selectedMode);
    setIsMicMuted(false);
    setIsSpeakerMuted(false);
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
