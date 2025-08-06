<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="gradient-bg pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 animate-float">
            Welcome to ZedHustle
          </h1>
          <h2 class="text-2xl md:text-3xl font-semibold text-white mb-4">
            Zambia's Ultimate Money-Making Platform!
          </h2>
          <p class="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
            Your all-in-one Zambian financial empowerment app — built for hustlers, traders, freelancers, investors, and job seekers. Whether you're in Lusaka or Kitwe, online or on the ground, ZedHustle connects you to real ways to make, grow, and manage your money.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              :to="authStore.isAuthenticated ? '/dashboard' : '/register'"
              class="bg-white text-zed-green px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {{ authStore.isAuthenticated ? 'Go to Dashboard' : 'Get Started Today' }}
            </router-link>
            <button 
              @click="scrollToSection('features')"
              class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-zed-green transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
        
        <!-- Hero Stats -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="text-white">
            <div class="text-3xl font-bold">{{ stats.users }}+</div>
            <div class="text-sm opacity-90">Active Users</div>
          </div>
          <div class="text-white">
            <div class="text-3xl font-bold">K{{ stats.volume }}+</div>
            <div class="text-sm opacity-90">Traded Volume</div>
          </div>
          <div class="text-white">
            <div class="text-3xl font-bold">{{ stats.jobs }}+</div>
            <div class="text-sm opacity-90">Job Listings</div>
          </div>
          <div class="text-white">
            <div class="text-3xl font-bold">K{{ stats.investments }}+</div>
            <div class="text-sm opacity-90">Investments</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Make Money in Zambia
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            From finding your dream job to building wealth through trading and investments, ZedHustle has you covered.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Jobs Feature -->
          <div class="card-hover p-6 text-center">
            <div class="bg-zed-orange text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-briefcase text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Find Jobs</h3>
            <p class="text-gray-600 mb-4">Browse thousands of job opportunities across Zambia. From remote work to on-site positions.</p>
            <router-link to="/jobs" class="btn-primary">
              Browse Jobs
            </router-link>
          </div>

          <!-- Trading Feature -->
          <div class="card-hover p-6 text-center">
            <div class="bg-zed-blue text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-chart-line text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Virtual Trading</h3>
            <p class="text-gray-600 mb-4">Learn forex and commodity trading with virtual money. Practice before investing real cash.</p>
            <router-link 
              :to="authStore.isAuthenticated ? '/trading' : '/register'"
              class="btn-primary"
            >
              Start Trading
            </router-link>
          </div>

          <!-- Investment Feature -->
          <div class="card-hover p-6 text-center">
            <div class="bg-zed-green text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-building text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Invest Locally</h3>
            <p class="text-gray-600 mb-4">Support growing Zambian businesses and earn returns while building your community.</p>
            <router-link to="/investments" class="btn-primary">
              View Opportunities
            </router-link>
          </div>

          <!-- Payment Feature -->
          <div class="card-hover p-6 text-center">
            <div class="bg-zed-gold text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-mobile-alt text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Easy Payments</h3>
            <p class="text-gray-600 mb-4">Secure payments with Airtel Money, MTN Mobile Money, and local banking integration.</p>
            <router-link 
              :to="authStore.isAuthenticated ? '/dashboard' : '/register'"
              class="btn-primary"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Jobs Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Latest Job Opportunities</h2>
            <p class="text-gray-600">Fresh opportunities posted by Zambian employers</p>
          </div>
          <router-link to="/jobs" class="btn-outline">
            View All Jobs
          </router-link>
        </div>

        <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="card p-6">
            <div class="skeleton h-4 w-3/4 mb-2"></div>
            <div class="skeleton h-3 w-1/2 mb-4"></div>
            <div class="skeleton h-3 w-full mb-2"></div>
            <div class="skeleton h-3 w-2/3"></div>
          </div>
        </div>

        <div v-else-if="recentJobs.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="job in recentJobs" 
            :key="job._id"
            class="card-hover p-6"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ job.title }}</h3>
              <span class="badge-success">{{ job.type }}</span>
            </div>
            <p class="text-gray-600 mb-2">{{ job.company }}</p>
            <p class="text-sm text-gray-500 mb-3">
              <i class="fas fa-map-marker-alt mr-1"></i>
              {{ job.location }}
            </p>
            <p class="text-zed-green font-semibold mb-4">
              K{{ job.salary.min.toLocaleString() }} - K{{ job.salary.max.toLocaleString() }}/{{ job.salary.period }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">{{ formatDate(job.datePosted) }}</span>
              <router-link 
                :to="`/jobs/${job._id}`"
                class="btn-primary btn-sm"
              >
                View Details
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <i class="fas fa-briefcase text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500">No jobs available at the moment. Check back soon!</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 gradient-bg">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Financial Journey?
        </h2>
        <p class="text-xl text-white mb-8 opacity-90">
          Join thousands of Zambians who are already making money, growing their investments, and building their careers with ZedHustle.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            :to="authStore.isAuthenticated ? '/dashboard' : '/register'"
            class="bg-white text-zed-green px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <i class="fas fa-rocket mr-2"></i>
            {{ authStore.isAuthenticated ? 'Go to Dashboard' : 'Get Started Free' }}
          </router-link>
          <router-link 
            to="/jobs"
            class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-zed-green transition-colors"
          >
            <i class="fas fa-search mr-2"></i>
            Browse Jobs
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { apiService } from '@/services/api'
import { formatDistanceToNow } from 'date-fns'

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    const recentJobs = ref([])
    const loading = ref(true)
    const stats = ref({
      users: 1000,
      volume: '500K',
      jobs: 200,
      investments: '2M'
    })

    const fetchRecentJobs = async () => {
      try {
        loading.value = true
        const response = await apiService.jobs.getAll({ 
          limit: 6, 
          sort: 'datePosted',
          background: true 
        })
        recentJobs.value = response.data.data.jobs
      } catch (error) {
        console.error('Failed to fetch recent jobs:', error)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    }

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    onMounted(() => {
      fetchRecentJobs()
    })

    return {
      authStore,
      recentJobs,
      loading,
      stats,
      formatDate,
      scrollToSection
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>