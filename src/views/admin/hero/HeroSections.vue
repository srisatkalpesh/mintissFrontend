<template>
  <div class="p-6 m-4 bg-white rounded-lg shadow">
    <CrudTable
      title="Hero Sections"
      :columns="columns"
      :items="heroSections"
      :loading="loading"
      :pagination="pagination"
      @add="goToAdd"
      @edit="goToEdit"
      @delete="deleteHero"
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
const heroSections = ref([]);
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
});

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "subtitle", label: "Subtitle" },
  {
    key: "image",
    label: "Image",
    render: (item) =>
      item.image_url
        ? `<img src="${item.image_url}" class="img-thumbnail" style="width:80px; height:50px; object-fit:cover; border-radius:6px;" />`
        : "—",
  },
  { key: "actions", label: "Actions", class: "text-end" },
];

const fetchHeroSections = async (page = 1) => {
  loading.value = true;
  try {
    const res = await axios.get("/admin/hero-sections", { params: { page } });
    heroSections.value = res.data.data ?? res.data;
    pagination.value = {
      currentPage: res.data.current_page ?? 1,
      totalPages: res.data.last_page ?? 1,
      totalItems: res.data.total ?? res.data.length,
    };
  } finally {
    loading.value = false;
  }
};

const deleteHero = async (hero) => {
  await axios.delete(`/admin/hero-sections/${hero.id}`);
  fetchHeroSections(pagination.value.currentPage);
};

const goToAdd = () => router.push("/admin/hero-sections/create");
const goToEdit = (hero) => router.push(`/admin/hero-sections/${hero.id}/edit`);
const handlePageChange = (page) => fetchHeroSections(page);

onMounted(() => fetchHeroSections());
</script>
