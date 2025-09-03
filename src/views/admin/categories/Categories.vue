<template>
  <div class="p-6 m-4 bg-white rounded-lg shadow">
    <CrudTable
      title="Categories"
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/axios";
import CrudTable from "@/components/CrudTable.vue";

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
  loading.value = true;
  try {
    const res = await axios.get("/admin/categories", { params: { page } });
    categories.value = res.data.data ?? res.data; // support paginated or non-paginated
    pagination.value = {
      currentPage: res.data.current_page ?? 1,
      totalPages: res.data.last_page ?? 1,
      totalItems: res.data.total ?? res.data.length,
    };
  } finally {
    loading.value = false;
  }
};

const deleteCategory = async (category) => {
  await axios.delete(`/admin/categories/${category.id}`);
  fetchCategories(pagination.value.currentPage);
};

const goToAdd = () => router.push("/admin/categories/create");
const goToEdit = (category) => router.push(`/admin/categories/${category.id}/edit`);
const handlePageChange = (page) => fetchCategories(page);

onMounted(() => fetchCategories());
</script>
