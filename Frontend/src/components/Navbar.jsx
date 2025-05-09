import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Stock Price Analytics</h1>
      </div>
      <ul className="navbar-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Stock Chart</Link>
        </li>
        <li className={location.pathname === '/heatmap' ? 'active' : ''}>
          <Link to="/heatmap">Correlation Heatmap</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 