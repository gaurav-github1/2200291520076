import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchStockAverage } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ ticker, minutes }) => {
  const [stockData, setStockData] = useState({
    averageStockPrice: 0,
    priceHistory: [],
    dataPoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!ticker || !minutes) {
        setDebugInfo(`Missing parameters: ticker=${ticker}, minutes=${minutes}`);
        return;
      }
      
      try {
        setLoading(true);
        setDebugInfo(`Fetching data for ${ticker} with timeframe ${minutes} minutes...`);
        
        const data = await fetchStockAverage(ticker, minutes);
        console.log("Received stock data:", data);
        
        if (!data || !data.priceHistory || data.priceHistory.length === 0) {
          setDebugInfo(`Received empty data for ${ticker} with timeframe ${minutes} minutes.`);
        } else {
          setDebugInfo(null);
        }
        
        setStockData(data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching stock data for ${ticker}:`, err);
        setError(`Failed to fetch stock data for ${ticker}: ${err.message}`);
        setDebugInfo(`API Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [ticker, minutes]);

  if (loading) return <div className="loading">Loading stock data for {ticker}...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stockData || !stockData.priceHistory || stockData.priceHistory.length === 0) {
    return (
      <div className="no-data">
        <p>No data available for {ticker} in the selected time interval ({minutes} minutes)</p>
        {debugInfo && <p className="debug-info">Debug: {debugInfo}</p>}
        <p>Try selecting a different stock or time interval</p>
      </div>
    );
  }

  const chartData = {
    labels: stockData.priceHistory.map(item => {
      const date = new Date(item.lastUpdatedAt);
      return date.toLocaleTimeString();
    }),
    datasets: [
      {
        label: `${ticker} Price`,
        data: stockData.priceHistory.map(item => item.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Average',
        data: Array(stockData.priceHistory.length).fill(stockData.averageStockPrice),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${ticker} Stock Price Over Time (${minutes} minutes)`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
  };

  return (
    <div className="stock-chart">
      <div className="chart-header">
        <h2>{ticker} Stock Price</h2>
        <div className="average-info">
          <p>Average Price: ${stockData.averageStockPrice.toFixed(2)}</p>
          <p>Data Points: {stockData.priceHistory.length}</p>
        </div>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      {debugInfo && <p className="debug-info">Debug: {debugInfo}</p>}
    </div>
  );
};

export default StockChart; 