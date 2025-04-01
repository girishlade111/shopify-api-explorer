
import React from 'react';
import ChatWidget from '../components/ChatWidget';

const ChatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* This is just a placeholder page */}
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Product Page</h1>
        <p>This is a sample page content. The chat widget is fixed at the bottom left corner.</p>
      </div>
      
      {/* ChatWidget is now fixed at the bottom left */}
      <ChatWidget />
    </div>
  );
};

export default ChatPage;
