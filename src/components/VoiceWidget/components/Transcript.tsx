
import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useTranscript } from '../contexts/TranscriptContext';

interface TranscriptProps {
  userText: string;
  setUserText: (text: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
  showTextInput?: boolean; // Add this prop to control visibility of the text input
}

function Transcript({ userText, setUserText, onSendMessage, canSend, showTextInput = true }: TranscriptProps) {
  const { transcriptItems } = useTranscript();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Resize textarea based on content
  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [transcriptItems]);

  // Auto-resize textarea when text changes
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

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4 pb-0 space-y-4">
        {transcriptItems.map((item) => (
          <div
            key={item.itemId}
            className={`flex ${
              item.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                item.role === 'user'
                  ? 'bg-[#5856d6] text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
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
                ? "Send a message to start chatting with Atelier"
                : "Use the microphone to start talking with Atelier"}
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Only show the text input area if showTextInput is true */}
      {showTextInput && (
        <div className="px-4 py-3 border-t">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full p-3 pr-12 border rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-[#5856d6] focus:border-transparent"
              rows={1}
              disabled={!canSend}
            />
            <button
              onClick={onSendMessage}
              disabled={!canSend || !userText.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                canSend && userText.trim()
                  ? 'text-[#5856d6] hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      {/* When in voice mode, show an assistance message at the bottom */}
      {!showTextInput && (
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-gray-500">Talk to Atelier here</p>
        </div>
      )}
    </div>
  );
}

export default Transcript;
