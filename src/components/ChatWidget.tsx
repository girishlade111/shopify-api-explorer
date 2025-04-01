
import React, { useEffect, useRef, useState } from 'react';
import { Send, X, MessageSquare, Menu, ArrowUp, RefreshCw, Headphones, Mic } from 'lucide-react';
import '../styles/chat-widget.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I assist you today?',
      isUser: false
    },
    {
      id: '2',
      text: 'I\'m looking for a new jacket',
      isUser: true
    },
    {
      id: '3',
      text: 'Could you please let me know what you\'re looking for? Are you shopping for something specific or need help finding a particular item?',
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: input,
        isUser: true
      };
      setMessages([...messages, newMessage]);
      
      // Simulate bot response after a short delay
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message. How else can I assist you today?',
          isUser: false
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
      
      setInput('');
    }
  };

  const handleResetChat = () => {
    // Reset the chat with initial greeting
    setMessages([{
      id: Date.now().toString(),
      text: 'Hello! How can I assist you today?',
      isUser: false
    }]);
    setIsSidePanelOpen(false);
  };

  const handleSpeakToHuman = () => {
    const newMessage = {
      id: Date.now().toString(),
      text: "I would like to speak with a human representative, please.",
      isUser: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: "I'll connect you with a human representative shortly. Please wait a moment.",
        isUser: false
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
    
    setIsSidePanelOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 left-6 bg-white rounded-full shadow-lg p-4 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all z-50"
      >
        <div className="w-10 h-10 rounded-full bg-[#55c6ea] flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold">Enzo AI</span>
      </div>
    );
  }

  if (isSidePanelOpen) {
    return (
      <div className="fixed bottom-6 left-6 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50" 
           style={{ height: '500px' }}>
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setIsSidePanelOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4 mt-4">
              <button 
                onClick={() => setIsSidePanelOpen(false)}
                className="flex items-center gap-3 w-full rounded-md py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Switch to Voice</span>
              </button>
              
              <button 
                onClick={handleSpeakToHuman}
                className="flex items-center gap-3 w-full rounded-md py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Headphones size={18} className="text-gray-700" />
                <span>Speak to Human</span>
              </button>
              
              <button 
                onClick={handleResetChat}
                className="flex items-center gap-3 w-full rounded-md py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <RefreshCw size={18} className="text-gray-700" />
                <span>Reset Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 w-80 bg-white rounded-lg shadow-lg 
                    overflow-hidden flex flex-col animate-fade-in z-50" style={{ height: '500px' }}>
      {/* Fixed position header that stays in place */}
      <div className="chat-header">
        <button 
          onClick={() => setIsSidePanelOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <span className="text-lg font-bold text-black">Enzo AI</span>
        </div>
        <button 
          onClick={() => setIsMinimized(true)}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Scrollable chat content */}
      <div 
        ref={messagesContainerRef}
        className="chat-widget-messages"
      >
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message-container ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="bot-avatar">E</div>
            )}
            <div className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Fixed position footer input area */}
      <div className="chat-widget-input">
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          {input.trim() ? (
            <button 
              onClick={handleSend}
              className="chat-send-button"
              aria-label="Send message"
            >
              <ArrowUp size={16} />
            </button>
          ) : (
            <button 
              className="chat-send-button"
              aria-label="Voice input"
            >
              <Mic size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
