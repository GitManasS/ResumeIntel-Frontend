import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getSocketUrl } from '../utils/apiUrl';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !localStorage.getItem('accessToken')) {
      socket?.disconnect();
      setSocket(null);
      return;
    }

    const socketUrl = getSocketUrl();

    const s = io(socketUrl, {
      auth: { token: localStorage.getItem('accessToken') },
      // Polling first works better through some CDNs / proxies; upgrades to WebSocket when possible
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
    });

    s.on('connect', () => {
      const orgId = user?.organization?._id || user?.organization;
      if (orgId) s.emit('join:organization', orgId);
    });

    s.on('connect_error', (err) => {
      if (import.meta.env.DEV) {
        console.warn('[socket] connect_error', socketUrl, err.message);
      }
    });

    s.on('notification:new', (payload) => {
      toast(payload.title || 'New notification', { icon: '🔔' });
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [isAuthenticated, user?.organization]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
