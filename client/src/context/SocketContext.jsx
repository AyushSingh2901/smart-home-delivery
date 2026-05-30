import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return undefined;
    const instance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050', {
      auth: { token: localStorage.getItem('smartHomeToken') }
    });
    setSocket(instance);
    return () => instance.disconnect();
  }, [user]);

  const value = useMemo(() => ({ socket }), [socket]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
