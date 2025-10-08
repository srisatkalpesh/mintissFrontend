<template>
  <div v-if="isLoading" class="modern-loader-overlay">
    <div class="modern-loader">
      <div class="loader-content">
        <div class="loader-spinner">
          <div class="spinner-ring">
            <div class="spinner-ring-inner"></div>
          </div>
          <div class="spinner-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
        <div class="loader-message">
          <h4 class="message-title">{{ loadingMessage }}</h4>
          <p class="message-subtitle">Please wait while we process your request...</p>
        </div>
        <div class="loader-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>
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
/* ===== MODERN LOADER STYLES ===== */
.modern-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

.modern-loader {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 320px;
  max-width: 400px;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.5s ease-out;
}

.modern-loader::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #ff6b6b, #ffa500);
  background-size: 300% 100%;
  animation: gradientShift 2s ease-in-out infinite;
}

.loader-content {
  position: relative;
  z-index: 1;
}

.loader-spinner {
  margin-bottom: 2rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner-ring {
  width: 60px;
  height: 60px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: relative;
}

.spinner-ring-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 2px solid #f0f0f0;
  border-top: 2px solid #764ba2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite reverse;
}

.spinner-dots {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }

.loader-message {
  margin-bottom: 1.5rem;
}

.message-title {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.message-subtitle {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.loader-progress {
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0, #f0f0f0);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2, #ff6b6b, #ffa500);
  background-size: 300% 100%;
  border-radius: 2px;
  animation: progressMove 2s ease-in-out infinite;
}

/* ===== ANIMATIONS ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes progressMove {
  0% { left: -100%; }
  50% { left: 0%; }
  100% { left: 100%; }
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 576px) {
  .modern-loader {
    margin: 1rem;
    padding: 2rem 1.5rem;
    min-width: 280px;
  }
  
  .message-title {
    font-size: 1.1rem;
  }
  
  .message-subtitle {
    font-size: 0.85rem;
  }
  
  .spinner-ring {
    width: 50px;
    height: 50px;
  }
  
  .spinner-ring-inner {
    width: 25px;
    height: 25px;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  .spinner-ring,
  .spinner-ring-inner,
  .dot,
  .progress-fill {
    animation: none;
  }
  
  .modern-loader {
    animation: none;
  }
}

/* ===== DARK MODE SUPPORT ===== */
@media (prefers-color-scheme: dark) {
  .modern-loader {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: #ecf0f1;
  }
  
  .message-title {
    color: #ecf0f1;
  }
  
  .message-subtitle {
    color: #bdc3c7;
  }
  
  .spinner-ring {
    border-color: #34495e;
    border-top-color: #667eea;
  }
  
  .spinner-ring-inner {
    border-color: #34495e;
    border-top-color: #764ba2;
  }
}
</style>
