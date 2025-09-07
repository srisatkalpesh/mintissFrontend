<template>
  <div class="card shadow p-4">
    <h4 class="mb-4">Add Hero Section</h4>

    <form @submit.prevent="createHero">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="title" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Subtitle</label>
        <input v-model="subtitle" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Image</label>
        <input type="file" @change="handleFile" class="form-control" required />
      </div>

      <div class="d-flex justify-content-end">
        <router-link to="/admin/hero-sections" class="btn btn-secondary me-2">
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
const title = ref("");
const subtitle = ref("");
const image = ref(null);

const handleFile = (e) => {
  image.value = e.target.files[0];
};

const createHero = async () => {
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("subtitle", subtitle.value);
  if (image.value) formData.append("image", image.value);

  await axios.post("/admin/hero-sections", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  router.push("/admin/hero-sections");
};
</script>
