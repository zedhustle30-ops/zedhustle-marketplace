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
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    jobs = [...sampleJobs];
    initializeEventListeners();
    loadJobs();
    checkAuthStatus();
}

function initializeEventListeners() {
    // Navigation
    document.getElementById('loginBtn').addEventListener('click', () => showModal('loginModal'));
    document.getElementById('signupBtn').addEventListener('click', () => showModal('signupModal'));
    document.getElementById('getStartedBtn').addEventListener('click', () => showModal('signupModal'));
    
    // Modal controls
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Job filters
    document.getElementById('categoryFilter').addEventListener('change', filterJobs);
    document.getElementById('locationFilter').addEventListener('change', filterJobs);
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
        const user = getUserByEmail(email);
        
        if (user) {
            if (user.hasPaidSignupFee) {
                currentUser = user;
                closeAllModals();
                updateUIForLoggedInUser();
                showNotification('Login successful!', 'success');
            } else {
                showPaymentPrompt(user);
            }
        } else {
            showNotification('Invalid credentials.', 'error');
        }
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('signupPhone').value,
        password: document.getElementById('signupPassword').value,
        referralCode: document.getElementById('referralCode').value
    };
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (getUserByEmail(formData.email)) {
        showNotification('User with this email already exists.', 'error');
        return;
    }
    
    const newUser = {
        id: generateId(),
        ...formData,
        hasPaidSignupFee: false,
        bids: 0,
        wallet: 0,
        referralEarnings: 0,
        referralCode: generateReferralCode(),
        createdAt: new Date().toISOString()
    };
    
    saveUser(newUser);
    closeAllModals();
    showPaymentPrompt(newUser);
}

function showPaymentPrompt(user) {
    const paymentModal = createPaymentModal(user);
    document.body.appendChild(paymentModal);
    setTimeout(() => paymentModal.style.display = 'flex', 100);
}

function createPaymentModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'none';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Complete Your Registration</h2>
            <div class="payment-info">
                <div class="payment-amount">
                    <h3>Signup Fee: K30</h3>
                    <p>After payment, you'll receive:</p>
                    <ul>
                        <li><i class="fas fa-check"></i> 50 bids for job applications</li>
                        <li><i class="fas fa-check"></i> 1 week full access to all features</li>
                        <li><i class="fas fa-check"></i> Ability to refer others and earn rewards</li>
                    </ul>
                </div>
                <div class="payment-methods">
                    <h4>Choose Payment Method:</h4>
                    <button class="btn btn-primary payment-method" data-method="mobile-money">
                        <i class="fas fa-mobile-alt"></i> Mobile Money
                    </button>
                    <button class="btn btn-outline payment-method" data-method="bank-transfer">
                        <i class="fas fa-university"></i> Bank Transfer
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.querySelectorAll('.payment-method').forEach(btn => {
        btn.addEventListener('click', () => processPayment(user, btn.dataset.method));
    });
    
    return modal;
}

function processPayment(user, method) {
    showNotification(`Processing ${method} payment...`, 'info');
    
    setTimeout(() => {
        user.hasPaidSignupFee = true;
        user.bids = 50;
        user.wallet = 0;
        user.paymentMethod = method;
        user.paymentDate = new Date().toISOString();
        
        saveUser(user);
        
        if (user.referralCode) {
            processReferral(user.referralCode);
        }
        
        currentUser = user;
        updateUIForLoggedInUser();
        document.querySelector('.modal').remove();
        showNotification('Payment successful! Welcome to ZED HUSTLE!', 'success');
    }, 2000);
}

// Job Management Functions
function loadJobs() {
    const jobsGrid = document.getElementById('jobsGrid');
    jobsGrid.innerHTML = '';
    
    jobs.forEach(job => {
        const jobCard = createJobCard(job);
        jobsGrid.appendChild(jobCard);
    });
}

function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    
    card.innerHTML = `
        <div class="job-header">
            <div>
                <h3 class="job-title">${job.title}</h3>
                <p class="job-company">${job.company}</p>
            </div>
            <span class="job-salary">${job.salary}</span>
        </div>
        <p class="job-description">${job.description}</p>
        <div class="job-tags">
            ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
        </div>
        <button class="job-apply" onclick="applyForJob(${job.id})">
            Apply (${job.bidsRequired} bid${job.bidsRequired > 1 ? 's' : ''})
        </button>
    `;
    
    return card;
}

function applyForJob(jobId) {
    if (!currentUser) {
        showModal('loginModal');
        return;
    }
    
    const job = jobs.find(j => j.id === jobId);
    
    if (currentUser.bids < job.bidsRequired) {
        showNotification(`You need ${job.bidsRequired} bid(s) to apply for this job.`, 'error');
        return;
    }
    
    currentUser.bids -= job.bidsRequired;
    saveUser(currentUser);
    updateUserStats();
    showNotification(`Successfully applied for "${job.title}"!`, 'success');
}

function filterJobs() {
    const category = document.getElementById('categoryFilter').value;
    const location = document.getElementById('locationFilter').value;
    
    let filteredJobs = sampleJobs;
    
    if (category) {
        filteredJobs = filteredJobs.filter(job => job.category === category);
    }
    
    if (location) {
        filteredJobs = filteredJobs.filter(job => job.location === location);
    }
    
    jobs = filteredJobs;
    loadJobs();
}

// Utility Functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}

function updateUIForLoggedInUser() {
    const navAuth = document.querySelector('.nav-auth');
    navAuth.innerHTML = `
        <span class="user-info">
            <i class="fas fa-user"></i>
            ${currentUser.name}
        </span>
        <button class="btn btn-outline" onclick="showUserDashboard()">Dashboard</button>
        <button class="btn btn-primary" onclick="logout()">Logout</button>
    `;
    
    updateUserStats();
}

function updateUserStats() {
    if (!currentUser) return;
    
    let statsDisplay = document.querySelector('.user-stats');
    if (!statsDisplay) {
        statsDisplay = document.createElement('div');
        statsDisplay.className = 'user-stats';
        document.querySelector('.nav-container').appendChild(statsDisplay);
    }
    
    statsDisplay.innerHTML = `
        <div class="stat-item">
            <i class="fas fa-coins"></i>
            <span>${currentUser.bids} Bids</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-wallet"></i>
            <span>K${currentUser.wallet.toFixed(2)}</span>
        </div>
    `;
}

function showUserDashboard() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Welcome, ${currentUser.name}!</h2>
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Available Bids</h3>
                    <p class="stat-value">${currentUser.bids}</p>
                </div>
                <div class="stat-card">
                    <h3>Wallet Balance</h3>
                    <p class="stat-value">K${currentUser.wallet.toFixed(2)}</p>
                </div>
                <div class="stat-card">
                    <h3>Referral Earnings</h3>
                    <p class="stat-value">K${currentUser.referralEarnings.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function logout() {
    currentUser = null;
    location.reload();
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.email === email);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateReferralCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function processReferral(referralCode) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const referrer = users.find(user => user.referralCode === referralCode);
    
    if (referrer) {
        referrer.referralEarnings += 5;
        referrer.wallet += 5;
        saveUser(referrer);
        showNotification(`Referral bonus of K5 credited to ${referrer.name}!`, 'success');
    }
} 