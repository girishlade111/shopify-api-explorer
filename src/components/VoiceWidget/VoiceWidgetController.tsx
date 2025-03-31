
import React, { useState, useEffect, useRef } from 'react';
import { connectToServer, disconnectFromServer, toggleMic, toggleSpeaker } from './lib/realtimeConnection';
import { useTranscript } from './contexts/TranscriptContext';
import { useHandleServerEvent } from './hooks/useHandleServerEvent';
import { ServerEvent } from './types';
import ModeSelection from './components/ModeSelection';
import VoiceMode from './components/VoiceMode';
import TextMode from './components/TextMode';

type Mode = 'selection' | 'voice' | 'text';

const VoiceWidgetController: React.FC = () => {
  const [mode, setMode] = useState<Mode>('selection');
  const [isConnected, setIsConnected] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  
  const { messages, addMessage } = useTranscript();
  
  // Setup for handling server events
  const [sessionStatus, setSessionStatus] = useState('DISCONNECTED');
  const sendClientEvent = (eventObj: any, eventNameSuffix?: string) => {
    console.log("Sending client event:", eventObj, eventNameSuffix);
  };
  
  const handleServerEventRef = useHandleServerEvent({
    setSessionStatus: setSessionStatus,
    sendClientEvent: sendClientEvent
  });
  
  useEffect(() => {
    // Disconnect when component unmounts or mode changes
    return () => {
      if (isConnected) {
        handleDisconnect();
      }
    };
  }, []);

  const handleConnect = async () => {
    try {
      await connectToServer((event: ServerEvent) => {
        handleServerEventRef.current(event);
      });
      setIsConnected(true);
      console.log('Connected to server');
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectFromServer();
      setIsConnected(false);
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
    toggleMic();
    setIsMicMuted(!isMicMuted);
  };

  const handleToggleSpeaker = () => {
    toggleSpeaker();
    setIsSpeakerMuted(!isSpeakerMuted);
  };

  const handleSendMessage = (message: string) => {
    if (isConnected) {
      // Send message to server (this would need to be implemented in realtimeConnection.ts)
      // For now, just add it to the transcript
      addMessage({
        role: 'user',
        content: message,
        timestamp: new Date().toLocaleTimeString(),
      });
      
      // Simulate a response after a short delay
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: `I received your message: "${message}"`,
          timestamp: new Date().toLocaleTimeString(),
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
      <div className="fixed bottom-4 right-4 z-50 max-w-md w-full">
        <ModeSelection onSelectMode={handleSelectMode} />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {mode === 'voice' ? (
        <VoiceMode
          isConnected={isConnected}
          onToggleConnection={handleToggleConnection}
          onToggleMic={handleToggleMic}
          onToggleSpeaker={handleToggleSpeaker}
          isMicMuted={isMicMuted}
          isSpeakerMuted={isSpeakerMuted}
          onChangeMode={handleChangeMode}
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
    </div>
  );
};

export default VoiceWidgetController;
