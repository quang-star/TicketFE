<template>
  <RouterView />
  <FooterComponent v-if="showPublicFooter" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import FooterComponent from '@/components/customers/layouts/FooterComponent.vue'

const route = useRoute()

const showPublicFooter = computed(() => {
  return !route.path.startsWith('/admin') && !route.path.startsWith('/organizer')
})
</script>
