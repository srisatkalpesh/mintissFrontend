<template>
    <div class="container-fluid p-4">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>My Products</h2>
                    <button class="btn btn-success" @click="showAddModal = true">
                        <i class="bi bi-plus"></i> Add Product
                    </button>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div v-if="products.length === 0" class="text-center text-muted py-5">
                            <i class="bi bi-box fs-1"></i>
                            <p>No products yet. Add your first product to get started!</p>
                            <button class="btn btn-success" @click="showAddModal = true">
                                Add Product
                            </button>
                        </div>
                        <div v-else>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="product in products" :key="product.id">
                                            <td>
                                                <img :src="product.image" :alt="product.name" 
                                                     style="width: 50px; height: 50px; object-fit: cover;" 
                                                     class="rounded">
                                            </td>
                                            <td>{{ product.name }}</td>
                                            <td>{{ product.category }}</td>
                                            <td>${{ product.price }}</td>
                                            <td>{{ product.stock }}</td>
                                            <td>
                                                <span :class="getStatusBadgeClass(product.status)">
                                                    {{ product.status }}
                                                </span>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary me-1" @click="editProduct(product)">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger" @click="deleteProduct(product.id)">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add/Edit Product Modal -->
        <div class="modal fade" :class="{ 'show d-block': showAddModal }" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveProduct">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Product Name</label>
                                        <input type="text" v-model="productForm.name" class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Category</label>
                                        <select v-model="productForm.category" class="form-select" required>
                                            <option value="">Select Category</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Clothing">Clothing</option>
                                            <option value="Home">Home & Garden</option>
                                            <option value="Sports">Sports</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Price</label>
                                        <input type="number" v-model="productForm.price" class="form-control" step="0.01" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Stock</label>
                                        <input type="number" v-model="productForm.stock" class="form-control" required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea v-model="productForm.description" class="form-control" rows="3"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Image URL</label>
                                <input type="url" v-model="productForm.image" class="form-control">
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select v-model="productForm.status" class="form-select">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                        <button type="button" class="btn btn-success" @click="saveProduct">
                            {{ editingProduct ? 'Update' : 'Add' }} Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal Backdrop -->
        <div v-if="showAddModal" class="modal-backdrop fade show"></div>
    </div>
</template>

<script>
export default {
    name: 'SellerProducts',
    data() {
        return {
            products: [],
            showAddModal: false,
            editingProduct: null,
            productForm: {
                name: '',
                category: '',
                price: '',
                stock: '',
                description: '',
                image: '',
                status: 'active'
            }
        }
    },
    mounted() {
        this.loadProducts();
    },
    methods: {
        async loadProducts() {
            try {
                // TODO: Replace with actual API call
                this.products = [
                    {
                        id: 1,
                        name: 'Sample Product 1',
                        category: 'Electronics',
                        price: 99.99,
                        stock: 50,
                        status: 'active',
                        image: 'https://via.placeholder.com/150',
                        description: 'Sample product description'
                    },
                    {
                        id: 2,
                        name: 'Sample Product 2',
                        category: 'Clothing',
                        price: 29.99,
                        stock: 25,
                        status: 'active',
                        image: 'https://via.placeholder.com/150',
                        description: 'Another sample product'
                    }
                ];
            } catch (error) {
                console.error('Error loading products:', error);
            }
        },
        
        getStatusBadgeClass(status) {
            const classes = {
                'active': 'badge bg-success',
                'inactive': 'badge bg-secondary',
                'draft': 'badge bg-warning'
            };
            return classes[status] || 'badge bg-secondary';
        },
        
        editProduct(product) {
            this.editingProduct = product;
            this.productForm = { ...product };
            this.showAddModal = true;
        },
        
        async deleteProduct(productId) {
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    // TODO: Replace with actual API call
                    this.products = this.products.filter(p => p.id !== productId);
                } catch (error) {
                    console.error('Error deleting product:', error);
                }
            }
        },
        
        async saveProduct() {
            try {
                if (this.editingProduct) {
                    // Update existing product
                    const index = this.products.findIndex(p => p.id === this.editingProduct.id);
                    if (index !== -1) {
                        this.products[index] = { ...this.editingProduct, ...this.productForm };
                    }
                } else {
                    // Add new product
                    const newProduct = {
                        id: Date.now(),
                        ...this.productForm
                    };
                    this.products.push(newProduct);
                }
                
                this.closeModal();
            } catch (error) {
                console.error('Error saving product:', error);
            }
        },
        
        closeModal() {
            this.showAddModal = false;
            this.editingProduct = null;
            this.productForm = {
                name: '',
                category: '',
                price: '',
                stock: '',
                description: '',
                image: '',
                status: 'active'
            };
        }
    }
}
</script> 