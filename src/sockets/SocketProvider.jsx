import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !localStorage.getItem('accessToken')) {
      socket?.disconnect();
      setSocket(null);
      return;
    }

    const s = io(SOCKET_URL, {
      auth: { token: localStorage.getItem('accessToken') },
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => {
      const orgId = user?.organization?._id || user?.organization;
      if (orgId) s.emit('join:organization', orgId);
    });

    s.on('notification:new', (payload) => {
      toast(payload.title || 'New notification', { icon: '🔔' });
    });

    setSocket(s);
    return () => s.disconnect();
  }, [isAuthenticated, user?.organization]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
