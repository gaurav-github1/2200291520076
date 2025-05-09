import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import StockPage from './pages/StockPage';
import HeatmapPage from './pages/HeatmapPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<StockPage />} />
            <Route path="/stock/:ticker" element={<StockPage />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>Stock Price Aggregation Service © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 