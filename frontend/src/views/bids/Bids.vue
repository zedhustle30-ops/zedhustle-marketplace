<template>
  <div class="bids-container">
    <div class="header bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg mb-6">
      <h1 class="text-3xl font-bold mb-2">Bidding System</h1>
      <p class="text-orange-100">Manage your bids for job applications</p>
    </div>

    <!-- Bid Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Available Bids</h3>
        <div class="text-3xl font-bold text-green-600">{{ availableBids }}</div>
        <div class="text-sm text-gray-500 mt-2">Ready to use</div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Used Bids</h3>
        <div class="text-3xl font-bold text-blue-600">{{ usedBids }}</div>
        <div class="text-sm text-gray-500 mt-2">This month</div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Purchased Bids</h3>
        <div class="text-3xl font-bold text-purple-600">{{ purchasedBids }}</div>
        <div class="text-sm text-gray-500 mt-2">Total purchased</div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Premium Plan</h3>
        <div class="text-3xl font-bold text-orange-600">{{ premiumPlan || 'None' }}</div>
        <button 
          @click="showUpgradeModal = true"
          class="mt-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Upgrade
        </button>
      </div>
    </div>

    <!-- Purchase Bids -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4">Purchase Bids</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="package in bidPackages" 
          :key="package.id"
          class="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
          :class="{ 'border-orange-500 bg-orange-50': selectedPackage === package.id }"
          @click="selectPackage(package.id)"
        >
          <div class="text-2xl font-bold text-orange-600 mb-2">{{ package.bids }} Bids</div>
          <div class="text-3xl font-bold mb-4">K{{ package.price }}</div>
          <div class="text-sm text-gray-600 mb-4">{{ package.description }}</div>
          <button 
            @click.stop="purchaseBids(package)"
            class="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>

    <!-- Bid History -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6 border-b">
        <h2 class="text-2xl font-bold">Bid History</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bids</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in bidHistory" :key="record._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(record.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 capitalize">{{ record.type }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ record.bids }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ record.jobTitle || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': record.status === 'success',
                    'bg-red-100 text-red-800': record.status === 'failed',
                    'bg-yellow-100 text-yellow-800': record.status === 'pending'
                  }"
                >
                  {{ record.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <div v-if="showUpgradeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Upgrade to Premium</h3>
          <button @click="showUpgradeModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="border rounded-lg p-4">
            <h4 class="font-semibold text-lg mb-2">K50 Plan</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• 150 bids per month</li>
              <li>• Priority job applications</li>
              <li>• Basic AI assistant</li>
            </ul>
            <button @click="upgradePlan('K50')" class="w-full mt-3 bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700">
              Upgrade to K50
            </button>
          </div>

          <div class="border rounded-lg p-4">
            <h4 class="font-semibold text-lg mb-2">K100 Plan</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• 300 bids per month</li>
              <li>• Priority job applications</li>
              <li>• Advanced AI assistant</li>
              <li>• Video uploads</li>
            </ul>
            <button @click="upgradePlan('K100')" class="w-full mt-3 bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700">
              Upgrade to K100
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

export default {
  name: 'Bids',
  setup() {
    const authStore = useAuthStore()
    
    const availableBids = ref(0)
    const usedBids = ref(0)
    const purchasedBids = ref(0)
    const premiumPlan = ref('')
    const bidHistory = ref([])
    const showUpgradeModal = ref(false)
    const selectedPackage = ref(null)
    
    const bidPackages = [
      { id: 1, bids: 100, price: 20, description: 'Most popular' },
      { id: 2, bids: 250, price: 45, description: 'Best value' },
      { id: 3, bids: 500, price: 80, description: 'Bulk discount' }
    ]
    
    const loadBidInfo = async () => {
      try {
        const response = await api.get('/bids/info')
        const data = response.data.data
        
        availableBids.value = data.availableBids || 0
        usedBids.value = data.usedBids || 0
        purchasedBids.value = data.purchasedBids || 0
        premiumPlan.value = data.premiumPlan || ''
      } catch (error) {
        console.error('Error loading bid info:', error)
      }
    }
    
    const loadBidHistory = async () => {
      try {
        const response = await api.get('/bids/history')
        bidHistory.value = response.data.data
      } catch (error) {
        console.error('Error loading bid history:', error)
      }
    }
    
    const selectPackage = (packageId) => {
      selectedPackage.value = packageId
    }
    
    const purchaseBids = async (package) => {
      try {
        const response = await api.post('/bids/purchase', {
          packageId: package.id,
          bids: package.bids,
          amount: package.price
        })
        
        if (response.data.success) {
          await loadBidInfo()
          await loadBidHistory()
          alert(`Successfully purchased ${package.bids} bids!`)
        }
      } catch (error) {
        console.error('Error purchasing bids:', error)
        alert('Failed to purchase bids. Please try again.')
      }
    }
    
    const upgradePlan = async (plan) => {
      try {
        const response = await api.post('/auth/upgrade-premium', {
          plan: plan
        })
        
        if (response.data.success) {
          showUpgradeModal.value = false
          await loadBidInfo()
          alert(`Successfully upgraded to ${plan} plan!`)
        }
      } catch (error) {
        console.error('Error upgrading plan:', error)
        alert('Failed to upgrade plan. Please try again.')
      }
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }
    
    onMounted(async () => {
      await loadBidInfo()
      await loadBidHistory()
    })
    
    return {
      availableBids,
      usedBids,
      purchasedBids,
      premiumPlan,
      bidHistory,
      showUpgradeModal,
      selectedPackage,
      bidPackages,
      selectPackage,
      purchaseBids,
      upgradePlan,
      formatDate
    }
  }
}
</script>

<style scoped>
.bids-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style> 