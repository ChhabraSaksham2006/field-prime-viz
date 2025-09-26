import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private _isConnected: boolean = false;
  private url: string;

  constructor() {
    console.log('SocketService constructor called');
    this.url = 'http://127.0.0.1:5000';
    console.log('SocketService initialized with URL:', this.url);
  }

  // Initialize the socket connection
  connect() {
    console.log('SocketService.connect() called');
    if (this.socket) {
      console.log('Socket already exists, skipping connect');
      return;
    }

    console.log('Attempting to connect to Socket.IO server at http://127.0.0.1:5000');
    
    // Connect to the backend server
    this.socket = io('http://127.0.0.1:5000', {
      transports: ['websocket', 'polling'], // Add polling as fallback
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000, // Increase timeout
    });

    console.log('Socket.IO instance created:', this.socket);
    console.log('Socket ID:', this.socket.id);
    console.log('Socket connected status:', this.socket.connected);

    // Setup event listeners
    console.log('Setting up socket event listeners...');
    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
      this._isConnected = true;
      // Request initial data when connected
      console.log('Emitting request_initial_data event');
      this.socket.emit('request_initial_data');
      // Notify listeners about connection
      this.notifyListeners('connect', {});
      console.log('Notified all connect listeners');
    });

    this.socket.on('connecting', () => {
      console.log('Socket is connecting...');
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Socket reconnection attempt ${attemptNumber}`);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this._isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      console.error('Connection error details:', error.message);
      this._isConnected = false;
      // Notify listeners about connection error
      this.notifyListeners('connection_error', { error: error.message });
    });
    
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this._isConnected = false;
      // Notify listeners about general socket error
      this.notifyListeners('socket_error', { error: error.message });
    });

    // Setup listeners for data updates
    this.setupDataListeners();
  }

  // Disconnect the socket
  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this._isConnected = false;
    this.socket = null;
  }

  // Check if socket is connected
  isConnected() {
    return this._isConnected;
  }

  // Request specific data from the server
  requestData(event: string, payload?: any) {
    if (!this.socket) return;
    this.socket.emit(event, payload);
  }

  // Add a listener for a specific event
  addListener(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    // If socket exists, add the listener
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove a listener for a specific event
  removeListener(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)?.delete(callback);

    // If socket exists, remove the listener
    if (this.socket) {
      this.socket.off(event, callback);
    }
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
    if (!this.socket) return;

    // Listen for IoT data updates
    this.socket.on('iot_data_update', (data) => {
      this.notifyListeners('iot_data_update', data);
    });

    // Listen for initial data
    this.socket.on('initial_data', (data) => {
      this.notifyListeners('initial_data', data);
    });

    // Listen for spectral data updates
    this.socket.on('spectral_update', (data) => {
      this.notifyListeners('spectral_update', data);
    });

    // Listen for prediction map updates
    this.socket.on('analysis_result', (data) => {
      this.notifyListeners('prediction_update', data);
      // Also notify for IoT data since it's included in the analysis result
      if (data.iot_data) {
        this.notifyListeners('iot_data_update', data.iot_data);
      }
    });

    // Listen for analysis errors
    this.socket.on('analysis_error', (data) => {
      this.notifyListeners('error', data);
    });
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;