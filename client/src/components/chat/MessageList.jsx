import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';

const MessageList = ({ messages, loading }) => {
  const { dbUser } = useAuth();
  const endOfMessagesRef = useRef(null);

  // Automatically scroll to the bottom when new messages arrive
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-grow p-4 flex justify-center items-center">
        <p className="text-gray-500">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
      <div className="space-y-4">
        {messages.map((msg) => {
          // Check if the current user is the sender of the message
          const isSender = msg.senderId?._id === dbUser?._id;
          
          return (
            <div 
              key={msg._id || Math.random()} 
              className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              {!isSender && (
                <img 
                  src={msg.senderId?.profilePicture} 
                  alt={msg.senderId?.name} 
                  className="w-8 h-8 rounded-full object-cover self-start"
                />
              )}
              <div 
                className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
                  isSender 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border rounded-bl-none'
                }`}
              >
                {!isSender && (
                    <p className="text-xs font-bold text-indigo-700 mb-1">{msg.senderId?.name}</p>
                )}
                <p className="text-sm break-words">{msg.content}</p>
              </div>
            </div>
          );
        })}
        {/* Dummy div to mark the end of the messages for auto-scrolling */}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default MessageList;