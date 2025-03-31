
import React, { useRef, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { useTranscript } from '../contexts/TranscriptContext';

interface TranscriptProps {
  userText: string;
  setUserText: (text: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
  showTextInput?: boolean;
  isVoiceMode?: boolean;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcriptItems]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend && userText.trim()) {
        onSendMessage();
      }
    }
  };

  // For voice mode, return empty div without any padding
  if (isVoiceMode) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {transcriptItems.length === 0 ? (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#5ac8fa]"></div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
              <p className="text-gray-800">
                Hello! I am Enzo, your AI Agent to help you shop.
              </p>
            </div>
          </div>
        ) : (
          transcriptItems.map((item) => (
            <div
              key={item.itemId}
              className={`flex ${
                item.role === 'user' ? 'justify-end' : 'items-start space-x-3'
              }`}
            >
              {item.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#5ac8fa]"></div>
                </div>
              )}
              <div
                className={`p-3 rounded-2xl ${
                  item.role === 'user'
                    ? 'bg-[#5ac8fa] text-white'
                    : 'bg-gray-100 text-gray-800'
                } max-w-[80%]`}
              >
                <p className="whitespace-pre-wrap">{item.title}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {showTextInput && (
        <div className="px-4 py-3 border-t bg-[#f8f8f8]">
          <div className="relative flex items-center">
            <input
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="w-full p-3 pr-12 border rounded-full bg-[#f1f1f1] focus:outline-none focus:ring-2 focus:ring-[#5ac8fa] focus:border-transparent"
              disabled={!canSend}
            />
            <button
              onClick={onSendMessage}
              disabled={!canSend || !userText.trim()}
              className={`absolute right-2 p-2 rounded-full ${
                canSend && userText.trim()
                  ? 'bg-[#5ac8fa] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Mic size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transcript;
