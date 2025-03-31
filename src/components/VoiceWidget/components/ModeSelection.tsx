
import React from 'react';
import { Mic, MessageSquare } from 'lucide-react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'voice' | 'text') => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">How do you want to chat today?</h2>
      <div className="flex gap-4">
        <button 
          onClick={() => onSelectMode('voice')}
          className="flex flex-col items-center justify-center gap-2 p-6 bg-[#5856d6] hover:bg-[#4745ac] rounded-lg transition-colors w-36 h-36"
        >
          <Mic className="w-10 h-10 text-white" />
          <span className="text-white font-medium">Voice</span>
        </button>
        <button 
          onClick={() => onSelectMode('text')}
          className="flex flex-col items-center justify-center gap-2 p-6 bg-[#5856d6] hover:bg-[#4745ac] rounded-lg transition-colors w-36 h-36"
        >
          <MessageSquare className="w-10 h-10 text-white" />
          <span className="text-white font-medium">Text</span>
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;
