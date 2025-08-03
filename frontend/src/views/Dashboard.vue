<template>
  <div class="dashboard">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-lg mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">
            Welcome back, {{ user?.profile?.firstName || 'User' }}! 👋
          </h1>
          <p class="text-green-100">
            Ready to hustle? Check out the latest opportunities below.
          </p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold">K{{ formatCurrency(walletBalance) }}</div>
          <div class="text-green-100 text-sm">Wallet Balance</div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <i class="fas fa-briefcase text-blue-600 text-xl"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm text-gray-600">Active Jobs</p>
            <p class="text-lg font-semibold">{{ stats.jobs || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <i class="fas fa-chart-line text-green-600 text-xl"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm text-gray-600">Portfolio Value</p>
            <p class="text-lg font-semibold">K{{ formatCurrency(portfolioValue) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <i class="fas fa-handshake text-purple-600 text-xl"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm text-gray-600">Investments</p>
            <p class="text-lg font-semibold">{{ stats.investments || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <i class="fas fa-wallet text-orange-600 text-xl"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm text-gray-600">Total Returns</p>
            <p class="text-lg font-semibold" :class="totalReturns >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ totalReturns >= 0 ? '+' : '' }}K{{ formatCurrency(totalReturns) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <router-link 
        to="/jobs" 
        class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <div class="text-center">
          <i class="fas fa-search text-blue-600 text-2xl mb-2"></i>
          <h3 class="font-semibold text-gray-800">Find Jobs</h3>
          <p class="text-sm text-gray-600">Browse available opportunities</p>
        </div>
      </router-link>

      <router-link 
        to="/trading" 
        class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <div class="text-center">
          <i class="fas fa-chart-line text-green-600 text-2xl mb-2"></i>
          <h3 class="font-semibold text-gray-800">Start Trading</h3>
          <p class="text-sm text-gray-600">Practice with virtual money</p>
        </div>
      </router-link>

      <router-link 
        to="/investments" 
        class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <div class="text-center">
          <i class="fas fa-handshake text-purple-600 text-2xl mb-2"></i>
          <h3 class="font-semibold text-gray-800">Invest</h3>
          <p class="text-sm text-gray-600">Fund local businesses</p>
        </div>
      </router-link>

      <router-link 
        to="/profile" 
        class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <div class="text-center">
          <i class="fas fa-user text-orange-600 text-2xl mb-2"></i>
          <h3 class="font-semibold text-gray-800">Profile</h3>
          <p class="text-sm text-gray-600">Manage your account</p>
        </div>
      </router-link>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Jobs -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-800">Recent Job Applications</h3>
        </div>
        <div class="p-4">
          <div v-if="recentJobs.length === 0" class="text-center py-8 text-gray-500">
            <i class="fas fa-briefcase text-4xl mb-4"></i>
            <p>No recent job applications</p>
            <router-link to="/jobs" class="text-green-600 hover:text-green-700 mt-2 inline-block">
              Browse jobs
            </router-link>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="job in recentJobs" 
              :key="job._id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <h4 class="font-medium text-gray-800">{{ job.title }}</h4>
                <p class="text-sm text-gray-600">{{ job.company }}</p>
              </div>
              <span class="text-xs px-2 py-1 rounded-full" 
                    :class="getStatusClass(job.status)">
                {{ job.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Trades -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-800">Recent Trades</h3>
        </div>
        <div class="p-4">
          <div v-if="recentTrades.length === 0" class="text-center py-8 text-gray-500">
            <i class="fas fa-chart-line text-4xl mb-4"></i>
            <p>No recent trades</p>
            <router-link to="/trading" class="text-green-600 hover:text-green-700 mt-2 inline-block">
              Start trading
            </router-link>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="trade in recentTrades" 
              :key="trade._id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <h4 class="font-medium text-gray-800">{{ trade.symbol }}</h4>
                <p class="text-sm text-gray-600">{{ trade.type }} {{ trade.quantity }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-800">K{{ formatCurrency(trade.total) }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(trade.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Investments -->
    <div class="mt-6">
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-800">Featured Investments</h3>
        </div>
        <div class="p-4">
          <div v-if="featuredInvestments.length === 0" class="text-center py-8 text-gray-500">
            <i class="fas fa-handshake text-4xl mb-4"></i>
            <p>No featured investments available</p>
            <router-link to="/investments" class="text-green-600 hover:text-green-700 mt-2 inline-block">
              Browse investments
            </router-link>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="investment in featuredInvestments" 
              :key="investment._id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              @click="$router.push(`/investments/${investment._id}`)"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-800">{{ investment.businessName }}</h4>
                <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {{ investment.category }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ investment.description }}</p>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Goal: K{{ formatCurrency(investment.funding.goal) }}</span>
                <span class="font-medium text-green-600">{{ investment.fundingPercentage?.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  class="bg-green-600 h-2 rounded-full" 
                  :style="{ width: `${Math.min(investment.fundingPercentage || 0, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { api } from '@/services/api'

export default {
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()
    const appStore = useAppStore()

    const stats = ref({
      jobs: 0,
      investments: 0
    })

    const recentJobs = ref([])
    const recentTrades = ref([])
    const featuredInvestments = ref([])
    const portfolioValue = ref(100000)
    const totalReturns = ref(0)

    const user = computed(() => authStore.user)
    const walletBalance = computed(() => user.value?.wallet?.balance || 0)

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-ZM').format(value || 0)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-ZM', {
        month: 'short',
        day: 'numeric'
      })
    }

    const getStatusClass = (status) => {
      const classes = {
        'applied': 'bg-blue-100 text-blue-800',
        'shortlisted': 'bg-yellow-100 text-yellow-800',
        'hired': 'bg-green-100 text-green-800',
        'rejected': 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const fetchDashboardData = async () => {
      try {
        appStore.setLoading(true)
        
        // Fetch featured investments
        const investmentsResponse = await api.get('/investments/featured')
        featuredInvestments.value = investmentsResponse.data.data || []

        // Fetch portfolio data
        const portfolioResponse = await api.get('/trading/portfolio')
        if (portfolioResponse.data.success) {
          const portfolio = portfolioResponse.data.data
          portfolioValue.value = portfolio.totalValue || 100000
          totalReturns.value = portfolio.totalReturn || 0
        }

        // Fetch recent trades
        const tradesResponse = await api.get('/trading/history?limit=5')
        if (tradesResponse.data.success) {
          recentTrades.value = tradesResponse.data.data.transactions || []
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        appStore.showNotification('error', 'Error loading dashboard data')
      } finally {
        appStore.setLoading(false)
      }
    }

    onMounted(() => {
      fetchDashboardData()
    })

    return {
      user,
      walletBalance,
      portfolioValue,
      totalReturns,
      stats,
      recentJobs,
      recentTrades,
      featuredInvestments,
      formatCurrency,
      formatDate,
      getStatusClass
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