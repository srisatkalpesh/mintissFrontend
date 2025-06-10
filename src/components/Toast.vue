<template>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div class="toast align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true" ref="toast">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi" :class="icon"></i>
                    {{ message }}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
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
            toast: null
        }
    },
    computed: {
        icon() {
            const icons = {
                success: 'bi-check-circle-fill',
                error: 'bi-x-circle-fill',
                warning: 'bi-exclamation-circle-fill',
                info: 'bi-info-circle-fill'
            };
            return icons[this.type];
        }
    },
    mounted() {
        this.toast = new Toast(this.$refs.toast, {
            animation: true,
            autohide: true,
            delay: 3000
        });
        this.toast.show();
    },
    beforeUnmount() {
        if (this.toast) {
            this.toast.dispose();
        }
    }
}
</script>

<style scoped>
.toast-container {
    z-index: 1050;
}

.toast {
    min-width: 250px;
}

.toast-body {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.bi {
    font-size: 1.2rem;
}
</style> 