import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoading: false,
    notification: {
      show: false,
      type: 'info', // success, error, warning, info
      title: '',
      message: '',
      timeout: null
    },
    sidebarOpen: false,
    theme: 'light',
    language: 'en'
  }),

  getters: {
    isDarkMode: (state) => state.theme === 'dark',
    isLightMode: (state) => state.theme === 'light'
  },

  actions: {
    setLoading(loading) {
      this.isLoading = loading
    },

    showNotification({ type = 'info', title, message, duration = 5000 }) {
      // Clear existing timeout
      if (this.notification.timeout) {
        clearTimeout(this.notification.timeout)
      }

      this.notification = {
        show: true,
        type,
        title,
        message,
        timeout: null
      }

      // Auto hide after duration
      if (duration > 0) {
        this.notification.timeout = setTimeout(() => {
          this.hideNotification()
        }, duration)
      }
    },

    hideNotification() {
      if (this.notification.timeout) {
        clearTimeout(this.notification.timeout)
      }
      
      this.notification = {
        show: false,
        type: 'info',
        title: '',
        message: '',
        timeout: null
      }
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    setSidebarOpen(open) {
      this.sidebarOpen = open
    },

    setTheme(theme) {
      this.theme = theme
      localStorage.setItem('theme', theme)
      
      // Apply theme to document
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    setLanguage(language) {
      this.language = language
      localStorage.setItem('language', language)
    },

    initializeApp() {
      // Load theme from localStorage
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.setTheme(savedTheme)
      }

      // Load language from localStorage
      const savedLanguage = localStorage.getItem('language')
      if (savedLanguage) {
        this.setLanguage(savedLanguage)
      }
    },

    // Utility methods for common notifications
    showSuccess(message, title = 'Success') {
      this.showNotification({
        type: 'success',
        title,
        message
      })
    },

    showError(message, title = 'Error') {
      this.showNotification({
        type: 'error',
        title,
        message,
        duration: 8000 // Longer duration for errors
      })
    },

    showWarning(message, title = 'Warning') {
      this.showNotification({
        type: 'warning',
        title,
        message
      })
    },

    showInfo(message, title = 'Info') {
      this.showNotification({
        type: 'info',
        title,
        message
      })
    }
  }
})