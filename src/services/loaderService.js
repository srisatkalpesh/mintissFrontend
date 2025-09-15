import { ref } from 'vue'

// Global loader state
const isLoading = ref(false)
const loadingMessage = ref('Loading...')

// Loader service
const loaderService = {
  // Show loader with optional message
  show(message = 'Loading...') {
    loadingMessage.value = message
    isLoading.value = true
  },

  // Hide loader
  hide() {
    isLoading.value = false
    loadingMessage.value = 'Loading...'
  },

  // Get current loading state
  get loading() {
    return isLoading.value
  },

  // Get current loading message
  get message() {
    return loadingMessage.value
  },

  // Wrapper for async operations with automatic loader
  async withLoader(asyncOperation, message = 'Loading...') {
    try {
      this.show(message)
      const result = await asyncOperation()
      return result
    } finally {
      this.hide()
    }
  }
}

export default loaderService
