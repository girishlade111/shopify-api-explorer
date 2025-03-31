
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Transcript from './Transcript';

interface TextModeProps {
  isConnected: boolean;
  onToggleConnection: () => void;
  onSendMessage: (message: string) => void;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>;
  onChangeMode: () => void;
}

const TextMode: React.FC<TextModeProps> = ({ 
  isConnected, 
  onToggleConnection, 
  onSendMessage, 
  messages,
  onChangeMode
}) => {
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-semibold">Atelier Assistant</h2>
      </div>
      
      <div className="p-4">
        <button 
          onClick={onToggleConnection} 
          className={`w-full py-3 rounded-full text-white font-medium text-lg ${
            isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } transition-colors`}
        >
          {isConnected ? 'Disconnect' : 'Connect to Chat'}
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <Transcript 
          messages={messages}
          userText={inputText}
          setUserText={setInputText}
          onSendMessage={handleSendMessage}
          canSend={isConnected}
        />
      </div>
      
      <div className="p-4 border-t">
        <button 
          onClick={onChangeMode}
          className="w-full mt-4 py-3 px-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <span className="text-gray-700">Switch to Voice Mode</span>
        </button>
      </div>
    </div>
  );
};

export default TextMode;
