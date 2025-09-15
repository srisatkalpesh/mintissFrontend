<template>
  <div v-if="isLoading" class="global-loader-overlay">
    <div class="global-loader">
      <div class="loader-spinner">
        <div class="spinner"></div>
      </div>
      <div class="loader-message">{{ loadingMessage }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import loaderService from '@/services/loaderService'

export default {
  name: 'GlobalLoader',
  setup() {
    const isLoading = ref(false)
    const loadingMessage = ref('Loading...')

    const updateLoaderState = () => {
      isLoading.value = loaderService.loading
      loadingMessage.value = loaderService.message
    }

    // Watch for changes in loader service
    let intervalId = null
    onMounted(() => {
      intervalId = setInterval(updateLoaderState, 100)
    })

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })

    return {
      isLoading,
      loadingMessage
    }
  }
}
</script>

<style scoped>
.global-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.global-loader {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 200px;
}

.loader-spinner {
  margin-bottom: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.loader-message {
  color: #333;
  font-weight: 500;
  font-size: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Pulse animation for better visual feedback */
.global-loader {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
</style>
