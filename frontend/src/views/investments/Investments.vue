<template>
  <div class="investments-page">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-lg mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">Investment Opportunities</h1>
          <p class="text-green-100">Discover and invest in promising Zambian businesses</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold">K{{ formatCurrency(walletBalance) }}</div>
          <div class="text-green-100 text-sm">Available Balance</div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search investments..."
          class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
        <select v-model="categoryFilter" class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          <option value="">All Categories</option>
          <option value="agriculture">Agriculture</option>
          <option value="technology">Technology</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="retail">Retail</option>
        </select>
        <select v-model="sortBy" class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          <option value="newest">Newest First</option>
          <option value="funding">Funding %</option>
          <option value="return">Expected Return</option>
        </select>
      </div>
    </div>

    <!-- Investments Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="investment in filteredInvestments" 
        :key="investment._id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        @click="viewInvestment(investment._id)"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-3">
            <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              {{ investment.category }}
            </span>
            <span class="text-sm text-gray-500">{{ formatDate(investment.createdAt) }}</span>
          </div>
          
          <h3 class="text-lg font-semibold mb-2">{{ investment.title }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ investment.description.substring(0, 100) }}...</p>
          
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Goal:</span>
              <span class="font-medium">K{{ formatCurrency(investment.funding.goal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Raised:</span>
              <span class="font-medium">K{{ formatCurrency(investment.funding.current) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-green-600 h-2 rounded-full" 
                :style="{ width: `${investment.fundingPercentage}%` }"
              ></div>
            </div>
            <div class="text-center text-xs text-gray-500">
              {{ investment.fundingPercentage.toFixed(1) }}% funded
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <span class="text-gray-500">Expected Return:</span>
              <span class="font-medium text-green-600 ml-1">{{ investment.expectedReturn }}%</span>
            </div>
            <button 
              class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              @click.stop="investNow(investment)"
            >
              Invest Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredInvestments.length === 0" class="text-center py-12">
      <div class="text-gray-500 mb-4">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No investments found</h3>
      <p class="text-gray-500">Try adjusting your filters or check back later for new opportunities.</p>
    </div>

    <!-- Investment Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Invest in {{ selectedInvestment?.title }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedInvestment" class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between text-sm mb-2">
                <span>Available Balance:</span>
                <span class="font-medium">K{{ formatCurrency(walletBalance) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>Expected Return:</span>
                <span class="font-medium text-green-600">{{ selectedInvestment.expectedReturn }}%</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Investment Amount (K)</label>
              <input 
                v-model.number="investmentAmount" 
                type="number" 
                min="1"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter amount"
              >
            </div>

            <div class="flex space-x-3">
              <button 
                @click="closeModal"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                @click="confirmInvestment"
                :disabled="!isValidInvestment || isLoading"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {{ isLoading ? 'Processing...' : 'Confirm Investment' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

// Reactive data
const investments = ref([])
const walletBalance = ref(0)
const isLoading = ref(false)

// Filters
const searchQuery = ref('')
const categoryFilter = ref('')
const sortBy = ref('newest')

// Modal
const showModal = ref(false)
const selectedInvestment = ref(null)
const investmentAmount = ref(0)

// Computed properties
const filteredInvestments = computed(() => {
  let filtered = investments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(investment => 
      investment.title.toLowerCase().includes(query) ||
      investment.description.toLowerCase().includes(query)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(investment => 
      investment.category === categoryFilter.value
    )
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'funding':
        return b.fundingPercentage - a.fundingPercentage
      case 'return':
        return b.expectedReturn - a.expectedReturn
      default:
        return 0
    }
  })

  return filtered
})

const isValidInvestment = computed(() => {
  return selectedInvestment.value && investmentAmount.value > 0 && investmentAmount.value <= walletBalance.value
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchInvestments = async () => {
  try {
    const response = await api.get('/investments')
    investments.value = response.data.data
  } catch (error) {
    console.error('Error fetching investments:', error)
    appStore.showNotification('Error loading investments', 'error')
  }
}

const fetchWalletBalance = async () => {
  try {
    const response = await api.get('/payments/wallet')
    walletBalance.value = response.data.data.balance
  } catch (error) {
    console.error('Error fetching wallet balance:', error)
  }
}

const viewInvestment = (investmentId) => {
  router.push(`/investments/${investmentId}`)
}

const investNow = (investment) => {
  selectedInvestment.value = investment
  investmentAmount.value = 0
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedInvestment.value = null
  investmentAmount.value = 0
}

const confirmInvestment = async () => {
  if (!isValidInvestment.value) return

  isLoading.value = true
  try {
    await api.post(`/investments/${selectedInvestment.value._id}/invest`, {
      amount: investmentAmount.value
    })

    appStore.showNotification('Investment successful!', 'success')
    await Promise.all([fetchInvestments(), fetchWalletBalance()])
    closeModal()
  } catch (error) {
    console.error('Error making investment:', error)
    appStore.showNotification(error.response?.data?.message || 'Error making investment', 'error')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchInvestments(), fetchWalletBalance()])
})
</script>

<style scoped>
.investments-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style> 