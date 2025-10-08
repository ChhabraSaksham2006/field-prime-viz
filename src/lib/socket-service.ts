import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private _isConnected: boolean = false;
  private url: string;

  constructor() {
    console.log('SocketService constructor called');
    this.url = 'https://web-production-edf4d.up.railway.app';
    console.log('SocketService initialized with URL:', this.url);
  }

  // Initialize the socket connection
  connect() {
    console.log('SocketService.connect() called - Socket.IO is disabled, using REST API only');
    console.log('REST API is available at https://web-production-edf4d.up.railway.app');
    
    // Prevent Socket.IO connection since we're using REST API
    // Keep the method for backward compatibility but don't actually connect
    return;
  }

  // Disconnect the socket
  disconnect() {
    console.log('SocketService.disconnect() called - Socket.IO is disabled');
    // No-op since we're not connecting
  }

  // Check if socket is connected
  isConnected() {
    console.log('SocketService.isConnected() called - Socket.IO is disabled, returning false');
    return false;
  }

  // Request specific data from the server
  requestData(event: string, payload?: any) {
    console.log(`SocketService.requestData() called with event: ${event} - Socket.IO is disabled, using REST API instead`);
    // No-op since we're using REST API
  }

  // Add a listener for a specific event
  addListener(event: string, callback: (data: any) => void) {
    console.log(`SocketService.addListener() called for event: ${event} - Socket.IO is disabled, listener will not be active`);
    // Store listeners for compatibility but don't actually use them
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  // Remove a listener for a specific event
  removeListener(event: string, callback: (data: any) => void) {
    console.log(`SocketService.removeListener() called for event: ${event} - Socket.IO is disabled`);
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)?.delete(callback);
  }

  // Notify all listeners for a specific event
  private notifyListeners(event: string, data: any) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)?.forEach(callback => {
      callback(data);
    });
  }

  // Setup listeners for various data updates
  private setupDataListeners() {
    console.log('SocketService.setupDataListeners() called - Socket.IO is disabled, no listeners will be set up');
    // No-op since we're not using Socket.IO
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;