<template>
    <div class="subcategories-page">
        <CrudTable
            title="Sub Categories"
            :columns="columns"
            :items="subcategories"
            :loading="loading"
            :pagination="pagination"
            @add="showAddModal"
            @edit="showEditModal"
            @delete="handleDelete"
            @page-change="handlePageChange"
        />

        <!-- Add/Edit Modal -->
        <div class="modal fade" id="subcategoryModal" tabindex="-1" ref="subcategoryModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEditing ? 'Edit Sub Category' : 'Add Sub Category' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleSubmit">
                            <div class="mb-3">
                                <label class="form-label">Category</label>
                                <select class="form-select" v-model="formData.category_id" required>
                                    <option value="">Select Category</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">
                                        {{ category.name }}
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
    name: 'SubCategories',
    components: {
        CrudTable
    },
    setup() {
        const subcategories = ref([])
        const categories = ref([])
        const loading = ref(false)
        const pagination = ref({
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
        })
        const isEditing = ref(false)
        const formData = ref({
            id: null,
            category_id: '',
            name: '',
            description: '',
            image: null
        })
        const subcategoryModal = ref(null)
        let modal = null

        // Define columns for the table
        const columns = [
            { key: 'category_name', label: 'Category' },
            { key: 'name', label: 'Name' },
            { key: 'description', label: 'Description' },
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

        const fetchCategories = async () => {
            try {
                const response = await axios.get('/admin/categories')
                categories.value = response.data.data
            } catch (error) {
                toastService.error('Failed to fetch categories')
                console.error('Error fetching categories:', error)
            }
        }

        const fetchSubCategories = async () => {
            loading.value = true
            try {
                const response = await axios.get('/admin/sub-categories', {
                    params: {
                        page: pagination.value.currentPage
                    }
                })
                subcategories.value = response.data.data
                pagination.value = {
                    currentPage: response.data.meta.current_page,
                    totalPages: response.data.meta.last_page,
                    totalItems: response.data.meta.total
                }
            } catch (error) {
                toastService.error('Failed to fetch sub categories')
                console.error('Error fetching sub categories:', error)
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
                category_id: '',
                name: '',
                description: '',
                image: null
            }
            modal.show()
        }

        const showEditModal = (subcategory) => {
            isEditing.value = true
            formData.value = {
                id: subcategory.id,
                category_id: subcategory.category_id,
                name: subcategory.name,
                description: subcategory.description,
                image: subcategory.image
            }
            modal.show()
        }

        const handleSubmit = async () => {
            try {
                const formDataToSend = new FormData()
                formDataToSend.append('category_id', formData.value.category_id)
                formDataToSend.append('name', formData.value.name)
                formDataToSend.append('description', formData.value.description)
                if (formData.value.image instanceof File) {
                    formDataToSend.append('image', formData.value.image)
                }

                if (isEditing.value) {
                    await axios.post(`/admin/sub-categories/${formData.value.id}`, formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    toastService.success('Sub category updated successfully')
                } else {
                    await axios.post('/admin/sub-categories', formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    toastService.success('Sub category added successfully')
                }
                modal.hide()
                fetchSubCategories()
            } catch (error) {
                toastService.error('Failed to save sub category')
                console.error('Error saving sub category:', error)
            }
        }

        const handleDelete = async (subcategory) => {
            try {
                await axios.delete(`/admin/sub-categories/${subcategory.id}`)
                toastService.success('Sub category deleted successfully')
                fetchSubCategories()
            } catch (error) {
                toastService.error('Failed to delete sub category')
                console.error('Error deleting sub category:', error)
            }
        }

        const handlePageChange = (page) => {
            pagination.value.currentPage = page
            fetchSubCategories()
        }

        onMounted(() => {
            fetchCategories()
            fetchSubCategories()
            modal = new Modal(subcategoryModal.value)
        })

        return {
            subcategories,
            categories,
            loading,
            pagination,
            isEditing,
            formData,
            subcategoryModal,
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
.subcategories-page {
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