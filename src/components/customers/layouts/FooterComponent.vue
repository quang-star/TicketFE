<template>
  <footer class="bg-gray-900 text-gray-300 border-t border-gray-800">
    <div class="container mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <router-link to="/" class="inline-block text-2xl font-bold text-green-500">
            ticket
          </router-link>
          <p class="mt-3 text-sm text-gray-400 leading-relaxed">
            Hệ thống mô phỏng đặt vé và quản lý sự kiện trực tuyến được xây dựng cho đồ án học phần Thương mại điện tử.
          </p>
        </div>

        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-white mb-3">
            Điều hướng nhanh
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/" class="hover:text-green-400 transition">Trang chủ</router-link>
            </li>
            <li>
              <router-link to="/search" class="hover:text-green-400 transition">Tìm kiếm sự kiện</router-link>
            </li>
            <li>
              <router-link to="/my-order" class="hover:text-green-400 transition">Vé của tôi</router-link>
            </li>
            <li>
              <router-link to="/organizer/create-event" class="hover:text-green-400 transition">Tạo sự kiện</router-link>
            </li>
          </ul>
        </div>

        <div class="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4">
          <h3 class="text-sm font-semibold text-amber-300 flex items-center gap-2">
            <span aria-hidden="true">⚠️</span>
            <span>Tuyên bố miễn trừ trách nhiệm</span>
          </h3>
          <p class="mt-2 text-xs text-amber-100/90 leading-relaxed">
            Đây là dự án phục vụ mục đích <strong>học tập và nghiên cứu</strong>,
            <strong>không mang tính chất thương mại</strong>. Mọi thông tin sự kiện, hình ảnh,
            giá vé và giao dịch thanh toán trên website chỉ mang tính chất minh họa, không phát sinh mua bán thực tế.
          </p>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <span>© {{ currentYear }} Ticket Study Project.</span>
        <span>Phục vụ học tập &amp; nghiên cứu • Phi thương mại</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
