<template>
    <div class="crud-table">
        <!-- Table Header with Add Button -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">{{ title }}</h4>
            <button class="btn btn-primary" @click="$emit('add')">
                <i class="bi bi-plus-lg me-2"></i>Add New
            </button>
        </div>

        <!-- Table -->
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th v-for="column in columns" :key="column.key" :class="column.class">
                            {{ column.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td :colspan="columns.length" class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-else-if="items.length === 0">
                        <td :colspan="columns.length" class="text-center py-4">
                            No items found
                        </td>
                    </tr>
                    <tr v-for="item in items" :key="item.id">
                        <td v-for="column in columns" :key="column.key" :class="column.class">
                            <template v-if="column.key === 'actions'">
                                <button class="btn btn-sm btn-outline-primary me-2" @click="$emit('edit', item)">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(item)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </template>
                            <template v-else>
                                <span v-if="column.render" v-html="column.render(item)"></span>
                                <span v-else>{{ item[column.key] }}</span>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.totalPages > 1" class="d-flex justify-content-between align-items-center mt-4">
            <div class="text-muted">
                Showing {{ (pagination.currentPage - 1) * 10 + 1 }} to {{ Math.min(pagination.currentPage * 10, pagination.totalItems) }} of {{ pagination.totalItems }} entries
            </div>
            <nav>
                <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="handlePageChange(pagination.currentPage - 1)">
                            Previous
                        </a>
                    </li>
                    <li v-for="page in pagination.totalPages" :key="page" class="page-item" :class="{ active: page === pagination.currentPage }">
                        <a class="page-link" href="#" @click.prevent="handlePageChange(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.totalPages }">
                        <a class="page-link" href="#" @click.prevent="handlePageChange(pagination.currentPage + 1)">
                            Next
                        </a>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Delete Confirmation Modal -->
        <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this item?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="handleDelete">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Modal } from 'bootstrap'

export default {
    name: 'CrudTable',
    props: {
        title: {
            type: String,
            required: true
        },
        columns: {
            type: Array,
            required: true
        },
        items: {
            type: Array,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        pagination: {
            type: Object,
            default: () => ({
                currentPage: 1,
                totalPages: 1,
                totalItems: 0
            })
        }
    },
    emits: ['add', 'edit', 'delete', 'page-change'],
    setup(props, { emit }) {
        const deleteModal = ref(null)
        let modal = null
        let itemToDelete = null

        const confirmDelete = (item) => {
            itemToDelete = item
            modal.show()
        }

        const handleDelete = () => {
            if (itemToDelete) {
                emit('delete', itemToDelete)
                modal.hide()
                itemToDelete = null
            }
        }

        const handlePageChange = (page) => {
            if (page >= 1 && page <= props.pagination.totalPages) {
                emit('page-change', page)
            }
        }

        onMounted(() => {
            modal = new Modal(deleteModal.value)
        })

        onBeforeUnmount(() => {
            if (modal) {
                modal.dispose()
            }
        })

        return {
            deleteModal,
            confirmDelete,
            handleDelete,
            handlePageChange
        }
    }
}
</script>

<style scoped>
.crud-table {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table th {
    font-weight: 600;
    color: #495057;
}

.table td {
    vertical-align: middle;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
}

.pagination {
    margin-bottom: 0;
}

.page-link {
    color: #0d6efd;
    border: 1px solid #dee2e6;
    padding: 0.375rem 0.75rem;
}

.page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #fff;
    border-color: #dee2e6;
}
</style> 