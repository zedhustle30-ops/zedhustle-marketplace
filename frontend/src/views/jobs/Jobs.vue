<template>
  <div class="jobs-page">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg mb-6">
      <div class="flex items-center justify-between">
          <div>
          <h1 class="text-2xl font-bold mb-2">Job Opportunities</h1>
          <p class="text-purple-100">Find your next career opportunity in Zambia</p>
          </div>
        <div class="text-right">
          <div class="text-3xl font-bold">{{ totalJobs }}</div>
          <div class="text-purple-100 text-sm">Available Jobs</div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
          v-model="searchQuery" 
                  type="text"
          placeholder="Search jobs..."
          class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
        <select v-model="categoryFilter" class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option value="">All Categories</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
                <option value="marketing">Marketing</option>
          <option value="sales">Sales</option>
        </select>
        <select v-model="locationFilter" class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
          <option value="">All Locations</option>
          <option value="lusaka">Lusaka</option>
          <option value="ndola">Ndola</option>
          <option value="kitwe">Kitwe</option>
          <option value="livingstone">Livingstone</option>
          <option value="remote">Remote</option>
        </select>
        <select v-model="sortBy" class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
          <option value="newest">Newest First</option>
          <option value="salary">Highest Salary</option>
          <option value="title">Job Title</option>
              </select>
      </div>
            </div>

    <!-- Jobs Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div 
        v-for="job in filteredJobs" 
        :key="job._id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-2">{{ job.title }}</h3>
              <p class="text-gray-600 text-sm mb-2">{{ job.company }}</p>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ job.location }}
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatDate(job.createdAt) }}
                </span>
              </div>
            </div>
            <span class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              {{ job.category }}
            </span>
          </div>

          <p class="text-gray-600 text-sm mb-4">{{ job.description.substring(0, 150) }}...</p>

          <div class="flex items-center justify-between mb-4">
            <div class="text-sm">
              <span class="text-gray-500">Salary:</span>
              <span class="font-medium text-green-600 ml-1">K{{ formatCurrency(job.salary) }}</span>
            </div>
            <div class="text-sm">
              <span class="text-gray-500">Type:</span>
              <span class="font-medium ml-1">{{ job.type }}</span>
            </div>
          </div>

          <div class="flex space-x-3">
            <button 
              @click="viewJob(job._id)"
              class="flex-1 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50"
            >
              View Details
            </button>
            <button 
              @click="applyNow(job)"
              :disabled="job.hasApplied"
              class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ job.hasApplied ? 'Applied' : 'Apply Now' }}
            </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
    <div v-if="filteredJobs.length === 0" class="text-center py-12">
      <div class="text-gray-500 mb-4">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
        </svg>
      </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
      <p class="text-gray-500">Try adjusting your filters or check back later for new opportunities.</p>
    </div>

    <!-- Application Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Apply for {{ selectedJob?.title }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedJob" class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between text-sm mb-2">
                <span>Company:</span>
                <span class="font-medium">{{ selectedJob.company }}</span>
              </div>
              <div class="flex justify-between text-sm mb-2">
                <span>Location:</span>
                <span class="font-medium">{{ selectedJob.location }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>Salary:</span>
                <span class="font-medium text-green-600">K{{ formatCurrency(selectedJob.salary) }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
              <textarea 
                v-model="coverLetter" 
                rows="4"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Tell us why you're interested in this position..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Expected Salary (K)</label>
              <input 
                v-model.number="expectedSalary" 
                type="number" 
                min="1"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your expected salary"
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
                @click="confirmApplication"
                :disabled="!isValidApplication || isLoading"
                class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {{ isLoading ? 'Submitting...' : 'Submit Application' }}
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
    const jobs = ref([])
const isLoading = ref(false)

// Filters
const searchQuery = ref('')
const categoryFilter = ref('')
const locationFilter = ref('')
const sortBy = ref('newest')

// Modal
const showModal = ref(false)
const selectedJob = ref(null)
const coverLetter = ref('')
const expectedSalary = ref(0)

// Computed properties
const filteredJobs = computed(() => {
  let filtered = jobs.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(job => 
      job.category === categoryFilter.value
    )
  }

  if (locationFilter.value) {
    filtered = filtered.filter(job => 
      job.location.toLowerCase().includes(locationFilter.value)
    )
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'salary':
        return b.salary - a.salary
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return filtered
})

const totalJobs = computed(() => jobs.value.length)

const isValidApplication = computed(() => {
  return selectedJob.value && coverLetter.value.trim() && expectedSalary.value > 0
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

const fetchJobs = async () => {
  try {
    const response = await api.get('/jobs')
    jobs.value = response.data.data
      } catch (error) {
    console.error('Error fetching jobs:', error)
    appStore.showNotification('Error loading jobs', 'error')
  }
}

const viewJob = (jobId) => {
  router.push(`/jobs/${jobId}`)
}

const applyNow = (job) => {
  selectedJob.value = job
  coverLetter.value = ''
  expectedSalary.value = job.salary
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedJob.value = null
  coverLetter.value = ''
  expectedSalary.value = 0
}

const confirmApplication = async () => {
  if (!isValidApplication.value) return

  isLoading.value = true
  try {
    await api.post(`/jobs/${selectedJob.value._id}/apply`, {
      coverLetter: coverLetter.value,
      expectedSalary: expectedSalary.value
    })

    appStore.showNotification('Application submitted successfully!', 'success')
    
    // Update the job to show as applied
    const jobIndex = jobs.value.findIndex(job => job._id === selectedJob.value._id)
    if (jobIndex !== -1) {
      jobs.value[jobIndex].hasApplied = true
    }
    
    closeModal()
  } catch (error) {
    console.error('Error submitting application:', error)
    appStore.showNotification(error.response?.data?.message || 'Error submitting application', 'error')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await fetchJobs()
})
</script>

<style scoped>
.jobs-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>