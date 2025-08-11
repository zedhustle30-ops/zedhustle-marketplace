# ZED HUSTLE - Next.js Application

A comprehensive marketplace platform built with Next.js, Supabase authentication, and TailwindCSS for freelancing, trading, and investing opportunities in Zambia.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/registration with Supabase
- **Protected Routes**: Middleware-based route protection
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Modern UI/UX**: Clean, professional interface

### Platform Features
- **Freelance Jobs**: Find and bid on projects (K50 - K1,500+)
- **ZedForex Trading**: Currency and commodity trading platform
- **ZedInvest**: Micro-investment opportunities (up to 15% returns)
- **Premium Plans**: Tiered subscription plans with exclusive features
- **ZedAI Assistant**: AI-powered guidance and recommendations
- **Community Hub**: Connect with fellow hustlers and share experiences

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **Styling**: TailwindCSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel-ready
- **Language**: JavaScript (ES6+)

## 📁 Project Structure

```
nextjs-zedhustle/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.js          # Root layout component
│   ├── page.js            # Landing page (public)
│   ├── login/             # Login page (public)
│   ├── register/          # Registration page (public)
│   ├── catalog/           # Main dashboard (private)
│   ├── jobs/              # Freelance jobs (private)
│   ├── trade/             # Trading platform (private)
│   ├── invest/            # Investment platform (private)
│   ├── premium/           # Premium plans (private)
│   ├── ai/                # AI assistant (private)
│   └── community/         # Community hub (private)
├── middleware.js           # Route protection middleware
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # TailwindCSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies and scripts
└── env.example             # Environment variables template
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Install Dependencies
```bash
cd nextjs-zedhustle
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API
3. Copy your Project URL and anon public key
4. Update `.env.local` with these values

### 4. Run Development Server
```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

## 🔐 Authentication Flow

1. **Public Access**: Landing page, login, and registration
2. **Protected Routes**: All feature pages require authentication
3. **Middleware**: Automatically redirects unauthenticated users to login
4. **Session Management**: Supabase handles user sessions securely

## 📱 Pages Overview

### Public Pages
- **`/`**: Landing page with hero section and features preview
- **`/login`**: User authentication
- **`/register`**: User registration

### Private Pages (Require Login)
- **`/catalog`**: Main dashboard with feature navigation
- **`/jobs`**: Freelance job listings and bidding
- **`/trade`**: Forex trading interface
- **`/invest`**: Investment opportunities and portfolio
- **`/premium`**: Subscription plans and features
- **`/ai`**: AI-powered assistant and recommendations
- **`/community`**: Community discussions and networking

## 🎨 Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- Primary: Blue tones (`primary-600`, `primary-700`)
- Accent: Various colors for different features
- Gray scale: Consistent neutral colors

### Components
Common UI components are defined in `globals.css`:
- `.btn-primary`: Primary button styling
- `.btn-secondary`: Secondary button styling
- `.card`: Card container styling
- `.input-field`: Form input styling

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm run start
```

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📊 Database Schema

The app is designed to work with Supabase. Key tables include:
- `users`: User profiles and authentication
- `jobs`: Freelance job postings
- `trades`: Trading transactions
- `investments`: Investment records
- `community_posts`: Community discussions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

## 🔮 Future Enhancements

- Real-time notifications
- Advanced trading features
- Mobile app development
- Payment integration
- Advanced analytics dashboard
- Multi-language support
- Advanced AI features

---

**Built with ❤️ for the ZED HUSTLE community**



