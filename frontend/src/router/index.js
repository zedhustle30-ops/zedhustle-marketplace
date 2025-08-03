import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import views
import Home from '@/views/Home.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import Jobs from '@/views/jobs/Jobs.vue'
import JobDetail from '@/views/jobs/JobDetail.vue'
import PostJob from '@/views/jobs/PostJob.vue'
import MyJobs from '@/views/jobs/MyJobs.vue'
import Trading from '@/views/trading/Trading.vue'
import Portfolio from '@/views/trading/Portfolio.vue'
import Investments from '@/views/investments/Investments.vue'
import InvestmentDetail from '@/views/investments/InvestmentDetail.vue'
import CreateInvestment from '@/views/investments/CreateInvestment.vue'
import ZedForex from '@/views/zedforex/ZedForex.vue'
import ZedInvest from '@/views/zedinvest/ZedInvest.vue'
import Messages from '@/views/messages/Messages.vue'
import Bids from '@/views/bids/Bids.vue'
import Referrals from '@/views/referrals/Referrals.vue'
import Profile from '@/views/Profile.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { 
      title: 'ZedHustle - Zambia\'s Ultimate Money-Making Platform',
      public: true 
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      title: 'Login - ZedHustle',
      public: true,
      guestOnly: true 
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { 
      title: 'Register - ZedHustle',
      public: true,
      guestOnly: true 
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      title: 'Dashboard - ZedHustle',
      requiresAuth: true 
    }
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: Jobs,
    meta: { 
      title: 'Jobs - ZedHustle',
      public: true 
    }
  },
  {
    path: '/jobs/:id',
    name: 'JobDetail',
    component: JobDetail,
    meta: { 
      title: 'Job Details - ZedHustle',
      public: true 
    }
  },
  {
    path: '/jobs/post',
    name: 'PostJob',
    component: PostJob,
    meta: { 
      title: 'Post Job - ZedHustle',
      requiresAuth: true,
      roles: ['employer', 'admin']
    }
  },
  {
    path: '/my-jobs',
    name: 'MyJobs',
    component: MyJobs,
    meta: { 
      title: 'My Jobs - ZedHustle',
      requiresAuth: true 
    }
  },
  {
    path: '/trading',
    name: 'Trading',
    component: Trading,
    meta: { 
      title: 'Trading - ZedHustle',
      requiresAuth: true 
    }
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: Portfolio,
    meta: { 
      title: 'Portfolio - ZedHustle',
      requiresAuth: true 
    }
  },
  {
    path: '/investments',
    name: 'Investments',
    component: Investments,
    meta: { 
      title: 'Investments - ZedHustle',
      public: true 
    }
  },
  {
    path: '/investments/:id',
    name: 'InvestmentDetail',
    component: InvestmentDetail,
    meta: { 
      title: 'Investment Details - ZedHustle',
      public: true 
    }
  },
  {
    path: '/investments/create',
    name: 'CreateInvestment',
    component: CreateInvestment,
    meta: { 
      title: 'Create Investment - ZedHustle',
      requiresAuth: true,
      roles: ['business_owner', 'admin']
    }
  },
  {
    path: '/zedforex',
    name: 'ZedForex',
    component: ZedForex,
    meta: { 
      title: 'ZedForex Trading - ZedHustle',
      requiresAuth: true 
    }
  },
  {
    path: '/zedinvest',
    name: 'ZedInvest',
    component: ZedInvest,
    meta: { 
      title: 'ZedInvest - ZedHustle',
      requiresAuth: true 
    }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages,
    meta: { 
      title: 'Messages - ZedHustle',
      requiresAuth: true 
    }
  },
  {
    path: '/bids',
    name: 'Bids',
    component: Bids,
    meta: { 
      title: 'Bidding System - ZedHustle',
      requiresAuth: true 
    }
  },
  {
    path: '/referrals',
    name: 'Referrals',
    component: Referrals,
    meta: { 
      title: 'Referral System - ZedHustle',
      requiresAuth: true 
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { 
      title: 'Profile - ZedHustle',
      requiresAuth: true 
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { 
      title: 'Page Not Found - ZedHustle',
      public: true 
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Set page title
  document.title = to.meta.title || 'ZedHustle'
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Try to restore authentication from localStorage
      await authStore.initializeAuth()
      
      if (!authStore.isAuthenticated) {
        next({
          name: 'Login',
          query: { redirect: to.fullPath }
        })
        return
      }
    }
    
    // Check role-based access
    if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
      next({ name: 'Dashboard' })
      return
    }
  }
  
  // Redirect authenticated users away from guest-only pages
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }
  
  next()
})

// After navigation
router.afterEach((to, from) => {
  // Analytics tracking could go here
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: to.path,
    })
  }
})

export default router