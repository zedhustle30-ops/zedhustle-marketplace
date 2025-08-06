<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-zed-green">
          <i class="fas fa-user-plus text-white text-xl"></i>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-zed-green hover:text-green-700">
            Sign in here
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- Personal Information -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                v-model="form.firstName"
                name="firstName"
                type="text"
                required
                class="input"
                :class="{ 'input-error': errors.firstName }"
                placeholder="John"
              />
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                v-model="form.lastName"
                name="lastName"
                type="text"
                required
                class="input"
                :class="{ 'input-error': errors.lastName }"
                placeholder="Doe"
              />
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="input"
              :class="{ 'input-error': errors.email }"
              placeholder="john@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              required
              class="input"
              :class="{ 'input-error': errors.phone }"
              placeholder="+260971234567"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
            <p class="mt-1 text-sm text-gray-500">Format: +260XXXXXXXXX</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">City</label>
              <select
                id="city"
                v-model="form.location.city"
                name="city"
                class="input"
              >
                <option value="">Select City</option>
                <option value="Lusaka">Lusaka</option>
                <option value="Kitwe">Kitwe</option>
                <option value="Ndola">Ndola</option>
                <option value="Kabwe">Kabwe</option>
                <option value="Chingola">Chingola</option>
                <option value="Mufulira">Mufulira</option>
                <option value="Livingstone">Livingstone</option>
                <option value="Kasama">Kasama</option>
                <option value="Chipata">Chipata</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label for="province" class="block text-sm font-medium text-gray-700">Province</label>
              <select
                id="province"
                v-model="form.location.province"
                name="province"
                class="input"
              >
                <option value="">Select Province</option>
                <option value="Lusaka">Lusaka</option>
                <option value="Copperbelt">Copperbelt</option>
                <option value="Central">Central</option>
                <option value="Eastern">Eastern</option>
                <option value="Northern">Northern</option>
                <option value="North-Western">North-Western</option>
                <option value="Southern">Southern</option>
                <option value="Western">Western</option>
                <option value="Luapula">Luapula</option>
                <option value="Muchinga">Muchinga</option>
              </select>
            </div>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">I am a</label>
            <select
              id="role"
              v-model="form.role"
              name="role"
              required
              class="input"
              :class="{ 'input-error': errors.role }"
            >
              <option value="">Select your role</option>
              <option value="user">Job Seeker / Trader / Investor</option>
              <option value="employer">Employer / Company</option>
              <option value="business_owner">Business Owner (seeking investment)</option>
            </select>
            <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="input pr-10"
                :class="{ 'input-error': errors.password }"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            <p class="mt-1 text-sm text-gray-500">Must be at least 6 characters</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                name="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="input pr-10"
                :class="{ 'input-error': errors.confirmPassword }"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-center">
          <input
            id="agree-terms"
            v-model="form.agreeTerms"
            name="agree-terms"
            type="checkbox"
            required
            class="h-4 w-4 text-zed-green focus:ring-zed-green border-gray-300 rounded"
          />
          <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <a href="#" class="text-zed-green hover:text-green-700">Terms and Conditions</a>
            and
            <a href="#" class="text-zed-green hover:text-green-700">Privacy Policy</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-zed-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zed-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-user-plus text-green-500 group-hover:text-green-400" aria-hidden="true"></i>
            </span>
            <span v-if="loading" class="flex items-center">
              <div class="loading-spinner w-4 h-4 mr-2"></div>
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const loading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    
    const form = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: {
        city: '',
        province: ''
      },
      role: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    })
    
    const errors = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      confirmPassword: ''
    })
    
    const validateForm = () => {
      // Reset errors
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
      
      let isValid = true
      
      if (!form.firstName.trim()) {
        errors.firstName = 'First name is required'
        isValid = false
      }
      
      if (!form.lastName.trim()) {
        errors.lastName = 'Last name is required'
        isValid = false
      }
      
      if (!form.email) {
        errors.email = 'Email is required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }
      
      if (!form.phone) {
        errors.phone = 'Phone number is required'
        isValid = false
      } else if (!/^\+260[0-9]{9}$/.test(form.phone)) {
        errors.phone = 'Please enter a valid Zambian phone number (+260XXXXXXXXX)'
        isValid = false
      }
      
      if (!form.role) {
        errors.role = 'Please select your role'
        isValid = false
      }
      
      if (!form.password) {
        errors.password = 'Password is required'
        isValid = false
      } else if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
        isValid = false
      }
      
      if (!form.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password'
        isValid = false
      } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
        isValid = false
      }
      
      return isValid
    }
    
    const handleRegister = async () => {
      if (!validateForm()) return
      
      loading.value = true
      
      try {
        const userData = {
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          role: form.role,
          location: form.location.city || form.location.province ? form.location : undefined
        }
        
        const result = await authStore.register(userData)
        
        if (result.success) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Registration error:', error)
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      errors,
      loading,
      showPassword,
      showConfirmPassword,
      handleRegister
    }
  }
}
</script>