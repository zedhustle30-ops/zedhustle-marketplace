<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <Navbar />
    
    <!-- Main Content -->
    <main class="pt-16">
      <router-view />
    </main>
    
    <!-- Footer -->
    <Footer />
    
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        <span class="text-gray-700">Loading...</span>
      </div>
    </div>
    
    <!-- Notification Toast -->
    <div v-if="notification.show" 
         class="fixed top-20 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 transition-all duration-300"
         :class="notificationClasses">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <i :class="notificationIcon" class="text-xl"></i>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
        </div>
        <button @click="hideNotification" class="ml-4 text-gray-400 hover:text-gray-600">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  setup() {
    const appStore = useAppStore()
    
    const isLoading = computed(() => appStore.isLoading)
    const notification = computed(() => appStore.notification)
    
    const notificationClasses = computed(() => {
      const type = notification.value.type
      return {
        'border-green-500': type === 'success',
        'border-blue-500': type === 'info',
        'border-yellow-500': type === 'warning',
        'border-red-500': type === 'error'
      }
    })
    
    const notificationIcon = computed(() => {
      const type = notification.value.type
      const icons = {
        success: 'fas fa-check-circle text-green-500',
        info: 'fas fa-info-circle text-blue-500',
        warning: 'fas fa-exclamation-triangle text-yellow-500',
        error: 'fas fa-times-circle text-red-500'
      }
      return icons[type] || icons.info
    })
    
    const hideNotification = () => {
      appStore.hideNotification()
    }
    
    return {
      isLoading,
      notification,
      notificationClasses,
      notificationIcon,
      hideNotification
    }
  }
}
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>