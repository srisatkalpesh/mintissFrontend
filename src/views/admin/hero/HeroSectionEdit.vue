<template>
  <div class="card shadow p-4">
    <h4 class="mb-4">Edit Hero Section</h4>

    <form @submit.prevent="updateHero">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="title" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Subtitle</label>
        <input v-model="subtitle" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Current Image</label>
        <div v-if="imageUrl" class="mb-2">
          <img
            :src="imageUrl"
            alt="Hero Image"
            class="rounded"
            style="width: 200px; height: auto; object-fit: cover;"
          />
        </div>
        <input type="file" @change="handleFile" class="form-control" />
      </div>

      <div class="d-flex justify-content-end">
        <router-link to="/admin/hero-sections" class="btn btn-secondary me-2">
          Cancel
        </router-link>
        <button type="submit" class="btn btn-success">Update</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "@/axios";

const router = useRouter();
const route = useRoute();

const id = route.params.id;
const title = ref("");
const subtitle = ref("");
const image = ref(null);
const imageUrl = ref("");

const handleFile = (e) => {
  image.value = e.target.files[0];
};

const fetchHero = async () => {
  const res = await axios.get(`/admin/hero-sections/${id}`);
  title.value = res.data.title;
  subtitle.value = res.data.subtitle;
  imageUrl.value = res.data.image_url;
};

const updateHero = async () => {
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("subtitle", subtitle.value);
  if (image.value) formData.append("image", image.value);

  await axios.post(`/admin/hero-sections/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  router.push("/admin/hero-sections");
};

onMounted(() => fetchHero());
</script>
