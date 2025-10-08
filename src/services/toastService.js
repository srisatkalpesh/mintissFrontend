import { createApp } from 'vue';
import Toast from '@/components/Toast.vue';

const showToast = (message, type = 'success') => {
    // Create a div element to mount the toast
    const toastContainer = document.createElement('div');
    document.body.appendChild(toastContainer);

    // Create a new Vue app instance for the toast
    const app = createApp(Toast, {
        message,
        type
    });

    // Mount the toast
    const toast = app.mount(toastContainer);

    // Cleanup function
    const cleanup = () => {
        try {
            // Clear any pending timeouts
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            // Unmount the app
            app.unmount();
            
            // Remove the container from DOM
            if (document.body.contains(toastContainer)) {
                document.body.removeChild(toastContainer);
            }
        } catch (error) {
            console.warn('Toast cleanup failed:', error);
        }
    };

    // Set up timeout cleanup (fallback)
    const timeoutId = setTimeout(cleanup, 3000);
    
    // Listen for the hidden event on the toast element
    const toastElement = toastContainer.querySelector('.modern-toast');
    if (toastElement) {
        const handleHidden = () => {
            cleanup();
            toastElement.removeEventListener('hidden.bs.toast', handleHidden);
        };
        toastElement.addEventListener('hidden.bs.toast', handleHidden);
    }
};

export default {
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    warning: (message) => showToast(message, 'warning'),
    info: (message) => showToast(message, 'info')
}; 