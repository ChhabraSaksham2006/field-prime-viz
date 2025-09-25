import { useState, useEffect } from 'react';
import socketService from '@/lib/socket-service';
import apiService from '@/lib/api-service';
import { toast } from '@/hooks/use-toast';

// Hook for initial data loading
export const useInitialData = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionType, setConnectionType] = useState<'socket' | 'api' | 'none'>('none');

  useEffect(() => {
    let isMounted = true;
    // Connect to socket
    socketService.connect();
    
    // Update initial connection status
    setIsConnected(socketService.isConnected());
    
    // Set up listeners for connection status changes
    const handleConnect = () => {
      if (isMounted) {
        setIsConnected(true);
      }
    };
    
    const handleDisconnect = () => {
      if (isMounted) {
        setIsConnected(false);
      }
    };
    
    // Add listeners for connection events
    socketService.addListener('connect', handleConnect);
    socketService.addListener('disconnect', handleDisconnect);

    // Set up listener for initial data
    const handleInitialData = (initialData: any) => {
      if (isMounted) {
        setData(initialData);
        setIsLoading(false);
        setConnectionType('socket');
      }
    };

    // Set up error handlers
    const handleConnectionError = (errorData: any) => {
      console.warn('Socket connection error, falling back to API', errorData);
      if (isMounted) {
        setError(errorData.error);
        setIsConnected(false);
        // Fallback to API
        fetchDataFromApi();
      }
    };

    // Fallback function to fetch data from API
    const fetchDataFromApi = async () => {
      try {
        const apiData = await apiService.loadData();
        if (isMounted) {
          setData(apiData);
          setConnectionType('api');
          setIsLoading(false);
        }
      } catch (apiError) {
        if (isMounted) {
          setError('Failed to fetch data from both socket and API');
          setIsLoading(false);
          toast({
            title: 'Connection Error',
            description: 'Could not connect to the server. Please check your connection.',
            variant: 'destructive'
          });
        }
      }
    };

    socketService.addListener('initial_data', handleInitialData);
    socketService.addListener('connection_error', handleConnectionError);
    socketService.addListener('socket_error', handleConnectionError);

    // Request initial data
    socketService.requestData('request_initial_data');

    // Set a timeout for fallback to API if socket doesn't respond
    const timeoutId = setTimeout(() => {
      if (isMounted && !data) {
        console.warn('Socket timeout, falling back to API');
        fetchDataFromApi();
      }
    }, 5000); // 5 second timeout

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      socketService.removeListener('initial_data', handleInitialData);
      socketService.removeListener('connection_error', handleConnectionError);
      socketService.removeListener('socket_error', handleConnectionError);
    };
  }, []);

  return { data, isLoading, error, connectionType, isConnected };
};

// Hook for IoT data updates
export const useIoTData = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionType, setConnectionType] = useState<'socket' | 'api' | 'none'>('none');

  useEffect(() => {
    let isMounted = true;
    // Connect to socket
    socketService.connect();

    // Set up listener for IoT data updates
    const handleIoTUpdate = (iotData: any) => {
      if (isMounted) {
        setData(iotData);
        setIsLoading(false);
        setConnectionType('socket');
      }
    };

    // Set up error handlers
    const handleConnectionError = (errorData: any) => {
      console.warn('Socket connection error, falling back to API', errorData);
      if (isMounted) {
        setError(errorData.error);
        // Fallback to API
        fetchDataFromApi();
      }
    };

    // Fallback function to fetch data from API
    const fetchDataFromApi = async () => {
      try {
        // For IoT data, we can use the same endpoint as initial data
        // since it contains IoT data as well
        const apiData = await apiService.loadData();
        if (isMounted) {
          setData(apiData);
          setConnectionType('api');
          setIsLoading(false);
        }
      } catch (apiError) {
        if (isMounted) {
          setError('Failed to fetch IoT data from both socket and API');
          setIsLoading(false);
          toast({
            title: 'IoT Data Error',
            description: 'Could not retrieve IoT data. Please try again later.',
            variant: 'destructive'
          });
        }
      }
    };

    socketService.addListener('iot_data_update', handleIoTUpdate);
    socketService.addListener('initial_data', handleIoTUpdate); // Initial data also contains IoT data
    socketService.addListener('connection_error', handleConnectionError);
    socketService.addListener('socket_error', handleConnectionError);

    // Request initial data
    socketService.requestData('request_initial_data');

    // Set a timeout for fallback to API if socket doesn't respond
    const timeoutId = setTimeout(() => {
      if (isMounted && !data) {
        console.warn('Socket timeout for IoT data, falling back to API');
        fetchDataFromApi();
      }
    }, 5000); // 5 second timeout

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      socketService.removeListener('iot_data_update', handleIoTUpdate);
      socketService.removeListener('initial_data', handleIoTUpdate);
      socketService.removeListener('connection_error', handleConnectionError);
      socketService.removeListener('socket_error', handleConnectionError);
    };
  }, []);

  return { data, isLoading, error, connectionType };
};

// Hook for prediction map data
export const usePredictionMap = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionType, setConnectionType] = useState<'socket' | 'api' | 'none'>('none');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Connect to socket
    socketService.connect();

    // Set up listener for prediction updates
    const handlePredictionUpdate = (predictionData: any) => {
      if (isMounted) {
        setData(predictionData);
        setIsLoading(false);
        setConnectionType('socket');
        setIsConnected(true);
      }
    };

    // Set up error handlers
    const handleConnectionError = (errorData: any) => {
      console.warn('Socket connection error, falling back to API', errorData);
      if (isMounted) {
        setError(errorData.error);
        // Fallback to API
        fetchDataFromApi();
      }
    };

    // Fallback function to fetch data from API
    const fetchDataFromApi = async () => {
      try {
        const apiData = await apiService.runAnalysis();
        if (isMounted) {
          setData(apiData);
          setConnectionType('api');
          setIsLoading(false);
        }
      } catch (apiError) {
        if (isMounted) {
          setError('Failed to fetch prediction data from both socket and API');
          setIsLoading(false);
          toast({
            title: 'Analysis Error',
            description: 'Could not retrieve analysis data. Please try again later.',
            variant: 'destructive'
          });
        }
      }
    };

    socketService.addListener('prediction_update', handlePredictionUpdate);
    socketService.addListener('analysis_result', handlePredictionUpdate);
    socketService.addListener('connection_error', handleConnectionError);
    socketService.addListener('socket_error', handleConnectionError);

    // Request analysis
    socketService.requestData('request_analysis');

    // Set a timeout for fallback to API if socket doesn't respond
    const timeoutId = setTimeout(() => {
      if (isMounted && !data) {
        console.warn('Socket timeout for prediction data, falling back to API');
        fetchDataFromApi();
      }
    }, 5000); // 5 second timeout

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      socketService.removeListener('prediction_update', handlePredictionUpdate);
      socketService.removeListener('analysis_result', handlePredictionUpdate);
      socketService.removeListener('connection_error', handleConnectionError);
      socketService.removeListener('socket_error', handleConnectionError);
      socketService.removeListener('connect', handleConnect);
      socketService.removeListener('disconnect', handleDisconnect);
    };
  }, []);

  return { data, isLoading, error, connectionType };
};