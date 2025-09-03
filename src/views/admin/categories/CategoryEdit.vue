<template>
  <div class="card shadow p-4">
    <h4 class="mb-4">Edit Category</h4>

    <form @submit.prevent="updateCategory">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="name" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Image</label>
        <input type="file" @change="handleFile" class="form-control" />
        <div v-if="imageUrl" class="mt-3">
          <img :src="imageUrl" class="img-thumbnail" style="width:100px; height:100px; object-fit:cover;" />
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <router-link to="/admin/categories" class="btn btn-secondary me-2">
          Cancel
        </router-link>
        <button type="submit" class="btn btn-warning text-white">Update</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/axios";

const route = useRoute();
const router = useRouter();
const name = ref("");
const image = ref(null);
const imageUrl = ref(null);

const handleFile = (e) => {
  image.value = e.target.files[0];
};

const fetchCategory = async () => {
  const res = await axios.get(`/admin/categories/${route.params.id}`);
  name.value = res.data.name;
  imageUrl.value = res.data.image;
};

const updateCategory = async () => {
  const formData = new FormData();
  formData.append("name", name.value);
  if (image.value) formData.append("image", image.value);

  await axios.post(`/admin/categories/${route.params.id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  router.push("/admin/categories");
};

onMounted(fetchCategory);
</script>
