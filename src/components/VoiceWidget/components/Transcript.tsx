
import React, { useRef, useEffect } from 'react';
import { Mic, Send, Cloud, DollarSign, Shirt, Navigation } from 'lucide-react';
import { useTranscript } from '../contexts/TranscriptContext';

interface TranscriptProps {
  userText: string;
  setUserText: (text: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
  showTextInput?: boolean; // Controls visibility of the text input
  isVoiceMode?: boolean; // Controls if we're in voice-only mode
  onSwitchToVoiceMode?: () => void; // New prop for switching to voice mode
}

function Transcript({ 
  userText, 
  setUserText, 
  onSendMessage, 
  canSend, 
  showTextInput = true,
  isVoiceMode = false,
  onSwitchToVoiceMode
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

  // Get function icon based on function name
  const getFunctionIcon = (functionName: string) => {
    switch (functionName) {
      case 'search_products':
      case 'get_similar_products':
      case 'display_products':
        return <DollarSign className="w-5 h-5" />;
      case 'get_weather':
        return <Cloud className="w-5 h-5" />;
      case 'navigate_to_product':
      case 'navigate_to_cart':
      case 'navigate_to_wishlist':
        return <Navigation className="w-5 h-5" />;
      case 'add_to_cart':
      case 'remove_from_cart':
      case 'add_to_wishlist':
      case 'remove_from_wishlist':
        return <Shirt className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  // Get function colors based on function name
  const getFunctionStyles = (functionName: string) => {
    switch (functionName) {
      case 'search_products':
      case 'get_similar_products':
      case 'display_products':
        return {
          bg: 'bg-[#FEF7CD]',
          border: 'border-[#F97316]',
          text: 'text-[#8B5CF6]',
          icon: 'text-[#F97316]'
        };
      case 'get_weather':
        return {
          bg: 'bg-[#D3E4FD]',
          border: 'border-[#0EA5E9]',
          text: 'text-[#0EA5E9]',
          icon: 'text-[#0EA5E9]'
        };
      case 'navigate_to_product':
      case 'navigate_to_cart':
      case 'navigate_to_wishlist':
        return {
          bg: 'bg-[#D3E4FD]',
          border: 'border-[#0EA5E9]',
          text: 'text-[#0EA5E9]',
          icon: 'text-[#0EA5E9]'
        };
      case 'add_to_cart':
      case 'remove_from_cart':
      case 'add_to_wishlist':
      case 'remove_from_wishlist':
        return {
          bg: 'bg-[#FFDEE2]',
          border: 'border-[#D946EF]',
          text: 'text-[#D946EF]',
          icon: 'text-[#D946EF]'
        };
      default:
        return {
          bg: 'bg-[#F2FCE2]',
          border: 'border-[#8B5CF6]',
          text: 'text-[#8B5CF6]',
          icon: 'text-[#8B5CF6]'
        };
    }
  };

  // For voice mode, return a consistent bar UI with increased size
  if (isVoiceMode) {
    return (
      <div className="p-4 pb-8">
        <div className="flex items-center bg-gray-100 rounded-full py-4 px-4">
          <div className="w-full bg-transparent px-4 py-4 text-gray-500 font-medium">
            Voice mode active - speak to interact
          </div>
          <button className="bg-[#33C3F0] rounded-full p-4 mx-2">
            <Mic className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    );
  }

  // Extract function name from breadcrumb
  const getFunctionName = (data: any) => {
    if (!data) return null;
    
    // Case 1: Direct function call from function_call_arguments.done event
    if (data.attemptedEvent?.type === 'function_call_arguments.done') {
      return data.attemptedEvent?.name;
    }
    
    // Case 2: Function name in the title
    if (data.title) {
      const title = String(data.title || '').toLowerCase();
      if (title.includes('function call:')) {
        return title.split('function call:')[1].trim();
      }
    }
    
    // Case 3: Check if we have a name property directly in the data
    if (data.name) {
      return data.name;
    }
    
    return null;
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {transcriptItems.map((item) => {
          // Display function call breadcrumbs with special styling
          if (item.type === 'BREADCRUMB') {
            // Extract function name from the breadcrumb data
            const functionName = getFunctionName(item.data);
            
            if (functionName) {
              const { bg, border, text, icon } = getFunctionStyles(functionName);
              const formattedName = functionName
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              
              return (
                <div
                  key={item.itemId}
                  className="flex items-start mb-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#33C3F0] flex-shrink-0 mr-3"></div>
                  <div className={`p-2 pr-6 rounded-full ${bg} ${border} border`}>
                    <div className="flex items-center">
                      <div className={`${icon} rounded-full mr-2 flex-shrink-0`}>
                        {getFunctionIcon(functionName)}
                      </div>
                      <span className={`${text} font-medium`}>{formattedName}</span>
                    </div>
                  </div>
                </div>
              );
            }
          }
          
          // Regular user/assistant messages
          if (item.type === 'MESSAGE') {
            return (
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
            );
          }
          
          return null;
        })}
        <div ref={messagesEndRef} />
      </div>

      {showTextInput && (
        <div className="p-4 pb-24 mt-auto">
          <div className="flex items-center bg-gray-100 rounded-full py-3 px-4">
            <input
              ref={inputRef}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="w-full bg-transparent px-4 py-3 focus:outline-none rounded-full"
            />
            {userText.trim() ? (
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
            ) : (
              <button
                onClick={() => {
                  if (onSwitchToVoiceMode) {
                    onSwitchToVoiceMode();
                  }
                }}
                className="bg-[#33C3F0] rounded-full p-3 mx-2 text-white hover:bg-[#30B4DD]"
                aria-label="Switch to voice mode"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Transcript;
