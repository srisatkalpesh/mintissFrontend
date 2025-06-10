<template>
    <div class="admin-layout">
        <!-- Sidebar -->
        <div class="sidebar bg-dark text-white">
            <div class="sidebar-header p-3">
                <h5 class="mb-0">Admin Panel</h5>
            </div>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link to="/admin/categories" class="nav-link text-white">
                        <i class="bi bi-grid me-2"></i>
                        Categories
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/sub-categories" class="nav-link text-white">
                        <i class="bi bi-grid-3x3 me-2"></i>
                        Sub Categories
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/products" class="nav-link text-white">
                        <i class="bi bi-box me-2"></i>
                        Products
                    </router-link>
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
export default {
    name: 'AdminLayout'
}
</script>

<style scoped>
.admin-layout {
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
}

.main-content {
    flex: 1;
    margin-left: 250px;
    background-color: #f8f9fa;
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

/* Mobile Responsive */
@media (max-width: 768px) {
    .sidebar {
        width: 100%;
        position: relative;
        min-height: auto;
    }

    .main-content {
        margin-left: 0;
    }

    .admin-layout {
        flex-direction: column;
    }
}
</style> 