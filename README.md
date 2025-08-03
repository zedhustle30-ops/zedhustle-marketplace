# ZedHustle 🚀

A comprehensive financial platform for Zambia, combining job opportunities, virtual trading, investment platforms, and mobile money integration.

## 🎯 Project Overview

ZedHustle is designed to be the go-to platform for Zambians seeking financial opportunities, career growth, and investment options. The platform integrates multiple services into a single, user-friendly application.

### Core Features

- **💼 Job Platform**: Browse and apply for job opportunities across Zambia
- **📈 Virtual Trading**: Practice trading with virtual money, no risk involved
- **💰 Investment Platform**: Discover and invest in promising Zambian businesses
- **💳 Payment System**: Mobile money integration (Airtel Money, MTN MoMo)
- **👤 User Management**: Complete authentication and profile management

## 🏗️ Architecture

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **Security**: Helmet, CORS, rate limiting
- **Payment**: Mobile money API integration

### Frontend
- **Framework**: Vue.js 3 with Composition API
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Set up environment variables**
```bash
# Backend (.env)
PORT=3000
MONGO_URI=mongodb://localhost:27017/zedhustle
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3000/api
```

3. **Start the application**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## 📁 Project Structure

```
ZedHustle/
├── backend/
│   ├── index.js              # Main server file
│   ├── middleware/           # Auth & validation
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Vue components
│   │   ├── views/           # Page components
│   │   ├── stores/          # Pinia state management
│   │   ├── services/        # API services
│   │   └── router/          # Vue Router
│   └── package.json
├── SETUP_GUIDE.md           # Detailed setup instructions
├── TECHNICAL_SPECIFICATION.md # Technical architecture
├── DEVELOPMENT_ROADMAP.md   # Development timeline
└── README.md
```

## 🔧 Key Components

### Backend Models
- **User**: Authentication, profiles, wallets
- **Job**: Job postings and applications
- **Investment**: Investment opportunities
- **Portfolio**: Trading portfolios
- **Transaction**: Payment transactions

### Frontend Views
- **Dashboard**: User overview and quick actions
- **Jobs**: Browse and apply for opportunities
- **Trading**: Virtual trading platform
- **Investments**: Investment opportunities
- **Profile**: User settings and management

### API Endpoints
- Authentication: `/api/auth/*`
- Jobs: `/api/jobs/*`
- Trading: `/api/trading/*`
- Investments: `/api/investments/*`
- Payments: `/api/payments/*`

## 🎨 Features

### Authentication System
- User registration and login
- JWT token authentication
- Password reset functionality
- Role-based access control

### Job Platform
- Browse and search job opportunities
- Apply for jobs with cover letters
- Employer job posting (for employers)
- Application management

### Virtual Trading Platform
- Real-time market data (simulated)
- Virtual portfolio management
- Buy/sell stock functionality
- Performance tracking

### Investment Platform
- Browse investment opportunities
- Invest in businesses
- Portfolio tracking
- Funding progress monitoring

### Payment System
- Mobile money integration (Airtel/MTN)
- Wallet management
- Transaction history
- Deposit/withdrawal functionality

## 🔐 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation
- CORS protection
- Helmet.js security headers
- Role-based access control

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Build frontend
cd frontend && npm run build

# Start backend
cd backend && npm start
```

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)**: Detailed installation and configuration
- **[Technical Specification](TECHNICAL_SPECIFICATION.md)**: Architecture and design decisions
- **[Development Roadmap](DEVELOPMENT_ROADMAP.md)**: Timeline and milestones
- **[API Documentation](API_DOCUMENTATION.md)**: Complete API reference

## 🛠️ Development

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

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
sudo systemctl status mongod
sudo systemctl start mongod
```

**Port Already in Use**
```bash
# Find and kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

**Frontend Build Errors**
```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📈 Roadmap

### Phase 1 (Month 1) - MVP ✅
- [x] Authentication system
- [x] Job platform
- [x] Virtual trading
- [x] Investment platform
- [x] Payment system
- [x] Responsive design

### Phase 2 (Month 2) - Enhancement
- [ ] Mobile applications
- [ ] Advanced trading features
- [ ] Real-time notifications
- [ ] Admin dashboard

### Phase 3 (Month 3) - Scale
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API rate limiting tiers
- [ ] White-label solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the setup guide
3. Check console logs for errors
4. Verify environment configuration

---

**Built with ❤️ for Zambia**

For more information, contact the ZedHustle development team. 