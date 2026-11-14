<template>
  <div class="mx-auto bg-gray-900 p-4">
    <nav class="flex justify-center space-x-4 container">
      <RouterLink
        v-for="category in categories"
        :key="category.id"
        :to="{ path: '/search', query: { cate: category.id } }" 
        class="text-white hover:underline"
        active-class="text-green-500 font-bold"
      >
        {{ category.name }}
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/config/api';

const categories = ref([]);

const fetchCategories = async () => {
  try {
    // Gọi API lấy danh sách category từ Laravel
    const response = await api.get('/categories');
    if (response.data.code === 200) {
      categories.value = response.data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>