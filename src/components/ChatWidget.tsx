
import React, { useEffect, useRef, useState } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const ChatMessage = ({ message }: { message: Message }) => (
    <div 
      className={`message-container ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!message.isUser && (
        <div className="bot-avatar">E</div>
      )}
      <div className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
        {message.text}
      </div>
    </div>
  );

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

  return (
    <div className="fixed bottom-6 left-6 w-80 bg-white rounded-lg shadow-lg 
                overflow-hidden flex flex-col animate-fade-in z-50" style={{ height: '500px' }}>
      {/* Fixed header */}
      <div className="flex justify-between items-center p-3 border-b">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MessageSquare className="w-5 h-5 text-gray-500" />
        </button>
        <div className="font-semibold">Enzo AI</div>
        <button 
          onClick={() => setIsMinimized(true)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      {/* Scrollable message container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto flex flex-col chat-container bg-white w-full"
      >
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Fixed footer with input */}
      <div className="p-3 bg-white border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center"
        >
          <input
            type="text"
            className="flex-1 border rounded-l-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#55c6ea]"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            type="submit"
            className="bg-[#55c6ea] text-white rounded-r-full px-4 py-2 hover:bg-[#42b6da]"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
