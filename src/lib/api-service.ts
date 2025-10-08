import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://web-production-edf4d.up.railway.app';

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
  },

  /**
   * Generate comprehensive agricultural report
   * @param format Report format (pdf, json)
   * @param includeIoT Include IoT sensor data
   * @param includeAnalysis Include AI analysis results
   * @param includeSpectral Include spectral analysis data
   */
  generateReport: async (format: 'pdf' | 'json' = 'pdf', includeIoT: boolean = true, includeAnalysis: boolean = true, includeSpectral: boolean = true) => {
    try {
      console.log(`Generating ${format} report...`);
      const response = await api.post('/api/generate_report', {
        format,
        include_iot: includeIoT,
        include_analysis: includeAnalysis,
        include_spectral: includeSpectral
      }, {
        timeout: 60000 // 60 seconds for report generation
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error generating report',
        description: error.code === 'ECONNABORTED' ? 
          'Report generation timed out. Please try again later.' : 
          'Could not generate report. Please try again later.',
        variant: 'destructive'
      });
      throw error;
    }
  },

  /**
   * Export dashboard data in various formats
   * @param format Export format (csv, json, xlsx)
   * @param dataTypes Types of data to export (iot, analysis, spectral)
   * @param dateRange Optional date range for data filtering
   */
  exportData: async (format: 'csv' | 'json' | 'xlsx' = 'csv', dataTypes: string[] = ['iot', 'analysis'], dateRange?: { start: string; end: string }) => {
    try {
      console.log(`Exporting data in ${format} format...`);
      const response = await api.post('/api/export_data', {
        format,
        data_types: dataTypes,
        date_range: dateRange
      }, {
        timeout: 30000 // 30 seconds for data export
      });
      
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Error exporting data',
        description: error.code === 'ECONNABORTED' ? 
          'Data export timed out. Please try again later.' : 
          'Could not export data. Please try again later.',
        variant: 'destructive'
      });
      throw error;
    }
  },

  /**
   * Download file helper function
   * @param blobData Blob data from API response
   * @param filename Filename for the downloaded file
   * @param mimeType MIME type of the file
   */
  downloadFile: (blobData: Blob, filename: string, mimeType: string) => {
    try {
      const blob = new Blob([blobData], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Download complete',
        description: `${filename} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error downloading file',
        description: 'Could not download the file. Please try again.',
        variant: 'destructive'
      });
    }
  }
};

export default apiService;