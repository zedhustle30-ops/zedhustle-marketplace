<template>
  <div class="messages-container">
    <div class="header bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg mb-6">
      <h1 class="text-3xl font-bold mb-2">Messages</h1>
      <p class="text-purple-100">Chat with users and view notifications</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Conversations List -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md">
          <div class="p-4 border-b">
            <h2 class="text-lg font-semibold">Conversations</h2>
          </div>
          <div class="max-h-96 overflow-y-auto">
            <div 
              v-for="conversation in conversations" 
              :key="conversation._id"
              @click="selectConversation(conversation)"
              class="p-4 border-b hover:bg-gray-50 cursor-pointer"
              :class="{ 'bg-blue-50': selectedConversation?._id === conversation._id }"
            >
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {{ conversation.name.charAt(0) }}
                </div>
                <div class="ml-3 flex-1">
                  <div class="font-medium">{{ conversation.name }}</div>
                  <div class="text-sm text-gray-500 truncate">{{ conversation.lastMessage }}</div>
                </div>
                <div class="text-xs text-gray-400">{{ formatTime(conversation.lastMessageTime) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md h-96 flex flex-col">
          <div v-if="selectedConversation" class="p-4 border-b">
            <h3 class="font-semibold">{{ selectedConversation.name }}</h3>
          </div>
          
          <div v-if="selectedConversation" class="flex-1 overflow-y-auto p-4">
            <div v-for="message in messages" :key="message._id" class="mb-4">
              <div :class="message.sender._id === currentUser._id ? 'text-right' : 'text-left'">
                <div 
                  class="inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
                  :class="message.sender._id === currentUser._id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'"
                >
                  <div class="text-sm">{{ message.content }}</div>
                  <div class="text-xs opacity-75 mt-1">{{ formatTime(message.sentAt) }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="selectedConversation" class="p-4 border-t">
            <div class="flex gap-2">
              <input 
                v-model="newMessage"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Type a message..."
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button 
                @click="sendMessage"
                :disabled="!newMessage.trim()"
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
          
          <div v-else class="flex-1 flex items-center justify-center text-gray-500">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Notifications</h2>
      <div class="bg-white rounded-lg shadow-md">
        <div class="p-4 border-b">
          <div class="flex justify-between items-center">
            <span class="font-semibold">Recent Notifications</span>
            <button @click="markAllAsRead" class="text-sm text-purple-600 hover:text-purple-800">
              Mark all as read
            </button>
          </div>
        </div>
        <div class="divide-y">
          <div 
            v-for="notification in notifications" 
            :key="notification._id"
            class="p-4 hover:bg-gray-50"
            :class="{ 'bg-blue-50': !notification.readBy.some(r => r.user === currentUser._id) }"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="font-medium">{{ notification.subject }}</div>
                <div class="text-sm text-gray-600 mt-1">{{ notification.content }}</div>
                <div class="text-xs text-gray-400 mt-2">{{ formatTime(notification.sentAt) }}</div>
              </div>
              <button 
                @click="markAsRead(notification)"
                v-if="!notification.readBy.some(r => r.user === currentUser._id)"
                class="text-sm text-purple-600 hover:text-purple-800"
              >
                Mark as read
              </button>
            </div>
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
  name: 'Messages',
  setup() {
    const authStore = useAuthStore()
    const currentUser = authStore.user
    
    const conversations = ref([])
    const selectedConversation = ref(null)
    const messages = ref([])
    const notifications = ref([])
    const newMessage = ref('')
    
    const loadConversations = async () => {
      try {
        const response = await api.get('/messages/conversations')
        conversations.value = response.data.data
      } catch (error) {
        console.error('Error loading conversations:', error)
      }
    }
    
    const loadNotifications = async () => {
      try {
        const response = await api.get('/messages/notifications')
        notifications.value = response.data.data
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }
    
    const selectConversation = async (conversation) => {
      selectedConversation.value = conversation
      try {
        const response = await api.get(`/messages/chat/${conversation._id}`)
        messages.value = response.data.data
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    }
    
    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedConversation.value) return
      
      try {
        const response = await api.post('/messages/send', {
          recipient: selectedConversation.value._id,
          content: newMessage.value
        })
        
        if (response.data.success) {
          messages.value.push(response.data.data)
          newMessage.value = ''
        }
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
    
    const markAsRead = async (notification) => {
      try {
        await api.put(`/messages/notifications/${notification._id}/read`)
        notification.readBy.push({ user: currentUser._id, readAt: new Date() })
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }
    
    const markAllAsRead = async () => {
      try {
        await api.put('/messages/notifications/read-all')
        notifications.value.forEach(n => {
          if (!n.readBy.some(r => r.user === currentUser._id)) {
            n.readBy.push({ user: currentUser._id, readAt: new Date() })
          }
        })
      } catch (error) {
        console.error('Error marking all notifications as read:', error)
      }
    }
    
    const formatTime = (time) => {
      const date = new Date(time)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return 'Just now'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
      return date.toLocaleDateString()
    }
    
    onMounted(async () => {
      await loadConversations()
      await loadNotifications()
    })
    
    return {
      currentUser,
      conversations,
      selectedConversation,
      messages,
      notifications,
      newMessage,
      selectConversation,
      sendMessage,
      markAsRead,
      markAllAsRead,
      formatTime
    }
  }
}
</script>

<style scoped>
.messages-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style> 