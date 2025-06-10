<template>
    <div class="products-page">
        <CrudTable
            title="Products"
            :columns="columns"
            :items="products"
            :loading="loading"
            :pagination="pagination"
            @add="showAddModal"
            @edit="showEditModal"
            @delete="handleDelete"
            @page-change="handlePageChange"
        />

        <!-- Add/Edit Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" ref="productModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEditing ? 'Edit Product' : 'Add Product' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleSubmit">
                            <div class="mb-3">
                                <label class="form-label">Sub Category</label>
                                <select class="form-select" v-model="formData.sub_category_id" required>
                                    <option value="">Select Sub Category</option>
                                    <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                                        {{ subcategory.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="formData.name"
                                    required
                                >
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea 
                                    class="form-control" 
                                    v-model="formData.description"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Price</label>
                                <input 
                                    type="number" 
                                    class="form-control" 
                                    v-model="formData.price"
                                    step="0.01"
                                    required
                                >
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mintiss Points</label>
                                <input 
                                    type="number" 
                                    class="form-control" 
                                    v-model="formData.mintiss"
                                    required
                                >
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Image</label>
                                <input 
                                    type="file" 
                                    class="form-control" 
                                    @change="handleImageUpload"
                                    accept="image/*"
                                >
                                <div v-if="formData.image" class="mt-2">
                                    <a :href="formData.image" target="_blank" class="image-preview">
                                        <img :src="formData.image" class="img-thumbnail" style="max-height: 100px">
                                    </a>
                                </div>
                            </div>
                            <div class="text-end">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary ms-2">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import CrudTable from '@/components/CrudTable.vue'
import toastService from '@/services/toastService'
import { Modal } from 'bootstrap'

export default {
    name: 'Products',
    components: {
        CrudTable
    },
    setup() {
        const products = ref([])
        const subcategories = ref([])
        const loading = ref(false)
        const pagination = ref({
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
        })
        const isEditing = ref(false)
        const formData = ref({
            id: null,
            sub_category_id: '',
            name: '',
            description: '',
            price: '',
            mintiss: '',
            image: null
        })
        const productModal = ref(null)
        let modal = null

        // Define columns for the table
        const columns = [
            { key: 'sub_category_name', label: 'Sub Category' },
            { key: 'name', label: 'Name' },
            { key: 'description', label: 'Description' },
            { key: 'price', label: 'Price' },
            { key: 'mintiss', label: 'Mintiss Points' },
            { 
                key: 'image', 
                label: 'Image',
                class: 'text-center',
                render: (item) => {
                    if (!item.image) return ''
                    return `<a href="${item.image}" target="_blank" class="image-link">
                        <img src="${item.image}" class="img-thumbnail" style="max-height: 50px; width: auto;">
                    </a>`
                }
            },
            { key: 'actions', label: 'Actions' }
        ]

        const fetchSubCategories = async () => {
            try {
                const response = await axios.get('/admin/sub-categories')
                subcategories.value = response.data.data
            } catch (error) {
                toastService.error('Failed to fetch sub categories')
                console.error('Error fetching sub categories:', error)
            }
        }

        const fetchProducts = async () => {
            loading.value = true
            try {
                const response = await axios.get('/admin/products', {
                    params: {
                        page: pagination.value.currentPage
                    }
                })
                products.value = response.data.data
                pagination.value = {
                    currentPage: response.data.meta.current_page,
                    totalPages: response.data.meta.last_page,
                    totalItems: response.data.meta.total
                }
            } catch (error) {
                toastService.error('Failed to fetch products')
                console.error('Error fetching products:', error)
            } finally {
                loading.value = false
            }
        }

        const handleImageUpload = (event) => {
            const file = event.target.files[0]
            if (file) {
                formData.value.image = file
            }
        }

        const showAddModal = () => {
            isEditing.value = false
            formData.value = {
                id: null,
                sub_category_id: '',
                name: '',
                description: '',
                price: '',
                mintiss: '',
                image: null
            }
            modal.show()
        }

        const showEditModal = (product) => {
            isEditing.value = true
            formData.value = {
                id: product.id,
                sub_category_id: product.sub_category_id,
                name: product.name,
                description: product.description,
                price: product.price,
                mintiss: product.mintiss,
                image: product.image
            }
            modal.show()
        }

        const handleSubmit = async () => {
            try {
                const formDataToSend = new FormData()
                formDataToSend.append('sub_category_id', formData.value.sub_category_id)
                formDataToSend.append('name', formData.value.name)
                formDataToSend.append('description', formData.value.description)
                formDataToSend.append('price', formData.value.price)
                formDataToSend.append('mintiss', formData.value.mintiss)
                if (formData.value.image instanceof File) {
                    formDataToSend.append('image', formData.value.image)
                }

                if (isEditing.value) {
                    await axios.post(`/admin/products/${formData.value.id}`, formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    toastService.success('Product updated successfully')
                } else {
                    await axios.post('/admin/products', formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    toastService.success('Product added successfully')
                }
                modal.hide()
                fetchProducts()
            } catch (error) {
                toastService.error('Failed to save product')
                console.error('Error saving product:', error)
            }
        }

        const handleDelete = async (product) => {
            try {
                await axios.delete(`/admin/products/${product.id}`)
                toastService.success('Product deleted successfully')
                fetchProducts()
            } catch (error) {
                toastService.error('Failed to delete product')
                console.error('Error deleting product:', error)
            }
        }

        const handlePageChange = (page) => {
            pagination.value.currentPage = page
            fetchProducts()
        }

        onMounted(() => {
            fetchSubCategories()
            fetchProducts()
            modal = new Modal(productModal.value)
        })

        return {
            products,
            subcategories,
            loading,
            pagination,
            isEditing,
            formData,
            productModal,
            columns,
            showAddModal,
            showEditModal,
            handleSubmit,
            handleDelete,
            handlePageChange,
            handleImageUpload
        }
    }
}
</script>

<style scoped>
.products-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 20px;
}

.img-thumbnail {
    max-width: 100%;
    height: auto;
    cursor: pointer;
    transition: transform 0.2s ease;
    object-fit: contain;
}

.img-thumbnail:hover {
    transform: scale(1.05);
}

.image-preview {
    display: inline-block;
    text-decoration: none;
}

.image-link {
    display: inline-block;
    text-decoration: none;
    cursor: pointer;
}

/* Add styles for the table */
:deep(.table) {
    width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
}

:deep(.table td) {
    vertical-align: middle;
}

:deep(.table img) {
    display: inline-block;
    max-height: 50px;
    width: auto;
    object-fit: contain;
}

:deep(.table a) {
    text-decoration: none;
    cursor: pointer;
}

:deep(.table a:hover) {
    text-decoration: none;
}
</style> 