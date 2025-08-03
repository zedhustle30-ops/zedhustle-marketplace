<template>
  <div class="zedforex-container">
    <!-- Header -->
    <div class="header bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
      <h1 class="text-3xl font-bold mb-2">ZedForex Trading</h1>
      <p class="text-blue-100">Trade Zambian commodity-backed tokens</p>
    </div>

    <!-- Market Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Portfolio Value</h3>
        <div class="text-3xl font-bold text-green-600">
          K{{ formatNumber(portfolioValue) }}
        </div>
        <div class="text-sm text-gray-500 mt-2">
          {{ portfolioChange >= 0 ? '+' : '' }}{{ portfolioChange }}% today
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Available Balance</h3>
        <div class="text-3xl font-bold text-blue-600">
          K{{ formatNumber(availableBalance) }}
        </div>
        <button 
          @click="showWithdrawModal = true"
          class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Withdraw
        </button>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Total Profit</h3>
        <div class="text-3xl font-bold" :class="totalProfit >= 0 ? 'text-green-600' : 'text-red-600'">
          K{{ formatNumber(totalProfit) }}
        </div>
        <div class="text-sm text-gray-500 mt-2">
          {{ profitPercentage }}% return
        </div>
      </div>
    </div>

    <!-- Featured Tokens -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Featured Tokens</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="token in featuredTokens" 
          :key="token._id"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          @click="selectToken(token)"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold">{{ token.symbol }}</h3>
              <p class="text-gray-600">{{ token.name }}</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold">K{{ formatNumber(token.currentPrice) }}</div>
              <div 
                class="text-sm"
                :class="token.priceChange >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ token.priceChange >= 0 ? '+' : '' }}{{ formatNumber(token.priceChange) }}%
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Volume:</span>
              <div class="font-semibold">K{{ formatNumber(token.volume24h) }}</div>
            </div>
            <div>
              <span class="text-gray-500">Market Cap:</span>
              <div class="font-semibold">K{{ formatNumber(token.marketCap) }}</div>
            </div>
          </div>

          <div class="mt-4 flex gap-2">
            <button 
              @click.stop="showTradeModal(token, 'buy')"
              class="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Buy
            </button>
            <button 
              @click.stop="showTradeModal(token, 'sell')"
              class="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- All Tokens Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-6 border-b">
        <h2 class="text-2xl font-bold">All Tokens</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="token in allTokens" 
              :key="token._id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {{ token.symbol.charAt(0) }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ token.symbol }}</div>
                    <div class="text-sm text-gray-500">{{ token.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">K{{ formatNumber(token.currentPrice) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div 
                  class="text-sm"
                  :class="token.priceChange >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ token.priceChange >= 0 ? '+' : '' }}{{ formatNumber(token.priceChange) }}%
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">K{{ formatNumber(token.volume24h) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">K{{ formatNumber(token.marketCap) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="showTradeModal(token, 'buy')"
                  class="text-green-600 hover:text-green-900 mr-3"
                >
                  Buy
                </button>
                <button 
                  @click="showTradeModal(token, 'sell')"
                  class="text-red-600 hover:text-red-900"
                >
                  Sell
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Trade Modal -->
    <div v-if="showTradeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">
            {{ tradeAction === 'buy' ? 'Buy' : 'Sell' }} {{ selectedToken?.symbol }}
          </h3>
          <button @click="closeTradeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <input 
            v-model="tradeQuantity"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quantity"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Price per token</label>
          <div class="text-lg font-semibold">K{{ formatNumber(selectedToken?.currentPrice) }}</div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Total Value</label>
          <div class="text-xl font-bold text-blue-600">
            K{{ formatNumber(tradeTotal) }}
          </div>
        </div>

        <div class="flex gap-3">
          <button 
            @click="executeTrade"
            :disabled="!tradeQuantity || tradeQuantity <= 0"
            class="flex-1 py-2 px-4 rounded-md text-white font-medium disabled:opacity-50"
            :class="tradeAction === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
          >
            {{ tradeAction === 'buy' ? 'Buy' : 'Sell' }} Tokens
          </button>
          <button 
            @click="closeTradeModal"
            class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Withdraw Modal -->
    <div v-if="showWithdrawModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Withdraw to Wallet</h3>
          <button @click="showWithdrawModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Amount (K)</label>
          <input 
            v-model="withdrawAmount"
            type="number"
            min="1"
            :max="availableBalance"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
          />
          <div class="text-sm text-gray-500 mt-1">
            Available: K{{ formatNumber(availableBalance) }}
          </div>
        </div>

        <div class="flex gap-3">
          <button 
            @click="executeWithdraw"
            :disabled="!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > availableBalance"
            class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Withdraw
          </button>
          <button 
            @click="showWithdrawModal = false"
            class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

export default {
  name: 'ZedForex',
  setup() {
    const authStore = useAuthStore()
    
    // Reactive data
    const featuredTokens = ref([])
    const allTokens = ref([])
    const portfolioValue = ref(0)
    const availableBalance = ref(0)
    const totalProfit = ref(0)
    const portfolioChange = ref(0)
    const profitPercentage = ref(0)
    
    // Modal states
    const showTradeModal = ref(false)
    const showWithdrawModal = ref(false)
    const selectedToken = ref(null)
    const tradeAction = ref('buy')
    const tradeQuantity = ref('')
    const withdrawAmount = ref('')
    
    // Computed
    const tradeTotal = computed(() => {
      if (!selectedToken.value || !tradeQuantity.value) return 0
      return selectedToken.value.currentPrice * parseFloat(tradeQuantity.value)
    })
    
    // Methods
    const loadTokens = async () => {
      try {
        const [featuredResponse, allResponse] = await Promise.all([
          api.get('/zedforex/tokens/featured'),
          api.get('/zedforex/tokens')
        ])
        
        featuredTokens.value = featuredResponse.data.data
        allTokens.value = allResponse.data.data
      } catch (error) {
        console.error('Error loading tokens:', error)
      }
    }
    
    const loadPortfolio = async () => {
      try {
        const response = await api.get('/zedforex/portfolio')
        const portfolio = response.data.data
        
        availableBalance.value = portfolio.balance || 0
        
        // Calculate portfolio value and profit
        let totalValue = availableBalance.value
        let totalCost = 0
        
        for (const position of portfolio.positions || []) {
          const token = allTokens.value.find(t => t._id === position.token._id)
          if (token) {
            const positionValue = position.quantity * token.currentPrice
            totalValue += positionValue
            totalCost += position.quantity * position.averagePrice
          }
        }
        
        portfolioValue.value = totalValue
        totalProfit.value = totalValue - totalCost
        profitPercentage.value = totalCost > 0 ? (totalProfit.value / totalCost) * 100 : 0
      } catch (error) {
        console.error('Error loading portfolio:', error)
      }
    }
    
    const selectToken = (token) => {
      selectedToken.value = token
      showTradeModal.value = true
    }
    
    const showTradeModal = (token, action) => {
      selectedToken.value = token
      tradeAction.value = action
      tradeQuantity.value = ''
      showTradeModal.value = true
    }
    
    const closeTradeModal = () => {
      showTradeModal.value = false
      selectedToken.value = null
      tradeQuantity.value = ''
    }
    
    const executeTrade = async () => {
      try {
        const response = await api.post('/zedforex/trade', {
          symbol: selectedToken.value.symbol,
          action: tradeAction.value,
          quantity: parseFloat(tradeQuantity.value),
          price: selectedToken.value.currentPrice
        })
        
        if (response.data.success) {
          closeTradeModal()
          await loadPortfolio()
          await loadTokens() // Refresh token data
        }
      } catch (error) {
        console.error('Error executing trade:', error)
      }
    }
    
    const executeWithdraw = async () => {
      try {
        const response = await api.post('/zedforex/withdraw', {
          amount: parseFloat(withdrawAmount.value)
        })
        
        if (response.data.success) {
          showWithdrawModal.value = false
          withdrawAmount.value = ''
          await loadPortfolio()
        }
      } catch (error) {
        console.error('Error executing withdrawal:', error)
      }
    }
    
    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num || 0)
    }
    
    // Lifecycle
    onMounted(async () => {
      await loadTokens()
      await loadPortfolio()
    })
    
    return {
      featuredTokens,
      allTokens,
      portfolioValue,
      availableBalance,
      totalProfit,
      portfolioChange,
      profitPercentage,
      showTradeModal,
      showWithdrawModal,
      selectedToken,
      tradeAction,
      tradeQuantity,
      withdrawAmount,
      tradeTotal,
      selectToken,
      showTradeModal,
      closeTradeModal,
      executeTrade,
      executeWithdraw,
      formatNumber
    }
  }
}
</script>

<style scoped>
.zedforex-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style> 