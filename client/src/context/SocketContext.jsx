import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected to server:', socketInstance.id);
      setConnected(true);

      if (user) {
        socketInstance.emit('join', {
          userId: user._id,
          role: user.role
        });
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // When user changes/logs in, re-join user & role rooms
  useEffect(() => {
    if (socket && connected && user) {
      socket.emit('join', {
        userId: user._id,
        role: user.role
      });
    }
  }, [user, socket, connected]);

  const joinRequestRoom = (requestId) => {
    if (socket && requestId) {
      socket.emit('join_request', requestId);
    }
  };

  const leaveRequestRoom = (requestId) => {
    if (socket && requestId) {
      socket.emit('leave_request', requestId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connected, joinRequestRoom, leaveRequestRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
