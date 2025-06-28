<template>
    <div class="container-fluid p-4">
        <div class="row">
            <div class="col-12">
                <h2>Seller Test Page</h2>
                <p>If you can see this, the seller routing is working!</p>
                <div class="alert alert-success">
                    <strong>Success!</strong> Seller layout and routing is functioning correctly.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SellerTest',
    mounted() {
        console.log('SellerTest component mounted successfully');
    }
}
</script> 