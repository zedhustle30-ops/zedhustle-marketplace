<template>
  <div class="trading-page">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">Virtual Trading Platform</h1>
          <p class="text-blue-100">Practice trading with virtual money, no risk involved</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold">K{{ formatCurrency(portfolio?.balance || 0) }}</div>
          <div class="text-blue-100 text-sm">Virtual Balance</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Market Data -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Market Data</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2">Symbol</th>
                  <th class="text-left py-2">Price</th>
                  <th class="text-left py-2">Change</th>
                  <th class="text-left py-2">Change %</th>
                  <th class="text-left py-2">Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="stock in marketData" :key="stock.symbol" class="border-b hover:bg-gray-50">
                  <td class="py-3 font-medium">{{ stock.symbol }}</td>
                  <td class="py-3">${{ stock.price.toFixed(2) }}</td>
                  <td class="py-3" :class="stock.change >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}
                  </td>
                  <td class="py-3" :class="stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%
                  </td>
                  <td class="py-3">{{ stock.volume.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Trading Interface -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Place Trade</h2>
          <form @submit.prevent="placeTrade" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
              <select v-model="tradeForm.symbol" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select a stock</option>
                <option v-for="stock in marketData" :key="stock.symbol" :value="stock.symbol">
                  {{ stock.symbol }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select v-model="tradeForm.action" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select action</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input 
                v-model.number="tradeForm.quantity" 
                type="number" 
                min="1"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Number of shares"
              >
            </div>

            <div v-if="selectedStock">
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex justify-between text-sm">
                  <span>Price per share:</span>
                  <span class="font-medium">${{ selectedStock.price.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span>Total value:</span>
                  <span class="font-medium">${{ (selectedStock.price * tradeForm.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              :disabled="!isTradeFormValid || isLoading"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Processing...' : 'Place Trade' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Portfolio Overview -->
    <div class="mt-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Portfolio Overview</h2>
        
        <div v-if="portfolio?.positions && portfolio.positions.length > 0" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-sm text-blue-600">Total Value</div>
              <div class="text-2xl font-bold text-blue-800">${{ formatCurrency(portfolio.totalValue || 0) }}</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-sm text-green-600">Total P&L</div>
              <div class="text-2xl font-bold" :class="portfolio.totalPnL >= 0 ? 'text-green-800' : 'text-red-800'">
                ${{ formatCurrency(portfolio.totalPnL || 0) }}
              </div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="text-sm text-purple-600">Cash Balance</div>
              <div class="text-2xl font-bold text-purple-800">${{ formatCurrency(portfolio.balance || 0) }}</div>
            </div>
            <div class="bg-orange-50 p-4 rounded-lg">
              <div class="text-sm text-orange-600">Positions</div>
              <div class="text-2xl font-bold text-orange-800">{{ portfolio.positions.length }}</div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2">Symbol</th>
                  <th class="text-left py-2">Shares</th>
                  <th class="text-left py-2">Avg Price</th>
                  <th class="text-left py-2">Current Price</th>
                  <th class="text-left py-2">Market Value</th>
                  <th class="text-left py-2">P&L</th>
                  <th class="text-left py-2">P&L %</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="position in portfolio.positions" :key="position.symbol" class="border-b hover:bg-gray-50">
                  <td class="py-3 font-medium">{{ position.symbol }}</td>
                  <td class="py-3">{{ position.quantity }}</td>
                  <td class="py-3">${{ position.averagePrice.toFixed(2) }}</td>
                  <td class="py-3">${{ getCurrentPrice(position.symbol).toFixed(2) }}</td>
                  <td class="py-3">${{ (position.quantity * getCurrentPrice(position.symbol)).toFixed(2) }}</td>
                  <td class="py-3" :class="getPositionPnL(position) >= 0 ? 'text-green-600' : 'text-red-600'">
                    ${{ getPositionPnL(position).toFixed(2) }}
                  </td>
                  <td class="py-3" :class="getPositionPnLPercent(position) >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ getPositionPnLPercent(position).toFixed(2) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="text-gray-500 mb-4">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No positions yet</h3>
          <p class="text-gray-500">Start trading to build your portfolio!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import api from '@/services/api'

const authStore = useAuthStore()
const appStore = useAppStore()

// Reactive data
const marketData = ref([])
const portfolio = ref(null)
const isLoading = ref(false)

// Trade form
const tradeForm = ref({
  symbol: '',
  action: '',
  quantity: 1
})

// Computed properties
const selectedStock = computed(() => {
  return marketData.value.find(stock => stock.symbol === tradeForm.value.symbol)
})

const isTradeFormValid = computed(() => {
  return tradeForm.value.symbol && 
         tradeForm.value.action && 
         tradeForm.value.quantity > 0
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const getCurrentPrice = (symbol) => {
  const stock = marketData.value.find(s => s.symbol === symbol)
  return stock ? stock.price : 0
}

const getPositionPnL = (position) => {
  const currentPrice = getCurrentPrice(position.symbol)
  const marketValue = position.quantity * currentPrice
  const costBasis = position.quantity * position.averagePrice
  return marketValue - costBasis
}

const getPositionPnLPercent = (position) => {
  const pnl = getPositionPnL(position)
  const costBasis = position.quantity * position.averagePrice
  return costBasis > 0 ? (pnl / costBasis) * 100 : 0
}

const fetchMarketData = async () => {
  try {
    const response = await api.get('/trading/market-data')
    marketData.value = response.data.data
  } catch (error) {
    console.error('Error fetching market data:', error)
    appStore.showNotification('Error loading market data', 'error')
  }
}

const fetchPortfolio = async () => {
  try {
    const response = await api.get('/trading/portfolio')
    portfolio.value = response.data.data
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    appStore.showNotification('Error loading portfolio', 'error')
  }
}

const placeTrade = async () => {
  if (!isTradeFormValid.value) return

  isLoading.value = true
  try {
    const response = await api.post('/trading/trade', {
      symbol: tradeForm.value.symbol,
      action: tradeForm.value.action,
      quantity: tradeForm.value.quantity
    })

    appStore.showNotification('Trade placed successfully!', 'success')
    
    // Reset form
    tradeForm.value = {
      symbol: '',
      action: '',
      quantity: 1
    }

    // Refresh data
    await Promise.all([fetchPortfolio(), fetchMarketData()])
  } catch (error) {
    console.error('Error placing trade:', error)
    appStore.showNotification(error.response?.data?.message || 'Error placing trade', 'error')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchMarketData(), fetchPortfolio()])
})
</script>

<style scoped>
.trading-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style> 