# ZedHustle Technical Specification

## Project Structure

```
zedhustle/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── payment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── tradingController.js
│   │   ├── investmentController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── rateLimit.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Investment.js
│   │   ├── Portfolio.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── trading.js
│   │   ├── investments.js
│   │   └── payments.js
│   ├── services/
│   │   ├── marketDataService.js
│   │   ├── paymentService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── encryption.js
│   │   ├── validation.js
│   │   └── helpers.js
│   ├── .env
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── jobs/
│   │   │   ├── trading/
│   │   │   ├── investments/
│   │   │   └── payments/
│   │   ├── views/
│   │   │   ├── Dashboard.vue
│   │   │   ├── Jobs.vue
│   │   │   ├── Trading.vue
│   │   │   ├── Investments.vue
│   │   │   └── Profile.vue
│   │   ├── store/
│   │   │   ├── modules/
│   │   │   └── index.js
│   │   ├── router/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── vite.config.js
├── docs/
├── tests/
└── README.md
```

## Backend Implementation Details

### 1. Enhanced User Model

```javascript
// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    location: {
      city: String,
      province: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    avatar: String,
    verified: { type: Boolean, default: false },
    nrcNumber: String, // National Registration Card
    dateOfBirth: Date
  },
  wallet: {
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'ZMW' },
    accountNumber: String, // Generated wallet account number
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
  },
  tradingAccount: {
    virtualBalance: { type: Number, default: 100000 }, // Starting virtual money
    totalReturn: { type: Number, default: 0 },
    portfolios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' }],
    riskTolerance: { type: String, enum: ['conservative', 'moderate', 'aggressive'], default: 'moderate' }
  },
  role: {
    type: String,
    enum: ['user', 'employer', 'business_owner', 'admin'],
    default: 'user'
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' },
    currency: { type: String, default: 'ZMW' }
  },
  kyc: {
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    documents: [{
      type: String, // nrc, passport, utility_bill
      url: String,
      uploadedAt: Date,
      verified: Boolean
    }]
  },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

### 2. Investment Model

```javascript
// backend/models/Investment.js
const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['agriculture', 'technology', 'manufacturing', 'retail', 'services', 'mining', 'tourism', 'other']
  },
  location: {
    city: String,
    province: String,
    address: String
  },
  funding: {
    goal: { type: Number, required: true },
    current: { type: Number, default: 0 },
    minimum: { type: Number, required: true },
    currency: { type: String, default: 'ZMW' }
  },
  returns: {
    expected: Number, // Percentage
    timeline: String, // e.g., "12 months", "2 years"
    type: { type: String, enum: ['fixed', 'variable', 'equity'], default: 'fixed' }
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  documents: {
    businessPlan: String, // File URL
    financials: String, // File URL
    licenses: [String], // Array of file URLs
    images: [String]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investors: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    percentage: Number, // For equity investments
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'confirmed', 'paid'], default: 'pending' },
    paymentReference: String
  }],
  milestones: [{
    title: String,
    description: String,
    targetDate: Date,
    completed: { type: Boolean, default: false },
    completedDate: Date
  }],
  updates: [{
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    attachments: [String]
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'funded', 'closed', 'cancelled'],
    default: 'draft'
  },
  featured: { type: Boolean, default: false },
  deadline: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investment', InvestmentSchema);
```

### 3. Trading Portfolio Model

```javascript
// backend/models/Portfolio.js
const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  description: String,
  virtualBalance: { type: Number, default: 100000 },
  totalValue: { type: Number, default: 100000 },
  totalReturn: { type: Number, default: 0 },
  totalReturnPercentage: { type: Number, default: 0 },
  positions: [{
    symbol: String, // e.g., "USD/ZMW", "AAPL", "GOLD"
    name: String, // Full name
    type: { type: String, enum: ['forex', 'stock', 'commodity', 'crypto'] },
    quantity: Number,
    entryPrice: Number,
    currentPrice: Number,
    unrealizedPL: Number,
    unrealizedPLPercentage: Number,
    dateOpened: { type: Date, default: Date.now },
    stopLoss: Number,
    takeProfit: Number
  }],
  transactions: [{
    type: { type: String, enum: ['buy', 'sell'] },
    symbol: String,
    quantity: Number,
    price: Number,
    fee: Number,
    total: Number,
    date: { type: Date, default: Date.now }
  }],
  performance: {
    dailyReturn: Number,
    weeklyReturn: Number,
    monthlyReturn: Number,
    yearlyReturn: Number,
    maxDrawdown: Number,
    sharpeRatio: Number
  },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
```

### 4. Transaction Model

```javascript
// backend/models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'investment', 'payment', 'refund', 'fee'],
    required: true
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'ZMW' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['airtel_money', 'mtn_money', 'bank_transfer', 'visa', 'mastercard', 'wallet'],
    required: true
  },
  paymentDetails: {
    phoneNumber: String, // For mobile money
    accountNumber: String, // For bank transfers
    bankName: String,
    reference: String, // External payment reference
    providerTransactionId: String
  },
  reference: { type: String, unique: true }, // Internal reference
  description: String,
  metadata: {
    investmentId: mongoose.Schema.Types.ObjectId,
    jobId: mongoose.Schema.Types.ObjectId,
    portfolioId: mongoose.Schema.Types.ObjectId,
    fees: {
      platform: Number,
      payment: Number,
      total: Number
    }
  },
  balanceBefore: Number,
  balanceAfter: Number,
  processedAt: Date,
  failureReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate unique reference before saving
TransactionSchema.pre('save', function(next) {
  if (!this.reference) {
    this.reference = 'ZH' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
```

## Frontend Implementation Details

### 1. Vue.js Application Structure

```javascript
// frontend/src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// UI Framework (Quasar)
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/en-us'
import quasarIconSet from 'quasar/icon-set/material-icons'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

// Chart.js for trading charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {},
  lang: quasarLang,
  iconSet: quasarIconSet,
})

app.mount('#app')
```

### 2. Pinia Store Structure

```javascript
// frontend/src/store/modules/auth.js
import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isEmployer: (state) => state.user?.role === 'employer',
    isBusinessOwner: (state) => state.user?.role === 'business_owner',
    isAdmin: (state) => state.user?.role === 'admin',
    walletBalance: (state) => state.user?.wallet?.balance || 0,
    virtualBalance: (state) => state.user?.tradingAccount?.virtualBalance || 0
  },

  actions: {
    async login(credentials) {
      this.loading = true
      try {
        const response = await api.post('/auth/login', credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        this.isAuthenticated = true
        
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Login failed' }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      try {
        const response = await api.post('/auth/register', userData)
        return { success: true, data: response.data }
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Registration failed' }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    },

    async fetchUser() {
      if (!this.token) return
      
      try {
        const response = await api.get('/auth/me')
        this.user = response.data
        this.isAuthenticated = true
      } catch (error) {
        this.logout()
      }
    }
  }
})
```

### 3. Trading Dashboard Component

```vue
<!-- frontend/src/components/trading/TradingDashboard.vue -->
<template>
  <div class="trading-dashboard">
    <div class="row q-gutter-md">
      <!-- Portfolio Summary -->
      <div class="col-12 col-md-8">
        <q-card class="portfolio-summary">
          <q-card-section>
            <div class="text-h6">Portfolio Performance</div>
            <div class="row q-gutter-md q-mt-sm">
              <div class="col">
                <div class="text-caption text-grey-6">Total Value</div>
                <div class="text-h5 text-positive">
                  K{{ formatCurrency(portfolio.totalValue) }}
                </div>
              </div>
              <div class="col">
                <div class="text-caption text-grey-6">Total Return</div>
                <div class="text-h5" :class="portfolio.totalReturn >= 0 ? 'text-positive' : 'text-negative'">
                  {{ portfolio.totalReturn >= 0 ? '+' : '' }}{{ portfolio.totalReturnPercentage?.toFixed(2) }}%
                </div>
              </div>
              <div class="col">
                <div class="text-caption text-grey-6">Virtual Balance</div>
                <div class="text-h5">K{{ formatCurrency(portfolio.virtualBalance) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Quick Actions -->
      <div class="col-12 col-md-4">
        <q-card class="quick-actions">
          <q-card-section>
            <div class="text-h6">Quick Trade</div>
            <q-select
              v-model="selectedSymbol"
              :options="availableSymbols"
              label="Select Asset"
              class="q-mt-md"
            />
            <div class="row q-gutter-sm q-mt-md">
              <q-btn color="positive" @click="openTradeDialog('buy')" class="col">
                Buy
              </q-btn>
              <q-btn color="negative" @click="openTradeDialog('sell')" class="col">
                Sell
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Market Data -->
    <div class="row q-gutter-md q-mt-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Live Market Data</div>
            <q-table
              :rows="marketData"
              :columns="marketColumns"
              row-key="symbol"
              :loading="loadingMarketData"
              class="q-mt-md"
            >
              <template v-slot:body-cell-change="props">
                <q-td :props="props">
                  <span :class="props.row.change >= 0 ? 'text-positive' : 'text-negative'">
                    {{ props.row.change >= 0 ? '+' : '' }}{{ props.row.change?.toFixed(4) }}
                    ({{ props.row.changePercent?.toFixed(2) }}%)
                  </span>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Trade Dialog -->
    <q-dialog v-model="tradeDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ tradeType === 'buy' ? 'Buy' : 'Sell' }} {{ selectedSymbol?.label }}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model.number="tradeAmount"
            type="number"
            label="Amount"
            prefix="K"
            :rules="[val => val > 0 || 'Amount must be greater than 0']"
          />
          <q-input
            v-model.number="tradeQuantity"
            type="number"
            label="Quantity"
            class="q-mt-md"
            :rules="[val => val > 0 || 'Quantity must be greater than 0']"
          />
          <div class="text-caption text-grey-6 q-mt-sm">
            Current Price: {{ selectedSymbol?.price }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="tradeDialog = false" />
          <q-btn
            :color="tradeType === 'buy' ? 'positive' : 'negative'"
            :label="tradeType === 'buy' ? 'Buy' : 'Sell'"
            @click="executeTrade"
            :loading="executingTrade"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useTradingStore } from '@/store/modules/trading'
import { useAuthStore } from '@/store/modules/auth'

export default {
  name: 'TradingDashboard',
  setup() {
    const tradingStore = useTradingStore()
    const authStore = useAuthStore()

    const tradeDialog = ref(false)
    const tradeType = ref('buy')
    const tradeAmount = ref(0)
    const tradeQuantity = ref(0)
    const selectedSymbol = ref(null)
    const executingTrade = ref(false)

    const availableSymbols = ref([
      { label: 'USD/ZMW', value: 'USDZM', price: 25.50, type: 'forex' },
      { label: 'EUR/ZMW', value: 'EURZM', price: 28.20, type: 'forex' },
      { label: 'GBP/ZMW', value: 'GBPZM', price: 32.10, type: 'forex' },
      { label: 'Gold', value: 'GOLD', price: 2050.00, type: 'commodity' },
      { label: 'Copper', value: 'COPPER', price: 8.45, type: 'commodity' }
    ])

    const marketColumns = [
      { name: 'symbol', label: 'Symbol', field: 'symbol', align: 'left' },
      { name: 'price', label: 'Price', field: 'price', format: val => `${val?.toFixed(4)}` },
      { name: 'change', label: 'Change', field: 'change' },
      { name: 'volume', label: 'Volume', field: 'volume', format: val => val?.toLocaleString() }
    ]

    const portfolio = computed(() => tradingStore.currentPortfolio || {})
    const marketData = computed(() => tradingStore.marketData || [])
    const loadingMarketData = computed(() => tradingStore.loading)

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-ZM').format(value || 0)
    }

    const openTradeDialog = (type) => {
      tradeType.value = type
      tradeDialog.value = true
    }

    const executeTrade = async () => {
      if (!selectedSymbol.value || !tradeAmount.value || !tradeQuantity.value) return

      executingTrade.value = true
      try {
        await tradingStore.executeTrade({
          symbol: selectedSymbol.value.value,
          type: tradeType.value,
          quantity: tradeQuantity.value,
          amount: tradeAmount.value
        })
        tradeDialog.value = false
        tradeAmount.value = 0
        tradeQuantity.value = 0
      } catch (error) {
        console.error('Trade execution failed:', error)
      } finally {
        executingTrade.value = false
      }
    }

    onMounted(() => {
      tradingStore.fetchPortfolio()
      tradingStore.fetchMarketData()
      
      // Set up real-time market data updates
      const interval = setInterval(() => {
        tradingStore.fetchMarketData()
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    })

    return {
      portfolio,
      marketData,
      loadingMarketData,
      marketColumns,
      availableSymbols,
      selectedSymbol,
      tradeDialog,
      tradeType,
      tradeAmount,
      tradeQuantity,
      executingTrade,
      formatCurrency,
      openTradeDialog,
      executeTrade
    }
  }
}
</script>
```

## Payment Integration Specifications

### Zambian Payment Providers

1. **Airtel Money Integration**
   - API Endpoint: Airtel Money Merchant API
   - Required: Merchant ID, API Key, Secret Key
   - Supported Operations: Deposit, Withdrawal, Balance Inquiry
   - Webhook Support: Yes (for transaction status updates)

2. **MTN Mobile Money Integration**
   - API Endpoint: MTN MoMo API
   - Required: Subscription Key, API User, API Key
   - Supported Operations: Request to Pay, Transfer, Balance
   - Webhook Support: Yes

3. **Local Banking Integration**
   - Zanaco Bank API
   - Standard Chartered Bank API
   - First National Bank API
   - Required: Bank-specific credentials and certificates

### Security Implementation

1. **Data Encryption**
   - AES-256 encryption for sensitive data
   - RSA encryption for payment communications
   - SSL/TLS for all API communications

2. **Authentication & Authorization**
   - JWT tokens with 15-minute expiry
   - Refresh tokens with 7-day expiry
   - Role-based access control
   - API rate limiting (100 requests/minute per user)

3. **Payment Security**
   - PCI DSS compliance measures
   - Transaction verification with OTP
   - Fraud detection algorithms
   - Transaction limits and monitoring

This technical specification provides the detailed implementation roadmap for building ZedHustle's complete MVP with all core features integrated.