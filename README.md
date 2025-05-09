# Stock Price Aggregation Service

A microservice for stock price analysis with a React frontend for visualizing stock data.

## Project Structure

- **Backend**: Express.js server that provides APIs for stock data analysis
- **Frontend**: React application with stock price charts and correlation heatmap

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update credentials in `index.js`:
   Replace the placeholder values in the `credentials` object with your actual registration credentials:
   ```javascript
   const credentials = {
     email: "your-email@example.com",
     name: "Your Name",
     rollNo: "your-roll-no",
     accessCode: "your-access-code",
     clientID: "your-client-id",
     clientSecret: "your-client-secret"
   };
   ```

4. Start the server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the Frontend directory:
   ```
   cd Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The application will be available at http://localhost:3000

## Features

- View stock price history with average price calculation
- Adjust time interval for stock data
- View correlation heatmap between different stocks
- Responsive design for various screen sizes

## API Routes

### Backend APIs

- `GET /api/stocks` - Get list of all stocks
- `GET /api/stocks/:ticker` - Get specific stock data
- `GET /api/stocks/:ticker/average?minutes=m` - Get average stock price in last m minutes
- `GET /api/stockcorrelation?minutes=m&ticker=NVDA&ticker=PYPL` - Get correlation between two stocks
