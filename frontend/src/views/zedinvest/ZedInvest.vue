<template>
  <div class="zedinvest-container">
    <div class="header bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg mb-6">
      <h1 class="text-3xl font-bold mb-2">ZedInvest</h1>
      <p class="text-green-100">Tokenized micro-investments in Zambian businesses</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Total Invested</h3>
        <div class="text-3xl font-bold text-blue-600">K{{ formatNumber(totalInvested) }}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Total Returns</h3>
        <div class="text-3xl font-bold text-green-600">K{{ formatNumber(totalReturns) }}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Active Investments</h3>
        <div class="text-3xl font-bold text-purple-600">{{ activeInvestments }}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Available Balance</h3>
        <div class="text-3xl font-bold text-orange-600">K{{ formatNumber(availableBalance) }}</div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Featured Opportunities</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="business in featuredBusinesses" :key="business._id" class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-2">{{ business.name }}</h3>
          <p class="text-gray-600 mb-4">{{ business.description }}</p>
          <div class="text-lg font-bold text-green-600 mb-4">{{ business.expectedReturn }}% return</div>
          <button @click="invest(business)" class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            Invest Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

export default {
  name: 'ZedInvest',
  setup() {
    const featuredBusinesses = ref([])
    const totalInvested = ref(0)
    const totalReturns = ref(0)
    const activeInvestments = ref(0)
    const availableBalance = ref(0)
    
    const loadData = async () => {
      try {
        const [businesses, portfolio] = await Promise.all([
          api.get('/zedinvest/businesses/featured'),
          api.get('/zedinvest/portfolio')
        ])
        featuredBusinesses.value = businesses.data.data
        const data = portfolio.data.data
        totalInvested.value = data.totalInvested || 0
        totalReturns.value = data.totalReturns || 0
        activeInvestments.value = data.activeInvestments || 0
        availableBalance.value = data.balance || 0
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    
    const invest = (business) => {
      alert(`Investing in ${business.name}`)
    }
    
    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num || 0)
    }
    
    onMounted(loadData)
    
    return {
      featuredBusinesses,
      totalInvested,
      totalReturns,
      activeInvestments,
      availableBalance,
      invest,
      formatNumber
    }
  }
}
</script>

<style scoped>
.zedinvest-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style> 