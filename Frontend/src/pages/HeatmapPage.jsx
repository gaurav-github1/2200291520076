import { useState } from 'react';
import CorrelationHeatmap from '../components/CorrelationHeatmap';

const HeatmapPage = () => {
  const [timeInterval, setTimeInterval] = useState(60); // Default 60 minutes

  const handleTimeIntervalChange = (e) => {
    setTimeInterval(Number(e.target.value));
  };

  return (
    <div className="correlation-page">
      <div className="page-header">
        <h1>Stock Correlation Analysis</h1>
        <p>Analyze the correlation between any two stocks to understand how their prices move in relation to each other.</p>
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="time-interval">Time Interval:</label>
          <select 
            id="time-interval"
            value={timeInterval}
            onChange={handleTimeIntervalChange}
          >
            <option value={10}>10 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={160}>160 minutes</option>
          </select>
        </div>
      </div>

      <CorrelationHeatmap minutes={timeInterval} />
      
      <div className="correlation-info">
        <h3>About Stock Correlation</h3>
        <p>
          Correlation measures the statistical relationship between two stocks' price movements.
          The value ranges from -1 to 1, where:
        </p>
        <ul>
          <li><strong>+1:</strong> Perfect positive correlation - stocks move exactly together</li>
          <li><strong>0:</strong> No correlation - stocks move independently</li>
          <li><strong>-1:</strong> Perfect negative correlation - stocks move exactly opposite</li>
        </ul>
        <p>
          A strong positive correlation might indicate that both stocks are affected by similar market factors,
          while a negative correlation could suggest they respond differently to market conditions.
        </p>
      </div>
    </div>
  );
};

export default HeatmapPage; 