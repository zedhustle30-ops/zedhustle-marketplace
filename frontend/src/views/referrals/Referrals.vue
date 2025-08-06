<template>
  <div class="referrals-container">
    <div class="header bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg mb-6">
      <h1 class="text-3xl font-bold mb-2">Referral System</h1>
      <p class="text-indigo-100">Earn K5 for every successful referral</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Total Referrals</h3>
        <div class="text-3xl font-bold text-indigo-600">{{ totalReferrals }}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Total Earnings</h3>
        <div class="text-3xl font-bold text-green-600">K{{ formatNumber(totalEarnings) }}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Pending Referrals</h3>
        <div class="text-3xl font-bold text-orange-600">{{ pendingReferrals }}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Referral Code</h3>
        <div class="text-lg font-mono text-indigo-600 mb-2">{{ referralCode }}</div>
        <button @click="copyCode" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Copy Code
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4">Your Referral Link</h2>
      <div class="flex gap-2">
        <input :value="referralLink" readonly class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50" />
        <button @click="copyLink" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Copy Link
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6 border-b">
        <h2 class="text-2xl font-bold">Referral History</h2>
      </div>
      <div class="p-6">
        <div v-for="referral in referrals" :key="referral._id" class="border-b py-4 last:border-b-0">
          <div class="flex justify-between items-center">
            <div>
              <div class="font-medium">{{ referral.referredUser.name }}</div>
              <div class="text-sm text-gray-500">{{ formatDate(referral.date) }}</div>
            </div>
            <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(referral.status)">
              {{ referral.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

export default {
  name: 'Referrals',
  setup() {
    const totalReferrals = ref(0)
    const totalEarnings = ref(0)
    const pendingReferrals = ref(0)
    const referralCode = ref('')
    const referrals = ref([])
    
    const referralLink = computed(() => {
      return `${window.location.origin}/register?ref=${referralCode.value}`
    })
    
    const loadData = async () => {
      try {
        const [info, history] = await Promise.all([
          api.get('/referrals/info'),
          api.get('/referrals/history')
        ])
        
        const data = info.data.data
        totalReferrals.value = data.totalReferrals || 0
        totalEarnings.value = data.totalEarnings || 0
        pendingReferrals.value = data.pendingReferrals || 0
        referralCode.value = data.referralCode || ''
        
        referrals.value = history.data.data
      } catch (error) {
        console.error('Error loading referral data:', error)
      }
    }
    
    const copyCode = () => {
      navigator.clipboard.writeText(referralCode.value)
      alert('Referral code copied!')
    }
    
    const copyLink = () => {
      navigator.clipboard.writeText(referralLink.value)
      alert('Referral link copied!')
    }
    
    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num || 0)
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }
    
    const getStatusClass = (status) => {
      const classes = {
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        failed: 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }
    
    onMounted(loadData)
    
    return {
      totalReferrals,
      totalEarnings,
      pendingReferrals,
      referralCode,
      referrals,
      referralLink,
      copyCode,
      copyLink,
      formatNumber,
      formatDate,
      getStatusClass
    }
  }
}
</script>

<style scoped>
.referrals-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style> 