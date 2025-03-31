
import React, { useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { useTranscript } from '../contexts/TranscriptContext';

interface TranscriptProps {
  userText: string;
  setUserText: (text: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
  showTextInput?: boolean;
  isVoiceMode?: boolean;
  onSwitchToVoice?: () => void; // New prop for handling switch to voice mode
}

function Transcript({ 
  userText, 
  setUserText, 
  onSendMessage, 
  canSend, 
  showTextInput = true,
  isVoiceMode = false,
  onSwitchToVoice
}: TranscriptProps) {
  const { transcriptItems } = useTranscript();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcriptItems]);

  useEffect(() => {
    resizeTextarea();
  }, [userText]);

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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {transcriptItems.map((item) => (
          <div
            key={item.itemId}
            className={`flex ${
              item.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {item.role === 'assistant' && (
              <div className="w-10 h-10 rounded-full bg-[#5BC0DE] mr-2 flex-shrink-0"></div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                item.role === 'user'
                  ? 'bg-[#f0f0f0] text-gray-800 rounded-br-none'
                  : 'bg-[#f5f5f5] text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{item.title}</p>
            </div>
          </div>
        ))}
        {transcriptItems.length === 0 && (
          <div className="h-full flex items-center justify-center opacity-60">
            <p className="text-center text-gray-500">
              {showTextInput 
                ? "Send a message to start chatting"
                : "Use the microphone to start talking"
              }
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showTextInput && (
        <div className="px-4 py-3 border-t">
          <div className="relative flex items-center">
            <input
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="w-full p-3 pl-4 pr-20 border rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-[#5BC0DE] focus:border-transparent bg-[#f5f5f5]"
              disabled={!canSend}
            />
            <div className="absolute right-2 flex gap-2">
              <button
                onClick={onSendMessage}
                disabled={!canSend || !userText.trim()}
                className={`p-2 rounded-full ${
                  canSend && userText.trim()
                    ? 'text-white bg-[#5BC0DE] hover:bg-[#46b8da]'
                    : 'text-gray-300 bg-gray-100 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
              </button>
              <button
                onClick={onSwitchToVoice}
                className="p-2 rounded-full text-white bg-[#5BC0DE] hover:bg-[#46b8da]"
              >
                <Mic size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {!showTextInput && !isVoiceMode && (
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-gray-500">Talk here</p>
        </div>
      )}
    </div>
  );
}

export default Transcript;
