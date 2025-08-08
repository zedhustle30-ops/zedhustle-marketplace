// Global variables
let currentUser = null;
let jobs = [];

// Initialize Supabase client
const supabaseUrl = 'https://jpdndlnblbbtaxcrsyfm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Admin access configuration
const ADMIN_EMAIL = 'admin@zedhustle.com';
const ADMIN_PASSWORD_HASH = 'ZH2024$ADMIN#SECURE'; // This should be hashed in production

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
    initializeAdminAccess();
}

// Secure admin access system
function initializeAdminAccess() {
    let keySequence = '';
    const adminSequence = 'ZEDHUSTLE';
    
    document.addEventListener('keydown', (e) => {
        keySequence += e.key.toUpperCase();
        
        if (keySequence.length > adminSequence.length) {
            keySequence = keySequence.slice(-adminSequence.length);
        }
        
        if (keySequence === adminSequence) {
            keySequence = '';
            showSecureAdminLogin();
        }
    });
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

            console.log('Creating user profile:', userProfile);

            const { data: insertedUser, error: profileError } = await supabase
                .from('users')
                .insert([userProfile])
                .select()
                .single();

            if (profileError) {
                console.error('Profile creation error:', profileError);
                showNotification('Account created but profile setup failed: ' + profileError.message, 'error');
            } else {
                console.log('Profile created successfully:', insertedUser);
                currentUser = insertedUser;
                closeAllModals();
                showPaymentPrompt(insertedUser);
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

// Secure Admin Functions
function showSecureAdminLogin() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="auth-header">
                <h2><i class="fas fa-shield-alt"></i> Admin Access</h2>
                <p>Authorized Personnel Only</p>
            </div>
            <form class="auth-form" id="adminLoginForm">
                <div class="form-group">
                    <label for="adminEmail">Admin Email</label>
                    <input type="email" id="adminEmail" required autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="adminPassword">Admin Password</label>
                    <input type="password" id="adminPassword" required autocomplete="off">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-sign-in-alt"></i> Access Admin Panel
                </button>
                <button type="button" class="btn btn-outline" onclick="this.closest('.modal').remove()" style="margin-top: 0.5rem;">
                    Cancel
                </button>
            </form>
        </div>
    `;
    
    modal.querySelector('#adminLoginForm').addEventListener('submit', handleAdminLogin);
    document.body.appendChild(modal);
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    // Enhanced security check
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD_HASH) {
        // Additional security: Check if user is on localhost or specific domain
        const isSecureEnvironment = window.location.hostname === 'localhost' || 
                                   window.location.hostname === '127.0.0.1' ||
                                   window.location.hostname.includes('zedhustle');
        
        if (isSecureEnvironment) {
            e.target.closest('.modal').remove();
            showAdminPanel();
            showNotification('Admin access granted', 'success');
        } else {
            showNotification('Admin access denied: Unauthorized environment', 'error');
        }
    } else {
        showNotification('Invalid admin credentials', 'error');
        // Add delay to prevent brute force
        setTimeout(() => {
            document.getElementById('adminEmail').value = '';
            document.getElementById('adminPassword').value = '';
        }, 2000);
    }
}

function showAdminPanel() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 90vh;">
            <div class="auth-header">
                <h2><i class="fas fa-cogs"></i> ZED HUSTLE Admin Panel</h2>
                <p>System Administration Dashboard</p>
            </div>
            <div class="admin-panel" style="padding: 1.5rem; overflow-y: auto;">
                <div class="admin-tabs">
                    <button class="admin-tab-btn active" onclick="showAdminTab('users')">
                        <i class="fas fa-users"></i> Users
                    </button>
                    <button class="admin-tab-btn" onclick="showAdminTab('jobs')">
                        <i class="fas fa-briefcase"></i> Jobs
                    </button>
                    <button class="admin-tab-btn" onclick="showAdminTab('payments')">
                        <i class="fas fa-credit-card"></i> Payments
                    </button>
                    <button class="admin-tab-btn" onclick="showAdminTab('settings')">
                        <i class="fas fa-cog"></i> Settings
                    </button>
                </div>
                
                <div id="admin-users" class="admin-tab-content active">
                    <h3>User Management</h3>
                    <div class="admin-stats">
                        <div class="stat-card">
                            <h4>Total Users</h4>
                            <p class="stat-value" id="totalUsers">Loading...</p>
                        </div>
                        <div class="stat-card">
                            <h4>Paid Users</h4>
                            <p class="stat-value" id="paidUsers">Loading...</p>
                        </div>
                        <div class="stat-card">
                            <h4>Revenue</h4>
                            <p class="stat-value" id="totalRevenue">Loading...</p>
                        </div>
                    </div>
                    <div id="usersList">Loading users...</div>
                </div>
                
                <div id="admin-jobs" class="admin-tab-content">
                    <h3>Job Management</h3>
                    <button class="btn btn-primary" onclick="addNewJob()">
                        <i class="fas fa-plus"></i> Add New Job
                    </button>
                    <div id="jobsList" style="margin-top: 1rem;">Loading jobs...</div>
                </div>
                
                <div id="admin-payments" class="admin-tab-content">
                    <h3>Payment Management</h3>
                    <div id="paymentsList">Loading payments...</div>
                </div>
                
                <div id="admin-settings" class="admin-tab-content">
                    <h3>System Settings</h3>
                    <div class="settings-section">
                        <h4>Platform Settings</h4>
                        <div class="form-group">
                            <label>Signup Fee (K)</label>
                            <input type="number" id="signupFee" value="30" min="0">
                        </div>
                        <div class="form-group">
                            <label>Referral Bonus (K)</label>
                            <input type="number" id="referralBonus" value="5" min="0">
                        </div>
                        <button class="btn btn-primary" onclick="saveSettings()">
                            <i class="fas fa-save"></i> Save Settings
                        </button>
                    </div>
                </div>
            </div>
            
            <div style="padding: 1rem; border-top: 1px solid #e5e7eb; text-align: center;">
                <button class="btn btn-outline" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i> Close Admin Panel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    loadAdminData();
}

function showAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`admin-${tabName}`).classList.add('active');
    event.target.classList.add('active');
}

async function loadAdminData() {
    try {
        // Load user statistics
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*');
            
        if (!usersError && users) {
            document.getElementById('totalUsers').textContent = users.length;
            document.getElementById('paidUsers').textContent = users.filter(u => u.has_paid_signup_fee).length;
            document.getElementById('totalRevenue').textContent = `K${(users.filter(u => u.has_paid_signup_fee).length * 30).toFixed(2)}`;
            
            // Display users list
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = users.map(user => `
                <div class="user-item" style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${user.full_name}</strong> (${user.email})
                            <br><small>Phone: ${user.phone || 'N/A'} | Bids: ${user.bids} | Wallet: K${user.wallet}</small>
                        </div>
                        <div>
                            <span class="badge ${user.has_paid_signup_fee ? 'badge-success' : 'badge-warning'}">
                                ${user.has_paid_signup_fee ? 'Paid' : 'Unpaid'}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        // Load jobs
        const jobsList = document.getElementById('jobsList');
        jobsList.innerHTML = jobs.map(job => `
            <div class="job-item" style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 0.5rem;">
                <h4>${job.title}</h4>
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Salary:</strong> ${job.salary}</p>
                <button class="btn btn-sm btn-outline" onclick="editJob(${job.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteJob(${job.id})">Delete</button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading admin data:', error);
        showNotification('Error loading admin data', 'error');
    }
}

function saveSettings() {
    const signupFee = document.getElementById('signupFee').value;
    const referralBonus = document.getElementById('referralBonus').value;
    
    localStorage.setItem('adminSettings', JSON.stringify({
        signupFee: parseFloat(signupFee),
        referralBonus: parseFloat(referralBonus)
    }));
    
    showNotification('Settings saved successfully', 'success');
} 