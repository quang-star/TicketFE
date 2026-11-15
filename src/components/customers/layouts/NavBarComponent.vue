<template>
  <div class="mx-auto bg-gray-900 p-4">
    <nav class="flex justify-center space-x-4 container">
      <span v-if="loading" class="text-sm text-gray-400">
        Đang tải danh mục...
      </span>
      <span v-else-if="error" class="text-sm text-red-400">
        Không thể tải danh mục sự kiện.
      </span>
      <span v-else-if="categories.length === 0" class="text-sm text-gray-400">
        Hiện chưa có danh mục sự kiện.
      </span>
      <template v-else>
        <RouterLink
          v-for="category in categories"
          :key="category.id"
          :to="{ path: '/search', query: { cate: category.id } }" 
          class="text-white hover:underline"
          active-class="text-green-500 font-bold"
        >
          {{ category.name }}
        </RouterLink>
      </template>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/config/api';

const categories = ref([]);
const loading = ref(true);
const error = ref(false);

const fetchCategories = async () => {
  loading.value = true;
  error.value = false;
  try {
    // Gọi API lấy danh sách category từ Laravel
    const response = await api.get('/categories');
    if (response.data && response.data.code === 200) {
      categories.value = Array.isArray(response.data.data) ? response.data.data : [];
    } else {
      categories.value = [];
      error.value = true;
    }
  } catch (err) {
    console.error(err);
    categories.value = [];
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});
</script>