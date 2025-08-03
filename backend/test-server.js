const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test data
const users = [
  { id: '1', email: 'admin@zedhustle.com', name: 'Admin', role: 'admin' },
  { id: '2', email: 'user@zedhustle.com', name: 'User', role: 'user' }
];

const jobs = [
  { id: '1', title: 'Web Developer', description: 'Vue.js developer needed', employer: '1' },
  { id: '2', title: 'Mobile Developer', description: 'React Native developer needed', employer: '1' }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ZedHustle API running with Firebase test data' });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (user && password === 'password123') {
    res.json({
      success: true,
      data: { user, token: `test-${user.id}` }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Jobs routes
app.get('/api/jobs', (req, res) => {
  res.json({ success: true, data: { jobs } });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  res.json({ success: true, data: { job } });
});

// ZedForex routes
app.get('/api/zedforex/tokens', (req, res) => {
  const tokens = [
    { id: '1', symbol: 'COPPER', name: 'Copper Token', currentPrice: 150.50 },
    { id: '2', symbol: 'GOLD', name: 'Gold Token', currentPrice: 2500.00 }
  ];
  res.json({ success: true, data: { tokens } });
});

// ZedInvest routes
app.get('/api/zedinvest/businesses', (req, res) => {
  const businesses = [
    { id: '1', name: 'TechStart Zambia', description: 'Technology startup', category: 'technology' }
  ];
  res.json({ success: true, data: { businesses } });
});

app.listen(PORT, () => {
  console.log(`🚀 ZedHustle Test API running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 