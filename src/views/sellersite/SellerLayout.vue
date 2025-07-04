<template>
    <div class="seller-layout">
        <!-- Mobile Toggle Button -->
        <button class="btn btn-success d-md-none sidebar-toggle" @click="toggleSidebar">
            <i class="bi bi-list"></i>
        </button>

        <!-- Sidebar -->
        <div class="sidebar bg-success text-white" :class="{ 'show': isSidebarOpen }">
            <div class="sidebar-header p-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Seller Panel</h5>
                <button class="btn btn-success d-md-none" @click="toggleSidebar">
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link to="/seller/dashboard" class="nav-link text-white">
                        <i class="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/seller/products" class="nav-link text-white">
                        <i class="bi bi-box me-2"></i>
                        My Products
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/seller/profile" class="nav-link text-white">
                        <i class="bi bi-person me-2"></i>
                        Profile
                    </router-link>
                </li>
                <li class="nav-item mt-auto">
                    <a href="#" class="nav-link text-white" @click.prevent="handleLogout">
                        <i class="bi bi-box-arrow-right me-2"></i>
                        Logout
                    </a>
                </li>
            </ul>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
    name: 'SellerLayout',
    data() {
        return {
            isSidebarOpen: false
        }
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        async handleLogout() {
            try {
                await axios.get('/logout');
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Show success message
                alert('Logged out successfully');
                // Redirect to login page
                window.location.href = '/login';
            } catch (error) {
                console.error('Logout error:', error);
                alert('Failed to logout');
            }
        }
    }
}
</script>

<style scoped>
.seller-layout {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 250px;
    min-height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    transition: transform 0.3s ease;
}

.main-content {
    flex: 1;
    margin-left: 250px;
    background-color: #f8f9fa;
    min-height: 100vh;
}

.nav-link {
    padding: 0.75rem 1rem;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1001;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
    }

    .sidebar.show {
        transform: translateX(0);
    }

    .main-content {
        margin-left: 0;
    }

    .seller-layout {
        flex-direction: column;
    }
}

.nav-item.mt-auto {
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style> 