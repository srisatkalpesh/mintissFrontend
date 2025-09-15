<template>
  <div class="categories-page">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <i class="bi bi-tags-fill me-3"></i>
            Categories Management
          </h1>
          <p class="page-subtitle">Manage product categories and their images</p>
        </div>
      </div>
    </div>

    <div class="content-section">
      <CrudTable
        title=""
        :columns="columns"
        :items="categories"
        :loading="loading"
        :pagination="pagination"
        @add="goToAdd"
        @edit="goToEdit"
        @delete="deleteCategory"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/axios";
import CrudTable from "@/components/CrudTable.vue";
import loaderService from "@/services/loaderService";

const router = useRouter();

const loading = ref(false);
const categories = ref([]);
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
});

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "image",
    label: "Image",
    render: (item) =>
      item.image
        ? `<img src="${item.image}" class="img-thumbnail" style="width:60px; height:60px; object-fit:cover; border-radius:6px;" />`
        : "—",
  },
  { key: "actions", label: "Actions", class: "text-end" },
];

const fetchCategories = async (page = 1) => {
  try {
    const res = await loaderService.withLoader(
      () => axios.get("/admin/categories", { params: { page } }),
      'Loading categories...'
    );
    categories.value = res.data.data ?? res.data; // support paginated or non-paginated
    pagination.value = {
      currentPage: res.data.current_page ?? 1,
      totalPages: res.data.last_page ?? 1,
      totalItems: res.data.total ?? res.data.length,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const deleteCategory = async (category) => {
  try {
    await loaderService.withLoader(
      () => axios.delete(`/admin/categories/${category.id}`),
      'Deleting category...'
    );
    fetchCategories(pagination.value.currentPage);
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};

const goToAdd = () => router.push("/admin/categories/create");
const goToEdit = (category) => router.push(`/admin/categories/${category.id}/edit`);
const handlePageChange = (page) => fetchCategories(page);

onMounted(() => fetchCategories());
</script>

<style scoped>
.categories-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.title-section {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

/* Content Section */
.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .content-section {
    padding: 0 1rem 2rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
