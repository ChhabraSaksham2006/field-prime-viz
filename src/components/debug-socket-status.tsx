import React, { useEffect, useState } from 'react';
import socketService from '@/lib/socket-service';

export const DebugSocketStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('DebugSocketStatus: Component mounted');
    alert('DebugSocketStatus: Component mounted - this should appear if the component is rendering');
    
    // Force connection
    console.log('DebugSocketStatus: Attempting to connect...');
    alert('DebugSocketStatus: Attempting to connect to socket...');
    socketService.connect();
    
    const updateStatus = () => {
      const connected = socketService.isConnected();
      console.log('DebugSocketStatus: Connection status:', connected);
      alert(`DebugSocketStatus: Connection status - ${connected}`);
      setIsConnected(connected);
      
      // @ts-ignore - accessing private property for debugging
      const socket = socketService.socket;
      if (socket) {
        console.log('DebugSocketStatus: Socket ID:', socket.id);
        console.log('DebugSocketStatus: Socket connected:', socket.connected);
        setSocketId(socket.id);
      }
    };

    const handleConnect = () => {
      console.log('DebugSocketStatus: Connected event received');
      updateStatus();
    };

    const handleDisconnect = () => {
      console.log('DebugSocketStatus: Disconnected event received');
      updateStatus();
    };

    const handleError = (errorData: any) => {
      console.error('DebugSocketStatus: Error received:', errorData);
      setError(errorData.error);
    };

    // Add listeners
    socketService.addListener('connect', handleConnect);
    socketService.addListener('disconnect', handleDisconnect);
    socketService.addListener('connection_error', handleError);

    // Initial status check
    updateStatus();

    // Poll status every 2 seconds
    const interval = setInterval(updateStatus, 2000);

    return () => {
      clearInterval(interval);
      socketService.removeListener('connect', handleConnect);
      socketService.removeListener('disconnect', handleDisconnect);
      socketService.removeListener('connection_error', handleError);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-red-600 text-white p-6 rounded-lg shadow-2xl z-50 border-4 border-yellow-400">
      <h3 className="font-bold mb-2 text-xl">🔧 SOCKET DEBUG STATUS 🔧</h3>
      <div className="text-lg">Connected: {isConnected ? '✅ YES' : '❌ NO'}</div>
      <div className="text-lg">Socket ID: {socketId || 'none'}</div>
      <div className="text-sm mt-2">Component Status: MOUNTED</div>
      {error && <div className="text-red-200 text-sm mt-2 font-bold">Error: {error}</div>}
      <button 
        onClick={() => {
          console.log('Manual connect triggered');
          socketService.connect();
          alert('Manual connect button clicked!');
        }}
        className="mt-3 px-4 py-2 bg-yellow-500 text-black rounded text-lg font-bold hover:bg-yellow-400"
      >
        🚀 FORCE CONNECT 🚀
      </button>
    </div>
  );
};