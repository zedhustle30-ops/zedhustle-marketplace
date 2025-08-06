# ZedHustle - Setup Guide

## Project Overview
ZedHustle is a comprehensive financial platform for Zambia, featuring job opportunities, virtual trading, investment platforms, and mobile money integration.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Quick Start

### 1. Clone and Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend Environment (.env)
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/zedhustle

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
AUTH_RATE_LIMIT_WINDOW_MS=900000

# Payment Integration (for future use)
AIRTEL_MERCHANT_ID=your_airtel_merchant_id
AIRTEL_API_KEY=your_airtel_api_key
MTN_MERCHANT_ID=your_mtn_merchant_id
MTN_API_KEY=your_mtn_api_key
```

#### Frontend Environment (.env)
Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:
3000/api
VITE_APP_NAME=ZedHustle
```

### 3. Database Setup

#### Start MongoDB
```bash
# Start MongoDB service
mongod

# Or if using MongoDB Atlas, update MONGO_URI in backend/.env
```

#### Initialize Database (Optional)
The application will create necessary collections automatically on first run.

### 4. Start the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend:**
```bash
cd backend
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:5173 (or port shown in terminal)
- **Backend API**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api/docs (if implemented)

## Project Structure

```
ZedHustle/
├── backend/
│   ├── index.js              # Main server file
│   ├── middleware/           # Authentication & validation
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Vue components
│   │   ├── views/           # Page components
│   │   ├── stores/          # Pinia state management
│   │   ├── services/        # API services
│   │   └── router/          # Vue Router configuration
│   └── package.json
└── README.md
```

## Core Features

### 1. Authentication System
- User registration and login
- JWT token authentication
- Password reset functionality
- Role-based access control

### 2. Job Platform
- Browse and search job opportunities
- Apply for jobs with cover letters
- Employer job posting (for employers)
- Application management

### 3. Virtual Trading Platform
- Real-time market data (simulated)
- Virtual portfolio management
- Buy/sell stock functionality
- Performance tracking

### 4. Investment Platform
- Browse investment opportunities
- Invest in businesses
- Portfolio tracking
- Funding progress monitoring

### 5. Payment System
- Mobile money integration (Airtel/MTN)
- Wallet management
- Transaction history
- Deposit/withdrawal functionality

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create job (employers)
- `POST /api/jobs/:id/apply` - Apply for job

### Trading
- `GET /api/trading/market-data` - Get market data
- `GET /api/trading/portfolio` - Get user portfolio
- `POST /api/trading/trade` - Place trade

### Investments
- `GET /api/investments` - List investments
- `GET /api/investments/:id` - Get specific investment
- `POST /api/investments/:id/invest` - Invest in opportunity

### Payments
- `GET /api/payments/wallet` - Get wallet balance
- `POST /api/payments/deposit` - Deposit funds
- `POST /api/payments/withdraw` - Withdraw funds
- `GET /api/payments/transactions` - Get transaction history

## Development Workflow

### Adding New Features
1. Create/update backend models in `backend/models/`
2. Add API routes in `backend/routes/`
3. Create frontend components in `frontend/src/views/`
4. Update router configuration in `frontend/src/router/`
5. Add API services in `frontend/src/services/`

### Code Style
- Backend: Follow Node.js/Express conventions
- Frontend: Use Vue 3 Composition API
- Use Tailwind CSS for styling
- Follow ESLint and Prettier configurations

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

**2. Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**3. Frontend Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. CORS Issues**
- Ensure backend CORS configuration matches frontend URL
- Check that API base URL is correct in frontend environment

### Debug Mode
```bash
# Backend with debug logging
cd backend
DEBUG=* npm run dev

# Frontend with Vue devtools
cd frontend
npm run dev
```

## Deployment

### Backend Deployment
1. Set up production environment variables
2. Configure MongoDB Atlas or production database
3. Set up reverse proxy (nginx)
4. Use PM2 for process management

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables
4. Set up custom domain

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check console logs for errors
4. Verify environment configuration

## License

This project is proprietary software. All rights reserved.