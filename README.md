# Stock Price Aggregation Service

Microservice for stock price analysis with React frontend for visualizing stock data and correlations.

## Setup

### Backend

```bash
cd Backend
npm install
npm run dev   # Server runs on http://localhost:5000
```

### Frontend

```bash
cd Frontend
npm install
npm run dev   # App runs on http://localhost:3000
```

## Features

- Stock price history visualization with average calculation
- Correlation analysis between any two stocks
- Time interval selection (10min to 160min)
- Responsive design

## API Endpoints

- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:ticker` - Get specific stock data
- `GET /api/stocks/:ticker/average?minutes=m` - Get average price over m minutes
- `GET /api/stockcorrelation?minutes=m&ticker=NVDA&ticker=PYPL` - Get correlation between stocks
