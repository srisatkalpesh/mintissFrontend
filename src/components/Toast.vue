<template>
    <div class="modern-toast-container position-fixed top-0 end-0 p-3">
        <div 
            class="modern-toast" 
            :class="toastClass"
            role="alert" 
            aria-live="assertive" 
            aria-atomic="true" 
            ref="toast"
        >
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="bi" :class="icon"></i>
                </div>
                <div class="toast-body">
                    <div class="toast-title">{{ getTitle() }}</div>
                    <div class="toast-message">{{ message }}</div>
                </div>
                <button 
                    type="button" 
                    class="toast-close" 
                    @click="closeToast"
                    aria-label="Close"
                >
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <div class="toast-progress">
                <div class="progress-bar" :class="type"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'bootstrap';

export default {
    name: 'Toast',
    props: {
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'success',
            validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
        }
    },
    data() {
        return {
            toast: null,
            customTimeout: null
        }
    },
    computed: {
        icon() {
            const icons = {
                success: 'bi-check-circle-fill',
                error: 'bi-x-circle-fill',
                warning: 'bi-exclamation-triangle-fill',
                info: 'bi-info-circle-fill'
            };
            return icons[this.type];
        },
        toastClass() {
            return `toast-${this.type}`;
        }
    },
    methods: {
        getTitle() {
            const titles = {
                success: 'Success!',
                error: 'Error!',
                warning: 'Warning!',
                info: 'Info'
            };
            return titles[this.type];
        },
        closeToast() {
            try {
                if (this.toast && this.$refs.toast && this.$refs.toast.classList) {
                    this.toast.hide();
                } else {
                    // Fallback: hide manually
                    this.hideCustomToast();
                }
            } catch (error) {
                console.warn('Toast close failed:', error);
                // Fallback: emit close event to parent
                this.$emit('close');
            }
        },
        showCustomToast() {
            // Custom toast implementation without Bootstrap
            this.$refs.toast.style.display = 'block';
            this.$refs.toast.style.opacity = '0';
            this.$refs.toast.style.transform = 'translateX(100%)';
            
            // Animate in
            setTimeout(() => {
                this.$refs.toast.style.transition = 'all 0.4s ease-out';
                this.$refs.toast.style.opacity = '1';
                this.$refs.toast.style.transform = 'translateX(0)';
            }, 10);
            
            // Auto hide after 3 seconds
            this.customTimeout = setTimeout(() => {
                this.hideCustomToast();
            }, 3000);
        },
        hideCustomToast() {
            if (this.customTimeout) {
                clearTimeout(this.customTimeout);
                this.customTimeout = null;
            }
            
            if (this.$refs.toast) {
                this.$refs.toast.style.transition = 'all 0.3s ease-in';
                this.$refs.toast.style.opacity = '0';
                this.$refs.toast.style.transform = 'translateX(100%)';
                
                setTimeout(() => {
                    this.$emit('close');
                }, 300);
            }
        }
    },
    mounted() {
        try {
            // Use Bootstrap Toast if available, otherwise use custom implementation
            if (window.bootstrap && window.bootstrap.Toast) {
                this.toast = new window.bootstrap.Toast(this.$refs.toast, {
                    animation: true,
                    autohide: true,
                    delay: 3000
                });
                
                // Add event listener for when toast is hidden
                this.$refs.toast.addEventListener('hidden.bs.toast', () => {
                    this.$emit('close');
                });
                
                this.toast.show();
            } else {
                // Fallback: use custom implementation
                this.showCustomToast();
            }
        } catch (error) {
            console.warn('Toast initialization failed, using fallback:', error);
            this.showCustomToast();
        }
    },
    beforeUnmount() {
        try {
            // Remove event listener
            if (this.$refs.toast) {
                this.$refs.toast.removeEventListener('hidden.bs.toast', () => {});
            }
            
        if (this.toast) {
                // Check if the toast element still exists before disposing
                if (this.$refs.toast && this.$refs.toast.classList) {
            this.toast.dispose();
                }
                this.toast = null;
            }
        } catch (error) {
            console.warn('Toast disposal failed:', error);
        }
    }
}
</script>

<style scoped>
/* ===== MODERN TOAST STYLES ===== */
.modern-toast-container {
    z-index: 1050;
    max-width: 400px;
}

.modern-toast {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    animation: slideInRight 0.4s ease-out;
    min-width: 320px;
    max-width: 400px;
}

.toast-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    position: relative;
    z-index: 2;
}

.toast-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
    margin-top: 0.25rem;
}

.toast-body {
    flex: 1;
    min-width: 0;
}

.toast-title {
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
    line-height: 1.3;
}

.toast-message {
    font-size: 0.9rem;
    color: #6c757d;
    line-height: 1.4;
    word-wrap: break-word;
}

.toast-close {
    background: none;
    border: none;
    color: #6c757d;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toast-close:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
}

.toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    width: 100%;
    transform: scaleX(0);
    transform-origin: left;
    animation: progressFill 3s linear forwards;
}

/* ===== TOAST TYPES ===== */
.toast-success {
    border-left: 4px solid #28a745;
}

.toast-success .toast-icon {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
}

.toast-success .toast-title {
    color: #155724;
}

.toast-success .progress-bar {
    background: linear-gradient(90deg, #28a745, #20c997);
}

.toast-error {
    border-left: 4px solid #dc3545;
}

.toast-error .toast-icon {
    background: linear-gradient(135deg, #dc3545, #ff6b6b);
    color: white;
}

.toast-error .toast-title {
    color: #721c24;
}

.toast-error .progress-bar {
    background: linear-gradient(90deg, #dc3545, #ff6b6b);
}

.toast-warning {
    border-left: 4px solid #ffc107;
}

.toast-warning .toast-icon {
    background: linear-gradient(135deg, #ffc107, #ffa500);
    color: white;
}

.toast-warning .toast-title {
    color: #856404;
}

.toast-warning .progress-bar {
    background: linear-gradient(90deg, #ffc107, #ffa500);
}

.toast-info {
    border-left: 4px solid #17a2b8;
}

.toast-info .toast-icon {
    background: linear-gradient(135deg, #17a2b8, #6f42c1);
    color: white;
}

.toast-info .toast-title {
    color: #0c5460;
}

.toast-info .progress-bar {
    background: linear-gradient(90deg, #17a2b8, #6f42c1);
}

/* ===== ANIMATIONS ===== */
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes progressFill {
    from {
        transform: scaleX(1);
    }
    to {
        transform: scaleX(0);
    }
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 576px) {
    .modern-toast-container {
        left: 1rem;
        right: 1rem;
        max-width: none;
    }
    
    .modern-toast {
        min-width: auto;
        max-width: none;
    }
    
    .toast-content {
        padding: 0.875rem;
        gap: 0.75rem;
    }
    
    .toast-icon {
        width: 36px;
        height: 36px;
        font-size: 1.1rem;
    }
    
    .toast-title {
        font-size: 0.9rem;
    }
    
    .toast-message {
        font-size: 0.85rem;
    }
}

/* ===== ACCESSIBILITY ===== */
.toast-close:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

/* ===== DARK MODE SUPPORT ===== */
@media (prefers-color-scheme: dark) {
    .modern-toast {
        background: #2c3e50;
        border-color: #34495e;
    }
    
    .toast-message {
        color: #bdc3c7;
    }
    
    .toast-close {
        color: #bdc3c7;
    }
    
    .toast-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .toast-progress {
        background: rgba(255, 255, 255, 0.1);
    }
}

/* ===== HOVER EFFECTS ===== */
.modern-toast:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

/* ===== FOCUS STATES ===== */
.modern-toast:focus-within {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}
</style> 