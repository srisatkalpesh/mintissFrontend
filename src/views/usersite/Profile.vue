<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-lg border-0 rounded-4">
                    <div class="card-header bg-primary text-white rounded-top-4 p-4">
                        <h2 class="mb-0 fs-3">Profile Information</h2>
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Name</label>
                                    <p class="form-control bg-light">{{ user.name }}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Email</label>
                                    <p class="form-control bg-light">{{ user.email }}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Phone</label>
                                    <p class="form-control bg-light">{{ user.phone }}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Role</label>
                                    <p class="form-control bg-light">{{ user.role }}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Mintiss Balance</label>
                                    <p class="form-control bg-light">{{ user.mintiss }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Profile',
    data() {
        return {
            user: JSON.parse(localStorage.getItem('user')) || {}
        }
    }
}
</script>

<style scoped>
.form-control {
    border: none;
    padding: 0.75rem;
}
</style> 