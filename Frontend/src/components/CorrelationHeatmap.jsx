import { useEffect, useState } from 'react';
import { fetchStocks, fetchStockCorrelation } from '../services/api';

const CorrelationHeatmap = ({ minutes }) => {
  const [stocks, setStocks] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState(['', '']);
  const [correlationData, setCorrelationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllStocks = async () => {
      try {
        setLoading(true);
        const data = await fetchStocks();
        const stockList = Object.entries(data.stocks).map(([name, ticker]) => ({ name, ticker }));
        setStocks(stockList);
        
        if (stockList.length >= 2) {
          setSelectedStocks([stockList[0].ticker, stockList[1].ticker]);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch stocks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStocks();
  }, []);

  useEffect(() => {
    const fetchCorrelation = async () => {
      const [stock1, stock2] = selectedStocks;
      
      if (!stock1 || !stock2 || stock1 === stock2) {
        setCorrelationData(null);
        return;
      }
      
      try {
        setLoading(true);
        const data = await fetchStockCorrelation(minutes, stock1, stock2);
        setCorrelationData(data);
        setError(null);
      } catch (err) {
        setError(`Failed to fetch correlation: ${err.message}`);
        console.error(err);
        setCorrelationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrelation();
  }, [selectedStocks, minutes]);

  const handleStockChange = (index, ticker) => {
    const newSelections = [...selectedStocks];
    newSelections[index] = ticker;
    setSelectedStocks(newSelections);
  };

  const getCorrelationColor = (value) => {
    if (value === null || value === undefined) return '#CCCCCC';
    
    if (value > 0.8) return '#005500';
    if (value > 0.5) return '#00AA00';
    if (value > 0.2) return '#00FF00';
    if (value > -0.2) return '#FFFF00';
    if (value > -0.5) return '#FF5500';
    if (value > -0.8) return '#FF0000';
    return '#550000';
  };

  const getCorrelationDescription = (value) => {
    if (value === null || value === undefined) return 'No data';
    
    if (value > 0.8) return 'Strong Positive Correlation';
    if (value > 0.5) return 'Moderate Positive Correlation';
    if (value > 0.2) return 'Weak Positive Correlation';
    if (value > -0.2) return 'No Correlation';
    if (value > -0.5) return 'Weak Negative Correlation';
    if (value > -0.8) return 'Moderate Negative Correlation';
    return 'Strong Negative Correlation';
  };

  if (loading && stocks.length === 0) return <div className="loading">Loading stocks...</div>;
  if (error) return <div className="error">{error}</div>;
  if (stocks.length < 2) return <div className="no-data">Not enough stocks available for correlation</div>;

  return (
    <div className="correlation-analysis">
      <h2>Stock Correlation Analysis (Last {minutes} minutes)</h2>
      
      <div className="stock-selectors">
        <div className="selector">
          <label>First Stock:</label>
          <select 
            value={selectedStocks[0]} 
            onChange={(e) => handleStockChange(0, e.target.value)}
          >
            <option value="">Select stock</option>
            {stocks.map(stock => (
              <option 
                key={stock.ticker} 
                value={stock.ticker}
                disabled={stock.ticker === selectedStocks[1]}
              >
                {stock.name} ({stock.ticker})
              </option>
            ))}
          </select>
        </div>
        
        <div className="selector">
          <label>Second Stock:</label>
          <select 
            value={selectedStocks[1]} 
            onChange={(e) => handleStockChange(1, e.target.value)}
          >
            <option value="">Select stock</option>
            {stocks.map(stock => (
              <option 
                key={stock.ticker} 
                value={stock.ticker}
                disabled={stock.ticker === selectedStocks[0]}
              >
                {stock.name} ({stock.ticker})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading correlation data...</div>}
      
      {!loading && correlationData && (
        <div className="correlation-result">
          <div 
            className="correlation-indicator" 
            style={{ backgroundColor: getCorrelationColor(correlationData.correlation) }}
          >
            <h3>Correlation: {correlationData.correlation.toFixed(4)}</h3>
            <p>{getCorrelationDescription(correlationData.correlation)}</p>
          </div>
          
          <div className="correlation-details">
            <div className="stock-info">
              <h4>{selectedStocks[0]}</h4>
              <p>Average Price: ${correlationData.stocks[selectedStocks[0]]?.averagePrice.toFixed(2)}</p>
              <p>Data Points: {correlationData.stocks[selectedStocks[0]]?.priceHistory.length}</p>
            </div>
            
            <div className="stock-info">
              <h4>{selectedStocks[1]}</h4>
              <p>Average Price: ${correlationData.stocks[selectedStocks[1]]?.averagePrice.toFixed(2)}</p>
              <p>Data Points: {correlationData.stocks[selectedStocks[1]]?.priceHistory.length}</p>
            </div>
          </div>
          
          <div className="match-info">
            <p>Matched Data Points: {correlationData.dataPoints?.matchedPairs || 0}</p>
          </div>
        </div>
      )}
      
      {!loading && !correlationData && selectedStocks[0] && selectedStocks[1] && (
        <div className="no-data">
          <p>No correlation data available for the selected stocks.</p>
          <p>Try a different time interval or stock pair.</p>
        </div>
      )}
      
      <div className="correlation-guide">
        <h3>Understanding Correlation:</h3>
        <div className="guide-item">
          <div className="color-sample" style={{ backgroundColor: '#005500' }}></div>
          <span>Strong Positive (0.8 to 1.0): Prices strongly move together</span>
        </div>
        <div className="guide-item">
          <div className="color-sample" style={{ backgroundColor: '#00AA00' }}></div>
          <span>Moderate Positive (0.5 to 0.8): Prices generally move together</span>
        </div>
        <div className="guide-item">
          <div className="color-sample" style={{ backgroundColor: '#00FF00' }}></div>
          <span>Weak Positive (0.2 to 0.5): Prices weakly move together</span>
        </div>
        <div className="guide-item">
          <div className="color-sample" style={{ backgroundColor: '#FFFF00' }}></div>
          <span>No Correlation (-0.2 to 0.2): No consistent relationship</span>
        </div>
        <div className="guide-item">
          <div className="color-sample" style={{ backgroundColor: '#FF5500' }}></div>
          <span>Weak Negative (-0.5 to -0.2): Prices weakly move oppositely</span>
        </div>
        <div className="guide-item">
          <div className="color-sample" style={{ backgroundColor: '#FF0000' }}></div>
          <span>Moderate Negative (-0.8 to -0.5): Prices generally move oppositely</span>
        </div>
        <div className="guide-item">
          <div className="color-sample" style={{ backgroundColor: '#550000' }}></div>
          <span>Strong Negative (-1.0 to -0.8): Prices strongly move oppositely</span>
        </div>
      </div>
    </div>
  );
};

export default CorrelationHeatmap; 