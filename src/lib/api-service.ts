import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

const apiService = {
  /**
   * Load hyperspectral data from the server
   */
  loadData: async () => {
    try {
      console.log('Fetching data from /api/load_data');
      const response = await api.get('/api/load_data');
      return response.data;
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error loading data',
        description: 'Could not connect to the server. Please try again later.',
        variant: 'destructive'
      });
      throw error;
    }
  },

  /**
   * Run analysis on the loaded data
   */
  runAnalysis: async () => {
    try {
      console.log('Fetching data from /api/run_analysis');
      // Use a longer timeout specifically for this intensive operation
      const response = await api.get('/api/run_analysis', {
        timeout: 60000 // 60 seconds timeout for this specific call
      });
      return response.data;
    } catch (error) {
      console.error('Error running analysis:', error);
      toast({
        title: 'Error running analysis',
        description: error.code === 'ECONNABORTED' ? 
          'Analysis timed out. The operation might be too intensive. Please try again later.' : 
          'Could not connect to the server. Please try again later.',
        variant: 'destructive'
      });
      throw error;
    }
  },

  /**
   * Get spectral signature for a specific pixel
   * @param x X coordinate
   * @param y Y coordinate
   * @param cropType Optional crop type for filtering
   */
  getSpectralSignature: async (x: number, y: number, cropType?: string) => {
    try {
      const response = await api.get('/api/get_spectral_signature', {
        params: { x, y, crop_type: cropType }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting spectral signature:', error);
      toast({
        title: 'Error getting spectral data',
        description: 'Could not retrieve spectral signature. Please try again later.',
        variant: 'destructive'
      });
      throw error;
    }
  }
};

export default apiService;