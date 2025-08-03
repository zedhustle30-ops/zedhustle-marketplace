import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const appStore = useAppStore()
    
    // Add auth token if available
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    // Show loading for non-background requests
    if (!config.background) {
      appStore.setLoading(true)
    }
    
    return config
  },
  (error) => {
    const appStore = useAppStore()
    appStore.setLoading(false)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const appStore = useAppStore()
    appStore.setLoading(false)
    return response
  },
  async (error) => {
    const authStore = useAuthStore()
    const appStore = useAppStore()
    
    appStore.setLoading(false)
    
    const originalRequest = error.config
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Try to refresh token
      const refreshed = await authStore.refreshAuthToken()
      
      if (refreshed) {
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${authStore.token}`
        return api(originalRequest)
      } else {
        // Refresh failed, redirect to login
        authStore.clearAuthData()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    
    // Handle network errors
    if (!error.response) {
      appStore.showError('Network error. Please check your connection.', 'Connection Error')
    }
    
    return Promise.reject(error)
  }
)

// API methods
export const apiService = {
  // Generic methods
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  
  // Auth methods
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    me: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  },
  
  // Jobs methods
  jobs: {
    getAll: (params = {}) => api.get('/jobs', { params }),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (jobData) => api.post('/jobs', jobData),
    update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
    delete: (id) => api.delete(`/jobs/${id}`),
    apply: (id, applicationData) => api.post(`/jobs/${id}/apply`, applicationData),
    getMyApplications: () => api.get('/jobs/my/applications'),
    getMyPostings: () => api.get('/jobs/my/postings'),
    updateApplicationStatus: (jobId, applicationId, status) => 
      api.put(`/jobs/${jobId}/applications/${applicationId}`, { status }),
  },
  
  // Trading methods
  trading: {
    getMarketData: (params = {}) => api.get('/trading/market-data', { params, background: true }),
    getPortfolios: () => api.get('/trading/portfolios'),
    createPortfolio: (portfolioData) => api.post('/trading/portfolios', portfolioData),
    getPortfolio: (id) => api.get(`/trading/portfolios/${id}`),
    executeTrade: (tradeData) => api.post('/trading/trade', tradeData),
    getHistory: (params = {}) => api.get('/trading/history', { params }),
    getPositions: () => api.get('/trading/positions'),
    closePosition: (id) => api.post(`/trading/positions/${id}/close`),
  },
  
  // Investments methods
  investments: {
    getAll: (params = {}) => api.get('/investments', { params }),
    getById: (id) => api.get(`/investments/${id}`),
    create: (investmentData) => api.post('/investments', investmentData),
    update: (id, investmentData) => api.put(`/investments/${id}`, investmentData),
    delete: (id) => api.delete(`/investments/${id}`),
    invest: (id, amount, paymentMethod) => api.post(`/investments/${id}/invest`, { amount, paymentMethod }),
    getMyInvestments: () => api.get('/investments/my-investments'),
    getMyOpportunities: () => api.get('/investments/my-opportunities'),
    postUpdate: (id, updateData) => api.post(`/investments/${id}/update`, updateData),
  },
  
  // Payments methods
  payments: {
    getWallet: () => api.get('/payments/wallet'),
    deposit: (amount, paymentMethod, phoneNumber) => 
      api.post('/payments/deposit', { amount, paymentMethod, phoneNumber }),
    withdraw: (amount, paymentMethod, phoneNumber) => 
      api.post('/payments/withdraw', { amount, paymentMethod, phoneNumber }),
    getTransactions: (params = {}) => api.get('/payments/transactions', { params }),
    verifyPayment: (transactionId, reference) => 
      api.post('/payments/verify', { transactionId, reference }),
  },
  
  // File upload
  upload: {
    single: (file, type = 'general') => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      
      return api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    
    multiple: (files, type = 'general') => {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file)
      })
      formData.append('type', type)
      
      return api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
  },
}

// Export both the axios instance and the service
export { api }
export default apiService