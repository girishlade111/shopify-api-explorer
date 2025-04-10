
import React from 'react';
import ChatWidget from '../components/ChatWidget';
import VoiceWidget from '../components/VoiceWidget';

const ChatPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md h-[440px] overflow-hidden">
        <ChatWidget />
      </div>
      <VoiceWidget />
    </div>
  );
};

export default ChatPage;
