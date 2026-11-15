<template>
  <div
    v-if="visible"
    role="status"
    class="bg-amber-100 text-amber-900 border-b border-amber-200 text-xs sm:text-sm"
  >
    <div class="container mx-auto px-4 py-2 flex items-center justify-between gap-3">
      <p class="flex items-center gap-2 leading-snug">
        <span aria-hidden="true">⚠️</span>
        <span>
          <strong class="font-semibold text-amber-950">Lưu ý:</strong> Đây là dự án phục vụ mục đích
          <strong class="font-semibold text-amber-950">học tập &amp; nghiên cứu</strong>,
          không mang tính chất thương mại. Mọi sự kiện, vé và giao dịch hiển thị chỉ mang tính minh họa.
        </span>
      </p>

      <button
        type="button"
        @click="dismiss"
        aria-label="Đóng thông báo"
        class="shrink-0 rounded px-2 py-0.5 text-amber-800 hover:text-amber-950 hover:bg-amber-200/70 transition font-bold cursor-pointer"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const STORAGE_KEY = 'dismiss_study_notice_banner'
const visible = ref(sessionStorage.getItem(STORAGE_KEY) !== '1')

function dismiss() {
  visible.value = false
  sessionStorage.setItem(STORAGE_KEY, '1')
}
</script>
