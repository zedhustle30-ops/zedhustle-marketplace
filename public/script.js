// Global variables
let currentUser = null;
let jobs = [];

// Sample jobs data
const sampleJobs = [
    {
        id: 1,
        title: 'Web Developer Needed',
        company: 'Tech Solutions Ltd',
        salary: 'K2,500 - K4,000',
        description: 'We need a skilled web developer to help build our e-commerce platform.',
        category: 'web-development',
        location: 'lusaka',
        tags: ['React', 'Node.js', 'E-commerce'],
        bidsRequired: 5
    },
    {
        id: 2,
        title: 'Graphic Designer for Branding',
        company: 'Creative Agency',
        salary: 'K1,800 - K3,200',
        description: 'Looking for a creative graphic designer to help with brand identity.',
        category: 'graphic-design',
        location: 'remote',
        tags: ['Adobe Creative Suite', 'Branding'],
        bidsRequired: 5
    },
    {
        id: 3,
        title: 'Content Writer for Blog',
        company: 'Digital Marketing Co',
        salary: 'K1,200 - K2,500',
        description: 'Looking for engaging content writers for our blog and social media.',
        category: 'writing',
        location: 'remote',
        tags: ['Content Writing', 'SEO', 'Social Media'],
        bidsRequired: 5
    },
    {
        id: 4,
        title: 'Mobile App Developer',
        company: 'StartupTech',
        salary: 'K3,000 - K5,500',
        description: 'Develop a mobile app for iOS and Android using React Native.',
        category: 'mobile-development',
        location: 'ndola',
        tags: ['React Native', 'iOS', 'Android'],
        bidsRequired: 10
    },
    {
        id: 5,
        title: 'Data Entry Specialist',
        company: 'Business Solutions',
        salary: 'K800 - K1,500',
        description: 'Accurate data entry for customer records and inventory management.',
        category: 'data-entry',
        location: 'kitwe',
        tags: ['Excel', 'Data Entry', 'Accuracy'],
        bidsRequired: 5
    }
];

// Sample commodities data for trading
const sampleCommodities = [
    { name: 'Copper', price: 8500, change: '+2.3%', symbol: 'CU' },
    { name: 'Gold', price: 12800, change: '-0.8%', symbol: 'AU' },
    { name: 'Maize', price: 450, change: '+1.2%', symbol: 'MZ' },
    { name: 'Oil', price: 950, change: '+3.1%', symbol: 'OIL' },
    { name: 'Mealie Meal', price: 280, change: '-0.5%', symbol: 'MM' }
];

// Admin credentials (for demo purposes)
const ADMIN_EMAIL = 'admin@zedhustle.zm';
const ADMIN_PASSWORD_HASH = 'ZedHustle2024!'; // In production, this should be properly hashed

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeAdminAccess();
});

async function initializeApp() {
    jobs = [...sampleJobs];
    initializeEventListeners();
    loadJobs();
    checkAuthStatus();
    initializeTrading();
    loadTradingDashboard();
}

function initializeEventListeners() {
    // Navigation
    document.getElementById('loginBtn')?.addEventListener('click', () => showModal('loginModal'));
    document.getElementById('signupBtn')?.addEventListener('click', () => showModal('signupModal'));
    document.getElementById('getStartedBtn')?.addEventListener('click', () => showModal('signupModal'));
    
    // Modal controls
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });
    
    // Form submissions
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
    
    // Job filters
    document.getElementById('categoryFilter')?.addEventListener('change', filterJobs);
    document.getElementById('locationFilter')?.addEventListener('change', filterJobs);
    
    // Dashboard tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });
    
    // Trading modal
    document.getElementById('tradingBtn')?.addEventListener('click', showTradingModal);
    document.getElementById('closeTradingModal')?.addEventListener('click', closeTradingModal);
    
    // ZedAI modal
    document.getElementById('zedaiBtn')?.addEventListener('click', showZedAI);
    
    // ZedInvest modals
    document.getElementById('zedinvestBtn')?.addEventListener('click', showZedInvest);
    document.getElementById('businessModal')?.addEventListener('click', showBusinessModal);
    document.getElementById('investmentHistoryModal')?.addEventListener('click', showInvestmentHistoryModal);
    
    // Payment modal
    document.getElementById('paymentBtn')?.addEventListener('click', showFlutterwavePayment);
    
    // Offline jobs modal
    document.getElementById('offlineJobsBtn')?.addEventListener('click', showOfflineJobPosting);
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
        try {
            // Check if user exists in localStorage
            const users = JSON.parse(localStorage.getItem('zedHustleUsers') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('zedHustleCurrentUser', JSON.stringify(user));
                
                closeAllModals();
                showNotification('Login successful!', 'success');
                updateAuthUI();
                loadUserDashboard();
            } else {
                showNotification('Invalid email or password', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Login failed. Please try again.', 'error');
        }
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const fullName = document.getElementById('signupName').value;
    const phone = document.getElementById('signupPhone').value;
    
    if (email && password && fullName) {
        try {
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('zedHustleUsers') || '[]');
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                showNotification('Account with this email already exists', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                email: email,
                password: password, // In production, this should be hashed
                fullName: fullName,
                phone: phone,
                bids: 50, // Free bids on signup
                wallet: 0,
                plan: 'free',
                referralEarnings: 0,
                referralCode: generateReferralCode(),
                createdAt: new Date().toISOString(),
                tokens: {
                    copper: 0,
                    gold: 0,
                    maize: 0,
                    oil: 0,
                    mealieMeal: 0
                },
                trades: [],
                investments: []
            };
            
            users.push(newUser);
            localStorage.setItem('zedHustleUsers', JSON.stringify(users));
            
            currentUser = newUser;
            localStorage.setItem('zedHustleCurrentUser', JSON.stringify(newUser));
            
            closeAllModals();
            showNotification('Account created successfully! You received 50 free bids.', 'success');
            updateAuthUI();
            loadUserDashboard();
            
        } catch (error) {
            console.error('Signup error:', error);
            showNotification('Signup failed. Please try again.', 'error');
        }
    }
}

function generateReferralCode() {
    return 'ZED' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function logout() {
    currentUser = null;
    localStorage.removeItem('zedHustleCurrentUser');
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('jobs').style.display = 'block';
}

async function checkAuthStatus() {
    try {
        const savedUser = localStorage.getItem('zedHustleCurrentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateAuthUI();
            loadUserDashboard();
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userMenu.style.display = 'block';
        userName.textContent = currentUser.fullName;
        
        // Show dashboard
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('jobs').style.display = 'none';
    } else {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        userMenu.style.display = 'none';
        
        // Hide dashboard
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('jobs').style.display = 'block';
    }
}

// Job Functions
function loadJobs() {
    const jobsList = document.getElementById('jobsList');
    if (!jobsList) return;
    
    jobsList.innerHTML = jobs.map(job => `
        <div class="job-card" data-category="${job.category}" data-location="${job.location}">
            <h3>${job.title}</h3>
            <p class="company">${job.company}</p>
            <p class="salary">${job.salary}</p>
            <p class="description">${job.description}</p>
            <div class="job-tags">
                ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="job-footer">
                <span class="bids-required">${job.bidsRequired} bids required</span>
                <button class="apply-btn" onclick="applyForJob(${job.id})">Apply Now</button>
            </div>
        </div>
    `).join('');
}

function filterJobs() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    
    const jobCards = document.querySelectorAll('.job-card');
    
    jobCards.forEach(card => {
        const category = card.dataset.category;
        const location = card.dataset.location;
        
        const categoryMatch = !categoryFilter || category === categoryFilter;
        const locationMatch = !locationFilter || location === locationFilter;
        
        card.style.display = (categoryMatch && locationMatch) ? 'block' : 'none';
    });
}

function applyForJob(jobId) {
    if (!currentUser) {
        showModal('loginModal');
        showNotification('Please login to apply for jobs', 'info');
        return;
    }
    
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    if (currentUser.bids < job.bidsRequired) {
        showNotification(`You need ${job.bidsRequired} bids to apply for this job. You have ${currentUser.bids} bids.`, 'error');
        return;
    }
    
    // Deduct bids
    currentUser.bids -= job.bidsRequired;
    updateUser();
    
    showNotification(`Applied successfully! ${job.bidsRequired} bids deducted.`, 'success');
    loadUserDashboard();
}

function updateUser() {
    localStorage.setItem('zedHustleCurrentUser', JSON.stringify(currentUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('zedHustleUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('zedHustleUsers', JSON.stringify(users));
    }
}

// Dashboard Functions
function loadUserDashboard() {
    if (!currentUser) return;
    
    // Update stats
    document.getElementById('userBids').textContent = currentUser.bids || 0;
    document.getElementById('userWallet').textContent = `K${(currentUser.wallet || 0).toFixed(2)}`;
    document.getElementById('userPlan').textContent = currentUser.plan || 'Free';
    document.getElementById('userReferralEarnings').textContent = `K${(currentUser.referralEarnings || 0).toFixed(2)}`;
    document.getElementById('userReferralCode').textContent = currentUser.referralCode || 'N/A';
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).style.display = 'block';
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load tab-specific data
    switch(tabName) {
        case 'applications':
            loadApplications();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'notifications':
            loadNotifications();
            break;
    }
}

function loadApplications() {
    const applicationsList = document.getElementById('applicationsList');
    applicationsList.innerHTML = `
        <div class="application-item">
            <h4>Web Developer Position</h4>
            <p>Status: <span class="status pending">Pending</span></p>
            <p>Applied: 2 days ago</p>
        </div>
        <div class="application-item">
            <h4>Graphic Designer Role</h4>
            <p>Status: <span class="status approved">Approved</span></p>
            <p>Applied: 1 week ago</p>
        </div>
    `;
}

function loadMessages() {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = `
        <div class="message-item">
            <h4>Welcome to ZED HUSTLE!</h4>
            <p>Thank you for joining our platform. Start applying for jobs today!</p>
            <small>Admin • 1 day ago</small>
        </div>
    `;
}

function loadNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    notificationsList.innerHTML = `
        <div class="notification-item">
            <h4>Application Status Update</h4>
            <p>Your application for "Web Developer" has been viewed by the employer.</p>
            <small>2 hours ago</small>
        </div>
    `;
}

// Trading Functions
function initializeTrading() {
    // Update commodity prices periodically (simulate real-time updates)
    setInterval(updateCommodityPrices, 30000); // Update every 30 seconds
    updateCommodityPrices(); // Initial update
}

function updateCommodityPrices() {
    sampleCommodities.forEach(commodity => {
        // Simulate price changes (-5% to +5%)
        const changePercent = (Math.random() - 0.5) * 0.1;
        commodity.price = Math.round(commodity.price * (1 + changePercent));
        commodity.change = (changePercent >= 0 ? '+' : '') + (changePercent * 100).toFixed(1) + '%';
    });
}

function showTradingModal() {
    const modal = document.getElementById('tradingModal');
    if (modal) {
        modal.style.display = 'block';
        loadTradingModalData();
    }
}

function loadTradingModalData() {
    const commoditiesList = document.getElementById('commoditiesList');
    if (!commoditiesList) return;
    
    commoditiesList.innerHTML = sampleCommodities.map(commodity => `
        <div class="commodity-item">
            <div class="commodity-info">
                <h4>${commodity.name} (${commodity.symbol})</h4>
                <p class="price">K${commodity.price}</p>
                <p class="change ${commodity.change.startsWith('+') ? 'positive' : 'negative'}">${commodity.change}</p>
            </div>
            <div class="commodity-actions">
                <input type="number" id="amount-${commodity.symbol}" placeholder="Amount" min="1" max="100" value="1">
                <button onclick="executeTrade('${commodity.symbol}', 'buy')" class="buy-btn">Buy</button>
                <button onclick="executeTrade('${commodity.symbol}', 'sell')" class="sell-btn">Sell</button>
            </div>
        </div>
    `).join('');
}

function executeTrade(symbol, action) {
    if (!currentUser) {
        showNotification('Please login to trade', 'error');
        return;
    }
    
    const amountInput = document.getElementById(`amount-${symbol}`);
    const amount = parseInt(amountInput.value) || 1;
    
    const commodity = sampleCommodities.find(c => c.symbol === symbol);
    if (!commodity) return;
    
    if (action === 'buy') {
        const totalCost = (commodity.price + 10) * amount; // +10 buying fee per token
        
        if (currentUser.wallet < totalCost) {
            showNotification(`Insufficient funds. You need K${totalCost} but have K${currentUser.wallet}`, 'error');
            return;
        }
        
        currentUser.wallet -= totalCost;
        currentUser.tokens[symbol.toLowerCase()] = (currentUser.tokens[symbol.toLowerCase()] || 0) + amount;
        
        // Add to trade history
        if (!currentUser.trades) currentUser.trades = [];
        currentUser.trades.push({
            type: 'buy',
            commodity: commodity.name,
            symbol: symbol,
            amount: amount,
            price: commodity.price,
            total: totalCost,
            timestamp: new Date().toISOString()
        });
        
        updateUser();
        showNotification(`Bought ${amount} ${commodity.name} tokens for K${totalCost}`, 'success');
        
    } else if (action === 'sell') {
        const userTokens = currentUser.tokens[symbol.toLowerCase()] || 0;
        
        if (userTokens < amount) {
            showNotification(`You don't have enough ${commodity.name} tokens. You have ${userTokens} tokens.`, 'error');
            return;
        }
        
        const profit = amount * commodity.price * 0.5; // 50% of current price as profit
        
        currentUser.wallet += profit;
        currentUser.tokens[symbol.toLowerCase()] -= amount;
        
        // Add to trade history
        if (!currentUser.trades) currentUser.trades = [];
        currentUser.trades.push({
            type: 'sell',
            commodity: commodity.name,
            symbol: symbol,
            amount: amount,
            price: commodity.price,
            total: profit,
            timestamp: new Date().toISOString()
        });
        
        updateUser();
        showNotification(`Sold ${amount} ${commodity.name} tokens for K${profit.toFixed(2)} profit`, 'success');
    }
    
    loadTradingDashboard();
    loadTradingModalData();
}

function closeTradingModal() {
    document.getElementById('tradingModal').style.display = 'none';
}

function loadTradingDashboard() {
    if (!currentUser) return;
    
    const tradingStats = document.getElementById('tradingStats');
    if (!tradingStats) return;
    
    const totalTokens = Object.values(currentUser.tokens || {}).reduce((sum, tokens) => sum + tokens, 0);
    const recentTrades = (currentUser.trades || []).slice(-5).reverse();
    
    tradingStats.innerHTML = `
        <div class="stat-card">
            <h4>Total Tokens</h4>
            <p>${totalTokens}</p>
        </div>
        <div class="stat-card">
            <h4>Recent Trades</h4>
            <div class="trades-list">
                ${recentTrades.map(trade => `
                    <div class="trade-item">
                        <span>${trade.type.toUpperCase()} ${trade.amount} ${trade.commodity}</span>
                        <span>K${trade.total.toFixed(2)}</span>
                    </div>
                `).join('') || '<p>No recent trades</p>'}
            </div>
        </div>
    `;
}

// ZedAI Functions
function showZedAI() {
    if (!currentUser) {
        showModal('loginModal');
        showNotification('Please login to access ZedAI', 'info');
        return;
    }
    
    if (currentUser.plan !== 'premium-k100') {
        showPremiumUpgrade();
        return;
    }
    
    showModal('zedaiModal');
    loadZedAIData();
}

function showPremiumUpgrade() {
    showModal('premiumUpgradeModal');
}

function loadZedAIData() {
    // Simulate AI recommendations
    const recommendations = [
        { title: 'Web Developer Position', match: '95%', reason: 'Perfect match for your React skills' },
        { title: 'Mobile App Developer', match: '87%', reason: 'Good fit for your JavaScript experience' },
        { title: 'UI/UX Designer', match: '72%', reason: 'Matches your design portfolio' }
    ];
    
    const recommendationsList = document.getElementById('aiRecommendations');
    if (recommendationsList) {
        recommendationsList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <h4>${rec.title}</h4>
                <p class="match-score">${rec.match} match</p>
                <p class="reason">${rec.reason}</p>
                <button class="apply-btn">Apply with AI Proposal</button>
            </div>
        `).join('');
    }
}

// ZedInvest Functions
function showZedInvest() {
    showModal('zedinvestModal');
}

function showBusinessModal() {
    showModal('businessModal');
}

function showInvestmentHistoryModal() {
    showModal('investmentHistoryModal');
}

// Payment Functions
function showFlutterwavePayment() {
    showModal('flutterwaveModal');
}

// Offline Jobs Functions
function showOfflineJobPosting() {
    showModal('offlineJobModal');
}

// Admin Functions
function initializeAdminAccess() {
    let adminKeySequence = '';
    
    document.addEventListener('keydown', (e) => {
        adminKeySequence += e.key.toLowerCase();
        
        if (adminKeySequence.includes('zedhustle')) {
            adminKeySequence = '';
            showSecureAdminLogin();
        }
        
        // Clear sequence if it gets too long
        if (adminKeySequence.length > 20) {
            adminKeySequence = '';
        }
    });
    
    // Check for admin hash in URL
    if (window.location.hash === '#admin' || window.location.hash === '#zedadmin') {
        showSecureAdminLogin();
    }
}

function showSecureAdminLogin() {
    showModal('adminLoginModal');
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD_HASH) {
        closeAllModals();
        showAdminPanel();
        showNotification('Admin access granted', 'success');
    } else {
        showNotification('Invalid admin credentials', 'error');
    }
}

function showAdminPanel() {
    showModal('adminDashboard');
    loadAdminData();
}

function loadAdminData() {
    const users = JSON.parse(localStorage.getItem('zedHustleUsers') || '[]');
    
    // Update admin stats
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalRevenue').textContent = `K${(users.length * 25).toFixed(2)}`; // K25 hidden fee per user
    document.getElementById('activeTraders').textContent = users.filter(u => u.trades && u.trades.length > 0).length;
    
    // Load recent activity
    const recentActivity = [
        'New user registered: John Doe',
        'Payment verified: K100 - Jane Smith',
        'Job posted: Web Developer Position',
        'Trade executed: 5 Copper tokens - Mike Johnson'
    ];
    
    document.getElementById('recentActivity').innerHTML = recentActivity.map(activity => 
        `<div class="activity-item">${activity}</div>`
    ).join('');
}

// Modal Functions
function showModal(modalId) {
    closeAllModals();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeAllModals();
    }
});

// Additional utility functions
function copyReferralCode() {
    const referralCode = document.getElementById('userReferralCode').textContent;
    navigator.clipboard.writeText(referralCode).then(() => {
        showNotification('Referral code copied to clipboard!', 'success');
    });
}

function switchZedAITab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.zedai-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Update tab buttons
    document.querySelectorAll('.zedai-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function switchInvestTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.invest-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Update tab buttons
    document.querySelectorAll('.zedinvest-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function showAdminTab(tabName) {
    // Hide all admin tab contents
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Show selected tab
    const targetTab = document.getElementById(`admin-${tabName}`);
    if (targetTab) {
        targetTab.style.display = 'block';
    }
    
    // Update tab buttons
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load tab-specific data
    switch(tabName) {
        case 'overview':
            loadAdminData();
            break;
        case 'users':
            // Load users data
            break;
        case 'jobs':
            // Load jobs data
            break;
        case 'payments':
            // Load payments data
            break;
        case 'referrals':
            // Load referrals data
            break;
        case 'trading':
            // Load trading data
            break;
    }
}

// Initialize admin login form handler
document.addEventListener('DOMContentLoaded', () => {
    const adminForm = document.getElementById('adminLoginForm');
    if (adminForm) {
        adminForm.addEventListener('submit', handleAdminLogin);
    }
});