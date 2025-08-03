import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

// Create Vue app
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use Vue Router
app.use(router)

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error, info)
}

// Mount app
app.mount('#app')