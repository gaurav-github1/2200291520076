import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StockChart from '../components/StockChart';
import { fetchStocks } from '../services/api';

const StockPage = () => {
  const { ticker } = useParams();
  const [stocksList, setStocksList] = useState({});
  const [selectedTicker, setSelectedTicker] = useState(ticker || '');
  const [timeInterval, setTimeInterval] = useState(30); // Default 30 minutes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStocks = async () => {
      try {
        setLoading(true);
        const data = await fetchStocks();
        setStocksList(data.stocks || {});
        
        // If no ticker is selected and we have stocks, select the first one
        if (!selectedTicker && Object.values(data.stocks || {}).length > 0) {
          setSelectedTicker(Object.values(data.stocks)[0]);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch stocks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getStocks();
  }, [selectedTicker]);

  const handleTickerChange = (e) => {
    setSelectedTicker(e.target.value);
  };

  const handleTimeIntervalChange = (e) => {
    setTimeInterval(Number(e.target.value));
  };

  if (loading && Object.keys(stocksList).length === 0) {
    return <div className="loading">Loading stocks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="stock-page">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="ticker-select">Select Stock:</label>
          <select 
            id="ticker-select"
            value={selectedTicker}
            onChange={handleTickerChange}
          >
            <option value="">Select a stock</option>
            {Object.entries(stocksList).map(([name, ticker]) => (
              <option key={ticker} value={ticker}>
                {name} ({ticker})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="time-interval">Time Interval (minutes):</label>
          <select 
            id="time-interval"
            value={timeInterval}
            onChange={handleTimeIntervalChange}
          >
            <option value={10}>10 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={120}>120 minutes</option>
            <option value={160}>160 minutes</option>
          </select>
        </div>
      </div>

      {selectedTicker ? (
        <StockChart 
          ticker={selectedTicker} 
          minutes={timeInterval} 
        />
      ) : (
        <div className="no-selection">
          <p>Please select a stock to view its chart</p>
        </div>
      )}
    </div>
  );
};

export default StockPage; 