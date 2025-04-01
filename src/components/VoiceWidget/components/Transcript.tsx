
import React, { useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { useTranscript } from '../contexts/TranscriptContext';

interface TranscriptProps {
  userText: string;
  setUserText: (text: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
  showTextInput?: boolean; // Controls visibility of the text input
  isVoiceMode?: boolean; // Controls if we're in voice-only mode
}

function Transcript({ 
  userText, 
  setUserText, 
  onSendMessage, 
  canSend, 
  showTextInput = true,
  isVoiceMode = false 
}: TranscriptProps) {
  const { transcriptItems } = useTranscript();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcriptItems]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (canSend && userText.trim()) {
        onSendMessage();
      }
    }
  };

  // For voice mode, return a consistent bar UI
  if (isVoiceMode) {
    return (
      <div className="p-4">
        <div className="flex items-center bg-gray-100 rounded-full">
          <div className="w-full bg-transparent px-4 py-3 text-gray-500">
            Voice mode active - speak to interact
          </div>
          <button className="bg-[#33C3F0] rounded-full p-3 mx-2">
            <Mic className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {transcriptItems.map((item) => (
          <div
            key={item.itemId}
            className={`flex ${
              item.role === 'user' ? 'justify-end' : 'items-start'
            } mb-4`}
          >
            {item.role !== 'user' && (
              <div className="w-10 h-10 rounded-full bg-[#33C3F0] flex-shrink-0 mr-3"></div>
            )}
            <div
              className={`p-4 rounded-lg ${
                item.role === 'user'
                  ? 'bg-[#33C3F0] text-white ml-auto max-w-[75%]'
                  : 'bg-gray-100 text-gray-800 max-w-[75%]'
              }`}
            >
              <p className="whitespace-pre-wrap">{item.title}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showTextInput && (
        <div className="p-4 border-t">
          <div className="flex items-center bg-gray-100 rounded-full">
            <input
              ref={inputRef}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="w-full bg-transparent px-4 py-3 focus:outline-none rounded-full"
              disabled={!canSend}
            />
            <button
              onClick={onSendMessage}
              disabled={!canSend || !userText.trim()}
              className={`bg-[#33C3F0] rounded-full p-3 mx-2 text-white ${
                canSend && userText.trim()
                  ? 'hover:bg-[#30B4DD]'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transcript;
