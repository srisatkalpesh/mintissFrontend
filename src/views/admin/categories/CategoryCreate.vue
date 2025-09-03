<template>
  <div class="card shadow p-4">
    <h4 class="mb-4">Add Category</h4>

    <form @submit.prevent="createCategory">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="name" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Image</label>
        <input type="file" @change="handleFile" class="form-control" />
      </div>

      <div class="d-flex justify-content-end">
        <router-link to="/admin/categories" class="btn btn-secondary me-2">
          Cancel
        </router-link>
        <button type="submit" class="btn btn-success">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/axios";

const router = useRouter();
const name = ref("");
const image = ref(null);

const handleFile = (e) => {
  image.value = e.target.files[0];
};

const createCategory = async () => {
  const formData = new FormData();
  formData.append("name", name.value);
  if (image.value) formData.append("image", image.value);

  await axios.post("/admin/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  router.push("/admin/categories");
};
</script>
