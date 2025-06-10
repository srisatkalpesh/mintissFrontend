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

    // Remove the toast after it's hidden
    setTimeout(() => {
        app.unmount();
        document.body.removeChild(toastContainer);
    }, 3000);
};

export default {
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    warning: (message) => showToast(message, 'warning'),
    info: (message) => showToast(message, 'info')
}; 