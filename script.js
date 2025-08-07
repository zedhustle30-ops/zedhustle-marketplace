// Global variables
let currentUser = null;
let jobs = [];

// Initialize Supabase client
const supabaseUrl = 'https://jpdndlnblbbtaxcrsyfm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

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

async function initializeApp() {
    jobs = [...sampleJobs];
    initializeEventListeners();
    loadJobs();
    await checkAuthStatus();
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
    
    // Modal switching buttons
    document.getElementById('switchToLoginBtn').addEventListener('click', () => {
        closeAllModals();
        setTimeout(() => showModal('loginModal'), 100);
    });
    
    document.getElementById('switchToSignupBtn').addEventListener('click', () => {
        closeAllModals();
        setTimeout(() => showModal('signupModal'), 100);
    });
    
    // Job filters
    document.getElementById('categoryFilter').addEventListener('change', filterJobs);
    document.getElementById('locationFilter').addEventListener('change', filterJobs);
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }

    try {
        // Show loading state
        const loginBtn = e.target.querySelector('button[type="submit"]');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Signing in...';
        loginBtn.disabled = true;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                showNotification('Invalid email or password.', 'error');
            } else {
                showNotification('Login failed: ' + error.message, 'error');
            }
        } else {
            // Get user profile from database
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                showNotification('Error loading user profile.', 'error');
            } else {
                currentUser = profile || { email: data.user.email, id: data.user.id };
                closeAllModals();
                updateUIForLoggedInUser();
                showNotification('Login successful!', 'success');
            }
        }
    } catch (error) {
        showNotification('Login failed: ' + error.message, 'error');
    } finally {
        // Reset button state
        const loginBtn = e.target.querySelector('button[type="submit"]');
        loginBtn.textContent = 'Sign In';
        loginBtn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('signupPhone').value,
        password: document.getElementById('signupPassword').value,
        referralCode: document.getElementById('referralCode')?.value || ''
    };
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Check password strength
    if (formData.password.length < 6) {
        showNotification('Password must be at least 6 characters long.', 'error');
        return;
    }

    try {
        // Show loading state
        const signupBtn = e.target.querySelector('button[type="submit"]');
        const originalText = signupBtn.textContent;
        signupBtn.textContent = 'Creating account...';
        signupBtn.disabled = true;

        // Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.name,
                    phone: formData.phone
                }
            }
        });

        if (error) {
            if (error.message.includes('For security purposes')) {
                showNotification('Please wait 30 seconds before trying again.', 'error');
            } else if (error.message.includes('already registered')) {
                showNotification('An account with this email already exists.', 'error');
            } else {
                showNotification('Signup failed: ' + error.message, 'error');
            }
        } else {
            // Create user profile in database
            const userProfile = {
                id: data.user.id,
                email: formData.email,
                full_name: formData.name,
                phone: formData.phone,
                has_paid_signup_fee: false,
                bids: 0,
                wallet: 0,
                referral_earnings: 0,
                referral_code: generateReferralCode(),
                created_at: new Date().toISOString()
            };

            const { error: profileError } = await supabase
                .from('users')
                .insert([userProfile]);

            if (profileError) {
                showNotification('Account created but profile setup failed. Please contact support.', 'error');
            } else {
                currentUser = userProfile;
                closeAllModals();
                showPaymentPrompt(userProfile);
                showNotification('Account created successfully! Please complete payment.', 'success');
            }
        }
    } catch (error) {
        showNotification('Signup failed: ' + error.message, 'error');
    } finally {
        // Reset button state
        const signupBtn = e.target.querySelector('button[type="submit"]');
        signupBtn.textContent = 'Create Account';
        signupBtn.disabled = false;
    }
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

async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            showNotification('Logout failed: ' + error.message, 'error');
        } else {
            currentUser = null;
            location.reload();
            showNotification('Logged out successfully.', 'info');
        }
    } catch (error) {
        showNotification('Logout failed: ' + error.message, 'error');
    }
}

async function checkAuthStatus() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.log('Auth check error:', error.message);
            return;
        }
        
        if (user) {
            // Get user profile from database
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
                console.log('Profile fetch error:', profileError.message);
            } else {
                currentUser = profile || { email: user.email, id: user.id };
                updateUIForLoggedInUser();
            }
        }
    } catch (error) {
        console.log('Auth check failed:', error.message);
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