import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchStocks = async () => {
  try {
    const response = await axios.get(`${API_URL}/stocks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

export const fetchStockData = async (ticker, minutes) => {
  try {
    const url = `${API_URL}/stocks/${ticker}${minutes ? `?minutes=${minutes}` : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
    throw error;
  }
};

export const fetchStockAverage = async (ticker, minutes) => {
  try {
    const url = `${API_URL}/stocks/${ticker}/average?minutes=${minutes}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching average for ${ticker}:`, error);
    throw error;
  }
};

export const fetchStockCorrelation = async (minutes, ticker1, ticker2) => {
  try {
    const url = `${API_URL}/stockcorrelation?minutes=${minutes}&ticker=${ticker1}&ticker=${ticker2}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching correlation:', error);
    throw error;
  }
}; 