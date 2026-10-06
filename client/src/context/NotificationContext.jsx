import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Listen to socket events
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewNotification = (data) => {
      addToast({
        title: data.title || 'Notification',
        message: data.message || '',
        type: data.type || 'info'
      });
      fetchNotifications();
    };

    const handleEmergency = (data) => {
      addToast({
        title: '🚨 EMERGENCY DISPATCH',
        message: `Emergency service requested at ${data.propertyName} for ${data.equipmentName}!`,
        type: 'danger'
      });
      fetchNotifications();
    };

    const handleJobAccepted = (data) => {
      addToast({
        title: 'Technician En Route',
        message: `${data.technician} accepted the job. ETA: ${data.etaMinutes} mins.`,
        type: 'success'
      });
      fetchNotifications();
    };

    const handleStatusChanged = (data) => {
      addToast({
        title: 'Job Status Updated',
        message: `Status updated to ${data.status?.replace(/_/g, ' ')}`,
        type: 'info'
      });
      fetchNotifications();
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('emergency:dispatched', handleEmergency);
    socket.on('job:accepted', handleJobAccepted);
    socket.on('job:status_changed', handleStatusChanged);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('emergency:dispatched', handleEmergency);
      socket.off('job:accepted', handleJobAccepted);
      socket.off('job:status_changed', handleStatusChanged);
    };
  }, [socket, user]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        addToast,
        removeToast,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
