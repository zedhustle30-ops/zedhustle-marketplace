<template>
  <nav class="bg-white shadow-lg fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0">
            <h1 class="text-2xl font-bold text-zed-green">ZedHustle</h1>
          </router-link>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link 
              to="/" 
              class="nav-link"
              :class="{ 'active': $route.name === 'Home' }"
            >
              Home
            </router-link>
            <router-link 
              to="/jobs" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/jobs') }"
            >
              Jobs
            </router-link>
            <router-link 
              to="/trading" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/trading') }"
              v-if="authStore.isAuthenticated"
            >
              Trade
            </router-link>
            <router-link 
              to="/investments" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/investments') }"
            >
              Invest
            </router-link>
            <router-link 
              to="/zedforex" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/zedforex') }"
              v-if="authStore.isAuthenticated"
            >
              ZedForex
            </router-link>
            <router-link 
              to="/zedinvest" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/zedinvest') }"
              v-if="authStore.isAuthenticated"
            >
              ZedInvest
            </router-link>
            
            <!-- User Menu -->
            <div v-if="authStore.isAuthenticated" class="relative ml-3">
              <div>
                <button 
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zed-green"
                >
                  <img 
                    v-if="authStore.user?.profile?.avatar" 
                    :src="authStore.user.profile.avatar" 
                    :alt="authStore.fullName"
                    class="h-8 w-8 rounded-full object-cover"
                  >
                  <div 
                    v-else
                    class="h-8 w-8 rounded-full bg-zed-green flex items-center justify-center text-white font-medium"
                  >
                    {{ initials }}
                  </div>
                  <span class="ml-2 text-gray-700 font-medium">{{ authStore.fullName }}</span>
                  <i class="fas fa-chevron-down ml-1 text-gray-400"></i>
                </button>
              </div>
              
              <!-- User Dropdown -->
              <div 
                v-if="showUserMenu"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                @click.away="showUserMenu = false"
              >
                <div class="py-1">
                  <router-link 
                    to="/dashboard" 
                    class="dropdown-item"
                    @click="showUserMenu = false"
                  >
                    <i class="fas fa-tachometer-alt mr-2"></i>
                    Dashboard
                  </router-link>
                  <router-link 
                    to="/profile" 
                    class="dropdown-item"
                    @click="showUserMenu = false"
                  >
                    <i class="fas fa-user mr-2"></i>
                    Profile
                  </router-link>
                  <router-link 
                    to="/my-jobs" 
                    class="dropdown-item"
                    @click="showUserMenu = false"
                  >
                    <i class="fas fa-briefcase mr-2"></i>
                    My Jobs
                  </router-link>
                  <router-link 
                    to="/portfolio" 
                    class="dropdown-item"
                    @click="showUserMenu = false"
                    v-if="authStore.isAuthenticated"
                  >
                    <i class="fas fa-chart-pie mr-2"></i>
                    Portfolio
                  </router-link>
                  <router-link 
                    to="/messages" 
                    class="dropdown-item"
                    @click="showUserMenu = false"
                  >
                    <i class="fas fa-envelope mr-2"></i>
                    Messages
                  </router-link>
                  <router-link 
                    to="/bids" 
                    class="dropdown-item"
                    @click="showUserMenu = false"
                  >
                    <i class="fas fa-gavel mr-2"></i>
                    Bids
                  </router-link>
                  <router-link 
                    to="/referrals" 
                    class="dropdown-item"
                    @click="showUserMenu = false"
                  >
                    <i class="fas fa-users mr-2"></i>
                    Referrals
                  </router-link>
                  <div class="border-t border-gray-100"></div>
                  <button 
                    @click="logout"
                    class="dropdown-item w-full text-left text-red-600 hover:bg-red-50"
                  >
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Auth Buttons -->
            <div v-else class="flex items-center space-x-2">
              <router-link 
                to="/login" 
                class="text-gray-700 hover:text-zed-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </router-link>
              <router-link 
                to="/register" 
                class="btn-primary"
              >
                Sign Up
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="text-gray-700 hover:text-zed-green focus:outline-none focus:text-zed-green"
          >
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Navigation -->
    <div 
      v-if="showMobileMenu"
      class="md:hidden bg-white border-t"
    >
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link 
          to="/" 
          class="mobile-nav-link"
          @click="showMobileMenu = false"
        >
          Home
        </router-link>
        <router-link 
          to="/jobs" 
          class="mobile-nav-link"
          @click="showMobileMenu = false"
        >
          Jobs
        </router-link>
        <router-link 
          to="/trading" 
          class="mobile-nav-link"
          @click="showMobileMenu = false"
          v-if="authStore.isAuthenticated"
        >
          Trade
        </router-link>
        <router-link 
          to="/investments" 
          class="mobile-nav-link"
          @click="showMobileMenu = false"
        >
          Invest
        </router-link>
        <router-link 
          to="/zedforex" 
          class="mobile-nav-link"
          @click="showMobileMenu = false"
          v-if="authStore.isAuthenticated"
        >
          ZedForex
        </router-link>
        <router-link 
          to="/zedinvest" 
          class="mobile-nav-link"
          @click="showMobileMenu = false"
          v-if="authStore.isAuthenticated"
        >
          ZedInvest
        </router-link>
        
        <div v-if="authStore.isAuthenticated" class="border-t border-gray-200 pt-4">
          <div class="flex items-center px-3 py-2">
            <img 
              v-if="authStore.user?.profile?.avatar" 
              :src="authStore.user.profile.avatar" 
              :alt="authStore.fullName"
              class="h-10 w-10 rounded-full object-cover"
            >
            <div 
              v-else
              class="h-10 w-10 rounded-full bg-zed-green flex items-center justify-center text-white font-medium"
            >
              {{ initials }}
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ authStore.fullName }}</div>
              <div class="text-sm text-gray-500">{{ authStore.user?.email }}</div>
            </div>
          </div>
          
          <router-link 
            to="/dashboard" 
            class="mobile-nav-link"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-tachometer-alt mr-2"></i>
            Dashboard
          </router-link>
          <router-link 
            to="/profile" 
            class="mobile-nav-link"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-user mr-2"></i>
            Profile
          </router-link>
          <router-link 
            to="/messages" 
            class="mobile-nav-link"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-envelope mr-2"></i>
            Messages
          </router-link>
          <router-link 
            to="/bids" 
            class="mobile-nav-link"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-gavel mr-2"></i>
            Bids
          </router-link>
          <router-link 
            to="/referrals" 
            class="mobile-nav-link"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-users mr-2"></i>
            Referrals
          </router-link>
          <button 
            @click="logout"
            class="mobile-nav-link w-full text-left text-red-600"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
        
        <div v-else class="border-t border-gray-200 pt-4">
          <router-link 
            to="/login" 
            class="mobile-nav-link"
            @click="showMobileMenu = false"
          >
            Login
          </router-link>
          <router-link 
            to="/register" 
            class="mobile-nav-link bg-zed-green text-white"
            @click="showMobileMenu = false"
          >
            Sign Up
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const showUserMenu = ref(false)
    const showMobileMenu = ref(false)
    
    const initials = computed(() => {
      if (!authStore.user?.profile) return 'U'
      const first = authStore.user.profile.firstName?.[0] || ''
      const last = authStore.user.profile.lastName?.[0] || ''
      return (first + last).toUpperCase()
    })
    
    const logout = async () => {
      await authStore.logout()
      showUserMenu.value = false
      showMobileMenu.value = false
      router.push('/')
    }
    
    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        showUserMenu.value = false
      }
      if (!event.target.closest('nav')) {
        showMobileMenu.value = false
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      authStore,
      showUserMenu,
      showMobileMenu,
      initials,
      logout
    }
  }
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-zed-green px-3 py-2 rounded-md text-sm font-medium transition-colors;
}

.nav-link.active {
  @apply text-zed-green bg-green-50;
}

.mobile-nav-link {
  @apply text-gray-700 hover:text-zed-green hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors;
}

.dropdown-item {
  @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors;
}
</style>