
import React, { useState } from 'react';
import { Menu, ArrowLeft, Send, Mic, X } from 'lucide-react';
import { TranscriptProvider } from './contexts/TranscriptContext';
import { EventProvider } from './contexts/EventContext';
import CopilotDemoApp from './CopilotDemoApp';

interface AtelierChatProps {
  onClose: (e: React.MouseEvent) => void;
}

const AtelierChat = ({ onClose }: AtelierChatProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    console.log('Sending message:', userMessage);
    setUserMessage('');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 w-[350px] bg-white rounded-[24px] shadow-lg transition-all duration-300 overflow-hidden">
      <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-gray-100 z-50">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Menu"
        >
          {showSettings ? (
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
        </button>
        <h2 className="text-xl font-bold">Enzo AI</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close chat assistant"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="h-[420px] overflow-hidden bg-white">
        <TranscriptProvider>
          <EventProvider>
            <CopilotDemoApp
              initialSessionStatus="CONNECTED"
              onSessionStatusChange={() => {}}
              peerConnection={null}
              dataChannel={null}
              isTranscriptionEnabled={true}
              isAudioEnabled={true}
              instructions=""
              tools={[]}
              isVoiceMode={false}
            />
          </EventProvider>
        </TranscriptProvider>
      </div>
    </div>
  );
};

export default AtelierChat;
