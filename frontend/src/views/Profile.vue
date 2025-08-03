<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 rounded-lg mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">Profile & Settings</h1>
          <p class="text-indigo-100">Manage your account and preferences</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold">K{{ formatCurrency(walletBalance) }}</div>
          <div class="text-indigo-100 text-sm">Wallet Balance</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Information -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Personal Information</h2>
          
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  v-model="profileForm.firstName" 
                  type="text" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  v-model="profileForm.lastName" 
                  type="text" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="profileForm.email" 
                type="email" 
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                v-model="profileForm.phone" 
                type="tel" 
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea 
                v-model="profileForm.bio" 
                rows="3"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button 
                type="submit" 
                :disabled="isLoading"
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ isLoading ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Security Settings -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Security Settings</h2>
          
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-medium mb-2">Change Password</h3>
              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input 
                    v-model="passwordForm.currentPassword" 
                    type="password" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input 
                    v-model="passwordForm.newPassword" 
                    type="password" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input 
                    v-model="passwordForm.confirmPassword" 
                    type="password" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                </div>
                <div class="flex justify-end">
                  <button 
                    type="submit" 
                    :disabled="isChangingPassword || !isPasswordValid"
                    class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <!-- Account Stats -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Account Overview</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Account Type:</span>
              <span class="font-medium">{{ user?.role || 'User' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Member Since:</span>
              <span class="font-medium">{{ formatDate(user?.createdAt) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Last Login:</span>
              <span class="font-medium">{{ formatDate(user?.lastLogin) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Account Number:</span>
              <span class="font-medium">{{ user?.wallet?.accountNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
          
          <div class="space-y-3">
            <router-link 
              to="/payments/deposit"
              class="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
            >
              Deposit Funds
            </router-link>
            <router-link 
              to="/payments/withdraw"
              class="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
            >
              Withdraw Funds
            </router-link>
            <router-link 
              to="/trading"
              class="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
            >
              Virtual Trading
            </router-link>
            <router-link 
              to="/investments"
              class="block w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-center"
            >
              Browse Investments
            </router-link>
          </div>
        </div>

        <!-- Account Status -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Account Status</h2>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Email Verified:</span>
              <span :class="user?.emailVerified ? 'text-green-600' : 'text-red-600'" class="font-medium">
                {{ user?.emailVerified ? 'Yes' : 'No' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">KYC Status:</span>
              <span :class="user?.kyc?.status === 'verified' ? 'text-green-600' : 'text-yellow-600'" class="font-medium">
                {{ user?.kyc?.status || 'Pending' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Account Status:</span>
              <span class="text-green-600 font-medium">Active</span>
            </div>
          </div>
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
const user = ref(null)
const walletBalance = ref(0)
const isLoading = ref(false)
const isChangingPassword = ref(false)

// Forms
const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Computed properties
const isPasswordValid = computed(() => {
  return passwordForm.value.newPassword && 
         passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword.length >= 6
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchUserProfile = async () => {
  try {
    const response = await api.get('/auth/me')
    user.value = response.data.data
    
    // Populate form with user data
    profileForm.value = {
      firstName: user.value.profile?.firstName || '',
      lastName: user.value.profile?.lastName || '',
      email: user.value.email || '',
      phone: user.value.profile?.phone || '',
      bio: user.value.profile?.bio || ''
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    appStore.showNotification('Error loading profile', 'error')
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

const updateProfile = async () => {
  isLoading.value = true
  try {
    await api.put('/auth/profile', profileForm.value)
    appStore.showNotification('Profile updated successfully!', 'success')
    await fetchUserProfile()
  } catch (error) {
    console.error('Error updating profile:', error)
    appStore.showNotification(error.response?.data?.message || 'Error updating profile', 'error')
  } finally {
    isLoading.value = false
  }
}

const changePassword = async () => {
  if (!isPasswordValid.value) return

  isChangingPassword.value = true
  try {
    await api.post('/auth/reset-password', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })

    appStore.showNotification('Password changed successfully!', 'success')
    
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('Error changing password:', error)
    appStore.showNotification(error.response?.data?.message || 'Error changing password', 'error')
  } finally {
    isChangingPassword.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchUserProfile(), fetchWalletBalance()])
})
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style> 