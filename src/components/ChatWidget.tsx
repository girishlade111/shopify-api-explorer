
import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
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
      text: 'Could you please clarify what you\'re looking for? I\'d be happy to assist you.',
      isUser: false
    },
    {
      id: '2',
      text: 'dscakhd',
      isUser: true
    },
    {
      id: '3',
      text: 'It seems like there might be a typo. How can I assist you today? Are you looking for something specific?',
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-widget-container">
      <div className="chat-widget-header">
        <h2 className="text-xl font-semibold">Enzo AI</h2>
        <div className="w-10 h-5 rounded-full bg-gray-300 flex items-center px-1">
          <div className="w-4 h-4 rounded-full bg-gray-500 ml-auto"></div>
        </div>
      </div>
      
      <div className="chat-widget-messages" ref={messagesContainerRef}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message-container ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!msg.isUser && (
              <div className="bot-avatar">E</div>
            )}
            <div className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
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
          <button 
            className="chat-send-button"
            onClick={handleSend}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
