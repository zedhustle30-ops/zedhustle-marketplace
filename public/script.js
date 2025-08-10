// Initialize Supabase
const SUPABASE_URL = 'https://jpdndlnblbbtaxcrsyfm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;
let jobs = [];

// Enhanced sample jobs data with more professional categories
const sampleJobs = [
    {
        id: 1,
        title: 'Senior Full-Stack Developer',
        company: 'Zambia Digital Solutions',
        salary: 'K8,000 - K15,000',
        description: 'Lead development of enterprise applications using modern technologies. Must have 3+ years experience.',
        category: 'web-development',
        location: 'lusaka',
        tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        bidsRequired: 15,
        experience: '3+ years',
        type: 'Full-time'
    },
    {
        id: 2,
        title: 'Creative Brand Designer',
        company: 'Lusaka Creative Studio',
        salary: 'K4,500 - K8,000',
        description: 'Create compelling brand identities, logos, and marketing materials for local businesses.',
        category: 'graphic-design',
        location: 'lusaka',
        tags: ['Adobe Creative Suite', 'Branding', 'Logo Design'],
        bidsRequired: 8,
        experience: '2+ years',
        type: 'Contract'
    },
    {
        id: 3,
        title: 'SEO Content Strategist',
        company: 'Digital Growth Zambia',
        salary: 'K3,500 - K6,500',
        description: 'Develop SEO-optimized content strategies and write engaging content for multiple industries.',
        category: 'content-writing',
        location: 'remote',
        tags: ['SEO', 'Content Strategy', 'Copywriting'],
        bidsRequired: 10,
        experience: '2+ years',
        type: 'Remote'
    },
    {
        id: 4,
        title: 'Mobile App Developer (Flutter)',
        company: 'TechStart Zambia',
        salary: 'K6,000 - K12,000',
        description: 'Build cross-platform mobile applications using Flutter for iOS and Android.',
        category: 'mobile-development',
        location: 'ndola',
        tags: ['Flutter', 'Dart', 'Mobile Development'],
        bidsRequired: 12,
        experience: '2+ years',
        type: 'Full-time'
    },
    {
        id: 5,
        title: 'Data Analyst & Business Intelligence',
        company: 'Zambia Business Analytics',
        salary: 'K5,500 - K10,000',
        description: 'Analyze business data and create insights using Power BI, Excel, and SQL.',
        category: 'data-analytics',
        location: 'kitwe',
        tags: ['Power BI', 'Excel', 'SQL', 'Data Analysis'],
        bidsRequired: 10,
        experience: '2+ years',
        type: 'Full-time'
    },
    {
        id: 6,
        title: 'Digital Marketing Specialist',
        company: 'Growth Marketing Zambia',
        salary: 'K4,000 - K7,500',
        description: 'Manage social media campaigns, Google Ads, and email marketing for local businesses.',
        category: 'marketing',
        location: 'lusaka',
        tags: ['Social Media', 'Google Ads', 'Email Marketing'],
        bidsRequired: 8,
        experience: '1+ years',
        type: 'Contract'
    },
    {
        id: 7,
        title: 'UI/UX Designer',
        company: 'User Experience Zambia',
        salary: 'K5,000 - K9,000',
        description: 'Design intuitive user interfaces and improve user experience for web and mobile apps.',
        category: 'ui-ux-design',
        location: 'remote',
        tags: ['Figma', 'UI Design', 'UX Research'],
        bidsRequired: 10,
        experience: '2+ years',
        type: 'Remote'
    },
    {
        id: 8,
        title: 'Video Editor & Animator',
        company: 'Creative Media Zambia',
        salary: 'K3,500 - K6,500',
        description: 'Create engaging video content, animations, and promotional videos for businesses.',
        category: 'video-production',
        location: 'lusaka',
        tags: ['Adobe Premiere', 'After Effects', 'Animation'],
        bidsRequired: 8,
        experience: '1+ years',
        type: 'Contract'
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
    try {
        console.log('🚀 ZED HUSTLE Platform Initializing...');
        
        // Check if elements exist
        const signupBtn = document.getElementById('signupBtn');
        const signupModal = document.getElementById('signupModal');
        console.log('Signup button found:', !!signupBtn);
        console.log('Signup modal found:', !!signupModal);
        
    initializeApp();
        initializeAdminAccess();
        console.log('✅ ZED HUSTLE Platform Ready!');
    } catch (error) {
        console.error('❌ Error initializing ZED HUSTLE Platform:', error);
        showNotification('Platform initialization error. Please refresh the page.', 'error');
    }
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
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    console.log('Setting up event listeners...');
    console.log('Login button:', !!loginBtn);
    console.log('Signup button:', !!signupBtn);
    console.log('Get Started button:', !!getStartedBtn);
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            console.log('Login button clicked');
            showModal('loginModal');
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            console.log('Signup button clicked');
            showModal('signupModal');
        });
    }
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            console.log('Get Started button clicked');
            showModal('signupModal');
        });
    }
    
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
    document.getElementById('experienceFilter')?.addEventListener('change', filterJobs);
    
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
            // Try Supabase users table lookup
            const { data: users, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .eq('password', password) // In production, use proper password hashing
                .single();
                
            if (userError || !users) {
                // Fallback to localStorage for local testing
                const localUsers = JSON.parse(localStorage.getItem('zedHustleUsers') || '[]');
                const localUser = localUsers.find(u => u.email === email && u.password === password);
                
                if (localUser) {
                    currentUser = localUser;
                } else {
                    showNotification('Invalid email or password', 'error');
                    return;
                }
            } else {
                currentUser = users;
            }
            
            localStorage.setItem('zedHustleCurrentUser', JSON.stringify(currentUser));
            closeAllModals();
            showNotification('Login successful!', 'success');
            updateAuthUI();
            loadUserDashboard();
            
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
            // Check if user already exists in Supabase
            const { data: existingUsers, error: checkError } = await supabase
                .from('users')
                .select('email')
                .eq('email', email);
                
            if (existingUsers && existingUsers.length > 0) {
                showNotification('Account with this email already exists', 'error');
                return;
            }
            
            // Create new user in Supabase
            const newUser = {
                full_name: fullName,
                email: email,
                password: password, // In production, this should be hashed
                phone: phone,
                bids: 50, // Free bids on signup
                wallet: 0,
                referral_earnings: 0,
                referral_code: generateReferralCode(),
                is_premium: false,
                premium_tier: null,
                portfolio: [],
                achievements: [],
                has_paid_signup_fee: false
            };
            
            const { data: insertedUser, error: insertError } = await supabase
                .from('users')
                .insert([newUser])
                .select()
                .single();
                
            if (insertError) {
                console.error('Supabase insert error:', insertError);
                // Fallback to localStorage
                const users = JSON.parse(localStorage.getItem('zedHustleUsers') || '[]');
                const localUser = {
                    id: Date.now().toString(),
                    email: email,
                    password: password,
                    fullName: fullName,
                    phone: phone,
                    bids: 50,
                    wallet: 0,
                    plan: 'free',
                    referralEarnings: 0,
                    referralCode: generateReferralCode(),
                    createdAt: new Date().toISOString(),
                    tokens: { copper: 0, gold: 0, maize: 0, oil: 0, mealieMeal: 0 },
                    trades: [],
                    investments: []
                };
                users.push(localUser);
                localStorage.setItem('zedHustleUsers', JSON.stringify(users));
                currentUser = localUser;
            } else {
                currentUser = insertedUser;
            }
            
            localStorage.setItem('zedHustleCurrentUser', JSON.stringify(currentUser));
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
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        
        // Handle both Supabase and localStorage user name formats
        const displayName = currentUser.fullName || currentUser.full_name || currentUser.email || 'User';
        if (userName) userName.textContent = displayName;
        
        // Show dashboard and load user data
        const dashboard = document.getElementById('dashboard');
        const jobs = document.getElementById('jobs');
        if (dashboard) dashboard.style.display = 'block';
        if (jobs) jobs.style.display = 'none';
        
        // Load dashboard data
        loadUserDashboard();
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
        
        // Hide dashboard
        const dashboard = document.getElementById('dashboard');
        const jobs = document.getElementById('jobs');
        if (dashboard) dashboard.style.display = 'none';
        if (jobs) jobs.style.display = 'block';
    }
}

// Job Functions
async function loadJobs() {
    const jobsList = document.getElementById('jobsList');
    if (!jobsList) return;
    
    try {
        // Try to load jobs from Supabase
        const { data: supabaseJobs, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'active');
            
        if (error) {
            console.log('Using sample jobs, Supabase error:', error.message);
            jobs = [...sampleJobs]; // Fallback to sample data
        } else if (supabaseJobs && supabaseJobs.length > 0) {
            jobs = supabaseJobs.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company || 'Company',
                salary: job.salary || 'Negotiable',
                description: job.description,
                category: job.category,
                location: job.location,
                tags: job.tags || [],
                bidsRequired: job.bids_required || 5
            }));
        } else {
            jobs = [...sampleJobs]; // Fallback to sample data
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        jobs = [...sampleJobs]; // Fallback to sample data
    }
    
    jobsList.innerHTML = jobs.map(job => {
        // Determine experience level for filtering
        let experienceLevel = 'entry';
        if (job.experience && job.experience.includes('3+') || job.experience && job.experience.includes('5+')) {
            experienceLevel = 'senior';
        } else if (job.experience && job.experience.includes('2+')) {
            experienceLevel = 'mid';
        }
        
        return `
            <div class="job-card" data-category="${job.category}" data-location="${job.location}" data-experience="${experienceLevel}">
                <div class="job-header">
                    <div class="job-title-section">
                        <h3 class="job-title">${job.title}</h3>
                        <span class="job-type ${job.type?.toLowerCase().replace(' ', '-') || 'full-time'}">${job.type || 'Full-time'}</span>
                    </div>
                    <div class="company-info">
                        <i class="fas fa-building"></i>
                        <span class="company-name">${job.company}</span>
                    </div>
                </div>
                
                <div class="job-details">
                    <div class="salary-info">
                        <i class="fas fa-money-bill-wave"></i>
                        <span class="salary">${job.salary}</span>
                    </div>
                    <div class="experience-info">
                        <i class="fas fa-user-tie"></i>
                        <span class="experience">${job.experience || 'Not specified'}</span>
                    </div>
                    <div class="location-info">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="location">${job.location.charAt(0).toUpperCase() + job.location.slice(1)}</span>
                    </div>
                </div>
                
                <p class="description">${job.description}</p>
                
                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                
                <div class="job-footer">
                    <div class="bids-info">
                        <i class="fas fa-ticket-alt"></i>
                        <span class="bids-required">${job.bidsRequired} bids required</span>
                    </div>
                    <button class="apply-btn" onclick="applyForJob(${job.id})">
                        <i class="fas fa-paper-plane"></i>
                        Apply Now
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function filterJobs() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value;
    
    const jobCards = document.querySelectorAll('.job-card');
    
    jobCards.forEach(card => {
        const category = card.dataset.category;
        const location = card.dataset.location;
        const experience = card.dataset.experience;
        
        const categoryMatch = !categoryFilter || category === categoryFilter;
        const locationMatch = !locationFilter || location === locationFilter;
        const experienceMatch = !experienceFilter || experience === experienceFilter;
        
        card.style.display = (categoryMatch && locationMatch && experienceMatch) ? 'block' : 'none';
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
    
    console.log('Loading dashboard for user:', currentUser);
    
    // Handle both Supabase schema and localStorage schema
    const bids = currentUser.bids || 0;
    const wallet = currentUser.wallet || 0;
    const plan = currentUser.plan || (currentUser.is_premium ? 'Premium' : 'Free');
    const referralEarnings = currentUser.referralEarnings || currentUser.referral_earnings || 0;
    const referralCode = currentUser.referralCode || currentUser.referral_code || 'N/A';
    
    // Update stats
    const userBidsEl = document.getElementById('userBids');
    const userWalletEl = document.getElementById('userWallet');
    const userPlanEl = document.getElementById('userPlan');
    const userReferralEarningsEl = document.getElementById('userReferralEarnings');
    const userReferralCodeEl = document.getElementById('userReferralCode');
    
    if (userBidsEl) userBidsEl.textContent = bids;
    if (userWalletEl) userWalletEl.textContent = `K${wallet.toFixed(2)}`;
    if (userPlanEl) userPlanEl.textContent = plan;
    if (userReferralEarningsEl) userReferralEarningsEl.textContent = `K${referralEarnings.toFixed(2)}`;
    if (userReferralCodeEl) userReferralCodeEl.textContent = referralCode;
    
    console.log('Dashboard updated with:', { bids, wallet, plan, referralEarnings, referralCode });
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
    console.log('showModal called with:', modalId);
    const modal = document.getElementById(modalId);
    console.log('Modal found:', !!modal);
    
    closeAllModals();
    
    if (modal) {
        modal.style.display = 'block';
        console.log('Modal displayed:', modalId);
    } else {
        console.error('Modal not found:', modalId);
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