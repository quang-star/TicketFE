<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow space-y-4">
    <h4 class="text-2xl text-black font-semibold">Thông tin vé</h4>


    <div v-for="schedule in event.schedules" :key="schedule.id" class="border rounded-lg overflow-hidden mb-4">
      <!-- Header schedule -->
      <div class="flex justify-between items-center bg-gray-100 p-4">
        <div class="flex flex-col">
          <span class="font-medium text-xs text-gray-800">
            {{ formatSchedule(schedule) }}
          </span>
        </div>
      </div>


      <!-- Tickets -->
      <div class="p-4 bg-gray-50 space-y-3">
        <div v-for="ticket in event.ticket_types.filter(t => t.schedule_id === schedule.id)" :key="ticket.id"
          class="flex justify-between items-center">


          <!-- Thông tin vé -->
          <div class="flex flex-col">
            <span class="font-medium text-gray-700">{{ ticket.name }}</span>
            <span class="text-green-600 font-semibold">{{ formatPrice(ticket.base_price) }}</span>
            <span class="text-gray-500 text-xs">
              Số lượng còn lại: {{ ticket.available_quantity ?? 0 }}
            </span>
          </div>


          <!-- Chọn số lượng + Thêm vào giỏ + Mua ngay -->
          <div v-if="ticket.available_quantity > 0 && !scheduleExpired(schedule)"
            class="flex items-center space-x-2 text-green-800">


            <!-- Nút giảm số lượng -->
            <button @click="decrease(ticket)" class="px-2 py-1 bg-gray-200 rounded font-bold">-</button>


            <!-- Hiển thị số lượng -->
            <span class="w-6 text-center font-bold">{{ cart[ticket.id] ?? 1 }}</span>


            <!-- Nút tăng số lượng -->
            <button @click="increase(ticket, ticket.available_quantity)"
              class="px-2 py-1 bg-gray-200 rounded font-bold">+</button>


            <!-- Thêm vào giỏ hàng -->
            <button @click="addToCart(ticket)"
              class="flex items-center space-x-1 text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm">
              <img :src="'/images/cart.png'" class="w-4 h-4" />
              <span>Thêm vào giỏ</span>
            </button>


            <!-- Mua ngay -->
            <button @click="buyNow(ticket)"
              class="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm">
              Mua ngay
            </button>
          </div>


          <span v-else class="text-red-600 text-xs font-semibold">
            {{ scheduleExpired(schedule) ? 'Sự kiện đã kết thúc' : 'Hết vé' }}
          </span>


        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { reactive, ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart.js'
const cartStore = useCartStore()
const props = defineProps({
  event: { type: Object, default: () => ({ schedules: [], ticket_types: [] }) }
})


const user_info = ref(sessionStorage.getItem('user_info'))
const access_token = ref(sessionStorage.getItem('access_token'))


// Giỏ hàng: ticketId -> số lượng
const cart = reactive({})

// Hàm format ngày giờ
function formatSchedule(schedule) {
  const start = new Date(schedule.start_datetime)
  const end = new Date(schedule.end_datetime)
  const startTime = start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  const endTime = end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  const startDate = start.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
  return `${startTime} - ${endTime}, ${startDate}`
}


// Kiểm tra schedule hết vé
function scheduleExpired(schedule) {
  const now = new Date()
  const end = new Date(schedule.end_datetime)
  return now > end
}


// Format giá
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}


// Nút tăng số lượng
function increase(ticket, max) {
  const current = cart[ticket.id] ?? 1
  if (current < max) cart[ticket.id] = current + 1
}


// Nút giảm số lượng
function decrease(ticket) {
  const current = cart[ticket.id] ?? 1
  if (current > 1) cart[ticket.id] = current - 1
}


// Kiểm tra giá trị rỗng
function isEmpty(value) {
  return value === null || value === undefined || value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0);
}


async function addToCart(ticket) {
  const quantity = cart[ticket.id] ?? 1
  console.log("quantily: ", quantity);
  await cartStore.addToCart(ticket, quantity)
}

// Mua ngay
function buyNow(ticket) {
  const quantity = cart[ticket.id] ?? 1
  console.log(`💰 Mua ngay: ${ticket.name}, số lượng: ${quantity}`)
  alert(`Bạn chọn mua ${quantity} vé "${ticket.name}"`)
}


// Lấy tên vé theo ticketId
function getTicketName(ticketId) {
  const t = props.event.ticket_types.find(t => t.id == ticketId)
  return t ? t.name : 'Unknown'
}


// Lấy giá vé theo ticketId
function getTicketPrice(ticketId) {
  const t = props.event.ticket_types.find(t => t.id == ticketId)
  return t ? t.base_price : 0
}


// Tổng tiền
const cartTotal = computed(() => {
  let total = 0
  for (const [ticketId, quantity] of Object.entries(cart)) {
    total += getTicketPrice(ticketId) * quantity
  }
  return total
})
</script>








