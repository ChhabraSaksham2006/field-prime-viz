import { useState, useEffect } from 'react';
import apiService from '@/lib/api-service';

// Hook for loading initial data from API
export const useApiData = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load hyperspectral data
        const loadDataResponse = await apiService.loadData();
        console.log('Data loaded successfully:', loadDataResponse);
        
        if (loadDataResponse.success) {
          // Run analysis on the loaded data
          const analysisResponse = await apiService.runAnalysis();
          console.log('Analysis completed successfully:', analysisResponse);
          
          if (analysisResponse.success) {
            setData(analysisResponse);
          } else {
            setError(analysisResponse.message || 'Error running analysis');
          }
        } else {
          setError(loadDataResponse.message || 'Error loading data');
        }
      } catch (err) {
        console.error('API error:', err);
        setError('Failed to fetch data from API');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

// Hook for running analysis on demand
export const useRunAnalysis = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.runAnalysis();
      
      if (response.success) {
        setData(response);
        return response;
      } else {
        setError(response.message || 'Error running analysis');
        return null;
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to run analysis');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, runAnalysis };
};

// Hook for getting spectral signature
export const useSpectralSignature = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSignature = async (x: number, y: number, cropType?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getSpectralSignature(x, y);
      
      if (response.success) {
        setData(response);
        return response;
      } else {
        setError(response.message || 'Error getting spectral signature');
        return null;
      }
    } catch (err) {
      console.error('Spectral signature error:', err);
      setError('Failed to get spectral signature');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, getSignature };
};