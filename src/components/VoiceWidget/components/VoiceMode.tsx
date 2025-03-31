
import React from 'react';
import { Mic, Speaker, X } from 'lucide-react';

interface VoiceModeProps {
  isConnected: boolean;
  onToggleConnection: () => void;
  onToggleMic?: () => void;
  onToggleSpeaker?: () => void;
  isMicMuted: boolean;
  isSpeakerMuted: boolean;
  onChangeMode: () => void;
}

const VoiceMode: React.FC<VoiceModeProps> = ({ 
  isConnected, 
  onToggleConnection, 
  onToggleMic, 
  onToggleSpeaker, 
  isMicMuted, 
  isSpeakerMuted,
  onChangeMode 
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Atelier Assistant</h2>
        <div className="flex gap-2">
          <button 
            onClick={onToggleMic}
            className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Mic className={`w-5 h-5 ${isMicMuted ? 'text-red-500' : 'text-gray-700'}`} />
            {isMicMuted && <X className="w-3 h-3 absolute text-red-500 translate-x-2 translate-y-2" />}
          </button>
          <button 
            onClick={onToggleSpeaker}
            className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Speaker className={`w-5 h-5 ${isSpeakerMuted ? 'text-red-500' : 'text-gray-700'}`} />
            {isSpeakerMuted && <X className="w-3 h-3 absolute text-red-500 translate-x-2 translate-y-2" />}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <button 
          onClick={onToggleConnection} 
          className={`w-full py-3 rounded-full text-white font-medium text-lg ${
            isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } transition-colors`}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto min-h-[300px]">
        {/* Session info and transcript would go here */}
        <div className="text-gray-500 text-sm">
          <p>16:06</p>
          <p>► Instructions</p>
          <p className="mt-2">16:06</p>
          <p>► Available Tools</p>
          <p className="mt-2">16:06</p>
          <p>session.id: sess_BHB0pxmbdwkxcaigCz8x0</p>
          <p>Started at: 31/03/2025, 16:06:49</p>
        </div>
      </div>
      
      <div className="mt-auto p-4">
        <button 
          onClick={onChangeMode}
          className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-between transition-colors"
        >
          <span className="text-gray-700">Switch to Text Mode</span>
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default VoiceMode;
