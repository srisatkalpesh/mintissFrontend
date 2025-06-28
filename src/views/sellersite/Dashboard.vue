<template>
    <div class="container-fluid p-4">
        <div class="row">
            <div class="col-12">
                <h2 class="mb-4">Seller Dashboard</h2>
                <p>Welcome to your seller dashboard!</p>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-3 mb-4">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <h4 class="card-title">Total Products</h4>
                        <h2 class="mb-0">12</h2>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 mb-4">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <h4 class="card-title">Total Orders</h4>
                        <h2 class="mb-0">45</h2>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 mb-4">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <h4 class="card-title">Revenue</h4>
                        <h2 class="mb-0">$1,250</h2>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 mb-4">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <h4 class="card-title">Active Products</h4>
                        <h2 class="mb-0">8</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SellerDashboard',
    mounted() {
        console.log('SellerDashboard component mounted');
    }
}
</script> 