
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mic, X, ArrowUp, RefreshCw, Cloud, Info } from 'lucide-react';

// Different view components
const ClosedView = ({ onOpen }: { onOpen: () => void }) => (
  <div 
    className="flex items-center cursor-pointer bg-white rounded-3xl px-6 py-4 shadow-lg"
    onClick={onOpen}
  >
    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 mr-4"></div>
    <div className="text-xl font-medium">AI Assistant</div>
  </div>
);

const Greeting = ({ onChatOpen }: { onChatOpen: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "Hey there! How can I help you today?";
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div 
      className="flex items-center bg-white rounded-3xl px-6 py-4 shadow-lg cursor-pointer"
      onClick={onChatOpen}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 mr-4"></div>
      <div className="text-xl font-medium">
        {displayedText}
        <span className="ml-1 animate-pulse">|</span>
      </div>
    </div>
  );
};

const ModeSelect = ({ onModeSelect }: { onModeSelect: (mode: 'voice' | 'chat') => void }) => {
  return (
    <div className="w-72 bg-white rounded-lg shadow-lg p-5">
      <h3 className="text-center text-gray-700 font-medium mb-4">How do you want to chat today?</h3>
      <div className="flex gap-3">
        <button 
          onClick={() => onModeSelect('voice')}
          className="flex-1 h-20 bg-blue-500 text-white hover:bg-blue-600 transition-colors rounded-md shadow-sm flex flex-col items-center justify-center"
        >
          <Mic size={28} className="mb-1" />
          <span className="text-xs">Voice</span>
        </button>
        
        <button 
          onClick={() => onModeSelect('chat')}
          className="flex-1 h-20 bg-blue-500 text-white hover:bg-blue-600 transition-colors rounded-md shadow-sm flex flex-col items-center justify-center"
        >
          <MessageSquare size={28} className="mb-1" />
          <span className="text-xs">Text</span>
        </button>
      </div>
    </div>
  );
};

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  tool?: 'weather' | 'info';
}

const ChatMode = ({ 
  messages, 
  onSendMessage,
  onClose
}: { 
  messages: Message[], 
  onSendMessage: (text: string) => void,
  onClose: () => void
}) => {
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  // Tool visualization components
  const WeatherTool = () => (
    <div className="flex items-center px-3 py-1.5 bg-sky-50 rounded-lg border border-sky-200 shadow-sm">
      <Cloud size={18} className="text-sky-600 mr-2" />
      <div className="text-sm font-medium text-sky-800">
        Checking weather...
      </div>
    </div>
  );

  const InfoTool = () => (
    <div className="flex items-center px-3 py-1.5 bg-teal-50 rounded-lg border border-teal-200 shadow-sm">
      <Info size={18} className="text-teal-600 mr-2" />
      <div className="text-sm font-medium text-teal-800">
        Researching info...
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg flex flex-col" 
         style={{ height: '500px' }}>
      {/* Header with close button */}
      <div className="flex justify-between items-center p-3 border-b">
        <span className="text-lg font-bold">AI Assistant</span>
        <button 
          onClick={onClose} 
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Messages container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto flex flex-col"
      >
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`mb-3 max-w-[65%] ${
              message.sender === 'assistant' ? 'self-start' : 'self-end'
            }`}
          >
            {message.tool === 'weather' && <WeatherTool />}
            {message.tool === 'info' && <InfoTool />}
            
            <div className={`px-3 py-2 rounded-2xl text-sm ${
              message.sender === 'assistant' 
                ? 'bg-gray-100 text-gray-800' 
                : 'bg-blue-500 text-white'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex items-center gap-2 bg-gray-50 rounded-full p-2 pl-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus:outline-none"
          />
          <button 
            type="submit" 
            className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

const VoiceMode = ({ 
  isListening, 
  toggleListening,
  onClose
}: { 
  isListening: boolean, 
  toggleListening: () => void,
  onClose: () => void
}) => {
  const [volume, setVolume] = useState(0);
  
  // Simulate microphone volume for demo
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVolume(Math.random());
      }, 100);
      return () => clearInterval(interval);
    } else {
      setVolume(0);
    }
  }, [isListening]);
  
  // Scale animation based on volume
  const scale = 1 + (volume * 0.3);

  return (
    <div className="flex items-center bg-white rounded-3xl px-5 py-4 shadow-lg">
      <div 
        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 mr-4 cursor-pointer"
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.05s ease-out"
        }}
        onClick={toggleListening}
      />
      <div className="text-xl font-medium">
        {isListening ? "Listening..." : "Tap to speak"}
      </div>
      <button 
        onClick={onClose}
        className="ml-4 p-2 text-gray-600 hover:bg-gray-200 rounded-full"
      >
        <X size={20} />
      </button>
    </div>
  );
};

const ChatSidePanel = ({ 
  onResetChat, 
  onSwitchToVoice 
}: { 
  onResetChat: () => void, 
  onSwitchToVoice: () => void 
}) => {
  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="space-y-4 mt-4">
        <button 
          onClick={onSwitchToVoice}
          className="flex items-center gap-3 w-full rounded-md py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Mic size={18} className="text-gray-700" />
          <span>Switch to Voice</span>
        </button>
        
        <button 
          onClick={onResetChat}
          className="flex items-center gap-3 w-full rounded-md py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={18} className="text-gray-700" />
          <span>Reset Chat</span>
        </button>
      </div>
    </div>
  );
};

const VoiceWidget = () => {
  const [mode, setMode] = useState<'closed' | 'greeting' | 'select' | 'voice' | 'chat'>('closed'); 
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! How can I help you today?',
      timestamp: new Date()
    }
  ]);

  // Toggle listening state
  const toggleListening = () => {
    setIsListening(prev => !prev);
  };

  // Handle mode selection
  const handleModeSelect = (selectedMode: 'voice' | 'chat') => {
    setMode(selectedMode);
  };

  // Handle opening from closed state
  const handleOpenFromClosed = () => {
    setMode('greeting');
    
    // Auto transition to select mode after 3 seconds
    setTimeout(() => {
      if (mode === 'greeting') {
        setMode('select');
      }
    }, 3000);
  };

  // Handle opening from greeting
  const handleChatOpen = () => {
    setMode('select');
  };

  // Close the widget completely
  const handleClose = () => {
    setMode('closed');
    setIsListening(false);
  };

  // Send a message
  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      // Randomly show tools sometimes
      const shouldShowTool = Math.random() > 0.7;
      const toolType = Math.random() > 0.5 ? 'weather' : 'info';
      
      // If showing a tool, add a tool message first
      if (shouldShowTool) {
        const toolMessage: Message = {
          id: Date.now().toString(),
          sender: 'assistant',
          text: '',
          timestamp: new Date(),
          tool: toolType as 'weather' | 'info'
        };
        
        setMessages(prev => [...prev, toolMessage]);
        
        // Then after a delay, add the actual response
        setTimeout(() => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: `I received your message: "${text}"`,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, assistantMessage]);
        }, 1500);
      } else {
        // Regular response without tool
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `I received your message: "${text}"`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    }, 1000);
  };

  // Reset the chat
  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: 'Chat has been reset. How can I help you today?',
        timestamp: new Date()
      }
    ]);
  };

  // Switch from chat to voice mode
  const handleSwitchToVoice = () => {
    setMode('voice');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {mode === 'closed' && <ClosedView onOpen={handleOpenFromClosed} />}
      {mode === 'greeting' && <Greeting onChatOpen={handleChatOpen} />}
      {mode === 'select' && <ModeSelect onModeSelect={handleModeSelect} />}
      {mode === 'voice' && (
        <VoiceMode
          isListening={isListening}
          toggleListening={toggleListening}
          onClose={handleClose}
        />
      )}
      {mode === 'chat' && (
        <ChatMode
          messages={messages}
          onSendMessage={handleSendMessage}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default VoiceWidget;
