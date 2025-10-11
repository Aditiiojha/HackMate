import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import io from 'socket.io-client';
import { getChatHistory } from '../../services/chatService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;

const ChatWindow = ({ groupId }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Effect for setting up the socket connection and event listeners
  useEffect(() => {
    if (!currentUser) return;

    const connectSocket = async () => {
        // We need to get a fresh token for the socket connection
        const token = await currentUser.getIdToken();
        
        const newSocket = io(SOCKET_SERVER_URL, {
            auth: {
                token: token,
            },
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            newSocket.emit('join_group', { groupId });
        });

        newSocket.on('receive_message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        newSocket.on('error', (error) => {
            console.error("Socket Error:", error.message);
        });

        // Cleanup on component unmount
        return () => {
            newSocket.disconnect();
        };
    };

    const cleanupPromise = connectSocket();
    return () => {
        cleanupPromise.then(cleanup => cleanup && cleanup());
    };

  }, [groupId, currentUser]);

  // Effect for fetching historical messages
  useEffect(() => {
    const fetchHistory = async () => {
      if (!groupId) return;
      try {
        setLoadingHistory(true);
        const history = await getChatHistory(groupId); 
        setMessages(history);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [groupId]);

  const handleSendMessage = (content) => {
    if (socket && content.trim()) {
      socket.emit('send_message', { groupId, content });
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border rounded-lg shadow-md">
      <div className="p-4 border-b font-bold text-gray-800 bg-gray-50 rounded-t-lg">
        Team Chat
      </div>
      <MessageList messages={messages} loading={loadingHistory} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;