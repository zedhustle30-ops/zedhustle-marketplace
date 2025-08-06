import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { useAppStore } from './app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isUser: (state) => state.user?.role === 'user',
    isEmployer: (state) => state.user?.role === 'employer',
    isBusinessOwner: (state) => state.user?.role === 'business_owner',
    isAdmin: (state) => state.user?.role === 'admin',
    
    fullName: (state) => {
      if (!state.user?.profile) return ''
      return `${state.user.profile.firstName} ${state.user.profile.lastName}`
    },
    
    walletBalance: (state) => state.user?.wallet?.balance || 0,
    virtualBalance: (state) => state.user?.tradingAccount?.virtualBalance || 0,
    totalPortfolioValue: (state) => state.user?.totalPortfolioValue || 0,
    
    hasRole: (state) => (roles) => {
      if (!state.user?.role) return false
      return Array.isArray(roles) ? roles.includes(state.user.role) : state.user.role === roles
    }
  },

  actions: {
    async login(credentials) {
      const appStore = useAppStore()
      this.loading = true
      
      try {
        const response = await api.post('/auth/login', credentials)
        const { user, token, refreshToken } = response.data.data
        
        this.setAuthData(user, token, refreshToken)
        
        appStore.showSuccess('Welcome back!', 'Login Successful')
        return { success: true }
        
      } catch (error) {
        const message = error.response?.data?.error?.message || 'Login failed'
        appStore.showError(message, 'Login Failed')
        return { success: false, error: message }
        
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      const appStore = useAppStore()
      this.loading = true
      
      try {
        const response = await api.post('/auth/register', userData)
        const { user, token, refreshToken } = response.data.data
        
        this.setAuthData(user, token, refreshToken)
        
        appStore.showSuccess('Account created successfully!', 'Welcome to ZedHustle')
        return { success: true }
        
      } catch (error) {
        const message = error.response?.data?.error?.message || 'Registration failed'
        appStore.showError(message, 'Registration Failed')
        return { success: false, error: message }
        
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const appStore = useAppStore()
      
      try {
        if (this.token) {
          await api.post('/auth/logout')
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuthData()
        appStore.showInfo('You have been logged out')
      }
    },

    async refreshAuthToken() {
      if (!this.refreshToken) {
        this.clearAuthData()
        return false
      }

      try {
        const response = await api.post('/auth/refresh', {
          refreshToken: this.refreshToken
        })
        
        const { token, refreshToken } = response.data.data
        this.setTokens(token, refreshToken)
        
        return true
        
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.clearAuthData()
        return false
      }
    },

    async fetchUser() {
      if (!this.token) return false

      try {
        const response = await api.get('/auth/me')
        this.user = response.data.data
        this.isAuthenticated = true
        return true
        
      } catch (error) {
        console.error('Fetch user error:', error)
        this.clearAuthData()
        return false
      }
    },

    async updateProfile(profileData) {
      const appStore = useAppStore()
      
      try {
        const response = await api.put('/auth/profile', profileData)
        this.user = response.data.data
        
        appStore.showSuccess('Profile updated successfully')
        return { success: true }
        
      } catch (error) {
        const message = error.response?.data?.error?.message || 'Profile update failed'
        appStore.showError(message, 'Update Failed')
        return { success: false, error: message }
      }
    },

    async forgotPassword(email) {
      const appStore = useAppStore()
      
      try {
        await api.post('/auth/forgot-password', { email })
        appStore.showSuccess('Password reset instructions sent to your email')
        return { success: true }
        
      } catch (error) {
        const message = error.response?.data?.error?.message || 'Failed to send reset email'
        appStore.showError(message, 'Reset Failed')
        return { success: false, error: message }
      }
    },

    async resetPassword(token, newPassword) {
      const appStore = useAppStore()
      
      try {
        await api.post('/auth/reset-password', { token, newPassword })
        appStore.showSuccess('Password reset successfully')
        return { success: true }
        
      } catch (error) {
        const message = error.response?.data?.error?.message || 'Password reset failed'
        appStore.showError(message, 'Reset Failed')
        return { success: false, error: message }
      }
    },

    async initializeAuth() {
      if (!this.token) return false

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      
      // Try to fetch user data
      const success = await this.fetchUser()
      
      if (!success) {
        // Try to refresh token
        const refreshed = await this.refreshAuthToken()
        if (refreshed) {
          return await this.fetchUser()
        }
      }
      
      return success
    },

    setAuthData(user, token, refreshToken) {
      this.user = user
      this.token = token
      this.refreshToken = refreshToken
      this.isAuthenticated = true
      
      // Store in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      
      // Set API header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    setTokens(token, refreshToken) {
      this.token = token
      this.refreshToken = refreshToken
      
      // Store in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      
      // Set API header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    clearAuthData() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false
      
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      
      // Clear API header
      delete api.defaults.headers.common['Authorization']
    },

    // Utility methods
    can(permission) {
      // Role-based permissions
      const permissions = {
        'post_job': ['employer', 'admin'],
        'create_investment': ['business_owner', 'admin'],
        'manage_users': ['admin'],
        'moderate_content': ['admin']
      }
      
      const allowedRoles = permissions[permission]
      return allowedRoles ? this.hasRole(allowedRoles) : false
    },

    updateWalletBalance(newBalance) {
      if (this.user?.wallet) {
        this.user.wallet.balance = newBalance
      }
    },

    updateVirtualBalance(newBalance) {
      if (this.user?.tradingAccount) {
        this.user.tradingAccount.virtualBalance = newBalance
      }
    }
  }
})