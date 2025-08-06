<<<<<<< HEAD
# 🚀 ZED HUSTLE - Zambian Freelance Marketplace

A comprehensive freelance marketplace platform built for Zambia, featuring bidding systems, virtual trading, and AI-powered features.

## 🎯 **Features**

- **👥 User Registration & Authentication** (Supabase Auth)
- **💼 Job Posting & Bidding System**
- **📈 Virtual Commodity Trading**
- **⭐ Premium Subscription Tiers**
- **🎁 Referral System**
- **💰 Digital Wallet**
- **🧠 AI-Powered Job Recommendations**
- **🔒 Admin Panel**
- **📱 Mobile Responsive Design**
- **🏢 ZedInvest Micro-investments**
- **🏆 Leaderboard & Achievements**
- **💳 Flutterwave Payment Integration**
- **📍 Offline Job Posting**

## 🛠️ **Tech Stack**

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Hosting:** Vercel
- **Storage:** Supabase Storage
- **Functions:** Vercel Serverless Functions
- **Database:** Supabase PostgreSQL

## ⚡ **Quick Start**

### **1. Set Up Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Update `public/supabase-config.js` with your credentials

### **2. Set Up Database**
1. Go to SQL Editor in Supabase
2. Run the SQL from `supabase-schema.sql`
3. This creates all tables and security policies

### **3. Set Up Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### **4. Deploy**
```bash
npm install
npm run deploy
```

## 📁 **Project Structure**

```
zed-hustle/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styles
│   ├── script.js          # Main JavaScript
│   └── supabase-config.js # Supabase configuration
├── api/                   # Vercel serverless functions
│   └── update-prices.js   # AI price updater
├── supabase-schema.sql    # Database schema
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## 🚀 **Key Features**

### **👥 User Management**
- Email/password authentication with Supabase
- Profile management with portfolio uploads
- Referral system with automatic rewards
- Digital wallet with transaction history

### **💼 Job System**
- Post jobs with detailed descriptions
- Apply with bids and proposals
- Track application status
- Category-based filtering and search

### **📈 Trading System**
- Virtual commodity trading (Copper, Gold, Maize, Oil, Diamonds)
- AI-powered real-time price updates
- Trading history and analytics
- Profit/loss tracking with charts

### **🧠 AI Features**
- ZedAI assistant for job recommendations
- AI-powered proposal generation
- Visibility optimization suggestions
- Smart job matching algorithm

### **🏢 ZedInvest**
- Micro-investments in Zambian businesses
- Risk assessment and expected returns
- Investment portfolio tracking
- Business funding progress

### **🏆 Achievements**
- Leaderboard system
- Achievement badges
- Performance tracking
- Social recognition

### **🔒 Admin Panel**
- User management and moderation
- Job approval and management
- Payment processing
- Analytics dashboard
- Trading oversight

## 🔧 **Development**

### **Local Development**
```bash
# Install dependencies
npm install

# Start local server
npm run dev

# Build for production
npm run build
```

### **Environment Variables**
Create a `.env` file:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 **Database Schema**

The platform uses PostgreSQL with the following main tables:
- `users` - User profiles and authentication
- `jobs` - Job postings and details
- `job_applications` - Job applications and bids
- `trades` - Trading transactions
- `commodities` - Commodity prices and data
- `businesses` - ZedInvest business listings
- `investments` - User investments
- `messages` - User messaging system
- `notifications` - System notifications

## 🚀 **Deployment**

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### **Environment Setup**
1. Add environment variables in Vercel dashboard
2. Configure custom domain (optional)
3. Set up automatic deployments from GitHub

## 🔐 **Security**

- **Row Level Security (RLS)** on all tables
- **Supabase Auth** for authentication
- **Environment variables** for sensitive data
- **CORS protection** and rate limiting
- **Input validation** and sanitization

## 📈 **Performance**

- **Global CDN** with Vercel
- **Database indexing** for fast queries
- **Caching** at multiple levels
- **Optimized images** and assets
- **Mobile-first** responsive design

## 🆘 **Support**

- **Documentation:** Check `MIGRATION_GUIDE.md`
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)

## 🎯 **Benefits Over Firebase**

- **✅ No usage limits** - Unlimited users and operations
- **✅ Better performance** - PostgreSQL vs Firestore
- **✅ More control** - Full database access
- **✅ Cost effective** - Free tier is more generous
- **✅ Real-time subscriptions** - Built-in PostgreSQL subscriptions
- **✅ Better debugging** - SQL queries and logs

## 📄 **License**

MIT License - see LICENSE file for details

---

## 🚀 **Ready to Scale!**

ZED HUSTLE is now built on a scalable, modern stack that can handle unlimited growth without Firebase limitations! 
=======
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
>>>>>>> 11b39537959a31dc4ce818fcf8e866060f806e1b
