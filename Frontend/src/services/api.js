import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios with default timeout
axios.defaults.timeout = 30000; // 30 seconds

// Simple retry mechanism
const fetchWithRetry = async (url, options = {}, retries = 2) => {
  try {
    return await axios(url, options);
  } catch (error) {
    if (retries === 0) throw error;
    
    console.log(`Retrying request to ${url}, ${retries} retries left`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    return fetchWithRetry(url, options, retries - 1);
  }
};

export const fetchStocks = async () => {
  try {
    const response = await fetchWithRetry(`${API_URL}/stocks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

export const fetchStockData = async (ticker, minutes) => {
  try {
    if (!ticker) throw new Error('Ticker symbol is required');
    
    const url = `${API_URL}/stocks/${ticker}${minutes ? `?minutes=${minutes}` : ''}`;
    const response = await fetchWithRetry(url);
    
    if (!response.data) {
      throw new Error('Empty response received from API');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
    throw error;
  }
};

export const fetchStockAverage = async (ticker, minutes) => {
  try {
    if (!ticker) throw new Error('Ticker symbol is required');
    if (!minutes) throw new Error('Minutes parameter is required');
    
    console.log(`Fetching average for ${ticker} with ${minutes} minutes timeframe`);
    
    const url = `${API_URL}/stocks/${ticker}/average?minutes=${minutes}`;
    const response = await fetchWithRetry(url);
    
    if (!response.data || !response.data.priceHistory) {
      throw new Error('Invalid or empty response structure from API');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching average for ${ticker}:`, error);
    
    // Check if it's a specific backend error
    if (error.response?.data?.error) {
      const serverError = new Error(error.response.data.error);
      serverError.details = error.response.data.details;
      throw serverError;
    }
    
    throw error;
  }
};

export const fetchStockCorrelation = async (minutes, ticker1, ticker2) => {
  try {
    if (!minutes) throw new Error('Minutes parameter is required');
    if (!ticker1 || !ticker2) throw new Error('Two ticker symbols are required');
    
    const url = `${API_URL}/stockcorrelation?minutes=${minutes}&ticker=${ticker1}&ticker=${ticker2}`;
    const response = await fetchWithRetry(url);
    
    if (!response.data) {
      throw new Error('Empty response received from API');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching correlation:', error);
    throw error;
  }
}; 