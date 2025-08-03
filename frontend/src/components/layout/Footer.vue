<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="md:col-span-2">
          <h3 class="text-2xl font-bold text-zed-green mb-4">ZedHustle</h3>
          <p class="text-gray-300 mb-4 max-w-md">
            Zambia's ultimate money-making platform connecting hustlers, traders, freelancers, investors, and job seekers across the country.
          </p>
          <div class="flex space-x-4">
            <a 
              href="#" 
              class="text-gray-400 hover:text-zed-green transition-colors"
              aria-label="Facebook"
            >
              <i class="fab fa-facebook-f text-xl"></i>
            </a>
            <a 
              href="#" 
              class="text-gray-400 hover:text-zed-green transition-colors"
              aria-label="Twitter"
            >
              <i class="fab fa-twitter text-xl"></i>
            </a>
            <a 
              href="#" 
              class="text-gray-400 hover:text-zed-green transition-colors"
              aria-label="LinkedIn"
            >
              <i class="fab fa-linkedin-in text-xl"></i>
            </a>
            <a 
              href="#" 
              class="text-gray-400 hover:text-zed-green transition-colors"
              aria-label="Instagram"
            >
              <i class="fab fa-instagram text-xl"></i>
            </a>
            <a 
              href="#" 
              class="text-gray-400 hover:text-zed-green transition-colors"
              aria-label="WhatsApp"
            >
              <i class="fab fa-whatsapp text-xl"></i>
            </a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="footer-link">Home</router-link>
            </li>
            <li>
              <router-link to="/jobs" class="footer-link">Find Jobs</router-link>
            </li>
            <li>
              <router-link to="/jobs/post" class="footer-link" v-if="authStore.hasRole(['employer', 'admin'])">Post Jobs</router-link>
            </li>
            <li>
              <router-link to="/trading" class="footer-link" v-if="authStore.isAuthenticated">Trading</router-link>
            </li>
            <li>
              <router-link to="/investments" class="footer-link">Investments</router-link>
            </li>
            <li>
              <router-link to="/dashboard" class="footer-link" v-if="authStore.isAuthenticated">Dashboard</router-link>
            </li>
          </ul>
        </div>
        
        <!-- Support -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Support</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="footer-link">Help Center</a>
            </li>
            <li>
              <a href="#" class="footer-link">Contact Us</a>
            </li>
            <li>
              <a href="#" class="footer-link">Privacy Policy</a>
            </li>
            <li>
              <a href="#" class="footer-link">Terms of Service</a>
            </li>
            <li>
              <a href="#" class="footer-link">Security</a>
            </li>
            <li>
              <a href="#" class="footer-link">API Documentation</a>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Bottom Section -->
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © {{ currentYear }} ZedHustle. All rights reserved. Made with ❤️ in Zambia.
          </p>
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <span class="text-gray-400 text-sm">Powered by</span>
            <div class="flex items-center space-x-2">
              <img src="/zambia-flag.png" alt="Zambia" class="w-6 h-4 rounded" />
              <span class="text-sm font-medium">Zambian Innovation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Footer',
  setup() {
    const authStore = useAuthStore()
    
    const currentYear = computed(() => new Date().getFullYear())
    
    return {
      authStore,
      currentYear
    }
  }
}
</script>

<style scoped>
.footer-link {
  @apply text-gray-300 hover:text-zed-green transition-colors text-sm;
}
</style>
