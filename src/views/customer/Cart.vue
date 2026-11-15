<template>
  <div class="min-w-[400px] min-h-screen bg-gray-100 font-sans">
    <HeaderComponent />
    <NavBarComponent />

    <div class="flex flex-col flex-1 min-h-0 container mx-auto p-4">
      <main class="flex-1 overflow-auto container mx-auto pb-32 p-4">

        <h2 class="text-2xl font-bold mb-6 text-gray-800">🛒 Giỏ hàng</h2>

        <div class="bg-white rounded-xl shadow-lg p-5 border border-gray-200">

          <div class="grid grid-cols-12 font-semibold text-gray-600 border-b pb-3 text-sm">
            <div class="col-span-1 text-center">
              <input type="checkbox" v-model="checkAll" @change="toggleCheckAll" />
            </div>
            <div class="col-span-4">Sản phẩm</div>
            <div class="col-span-2 text-center">Đơn giá</div>
            <div class="col-span-2 text-center">Số lượng</div>
            <div class="col-span-2 text-center">Thành tiền</div>
            <div class="col-span-1 text-center">Xoá</div>
          </div>

          <div v-if="cartStore.items.length === 0" class="text-center py-10 text-gray-500">
             Giỏ hàng của bạn đang trống.
          </div>

          <div 
            v-else
            v-for="(item, ticketId) in cartStore.items" 
            :key="ticketId"
            :class="[
              'grid grid-cols-12 items-center py-4 border-b last:border-none transition hover:bg-gray-50',
              isExpired(item) ? 'text-gray-400 bg-gray-100 opacity-70' : ''
            ]"
          >
            <div class="col-span-1 text-center">
              <input type="checkbox" v-model="item.checked" :disabled="isExpired(item)" />
            </div>

            <div class="col-span-4 flex gap-3 min-w-0">
              <img 
                :src="item.poster_image_url || '/images/default.jpg'" 
                class="w-20 h-20 object-cover rounded-md shadow-sm shrink-0"
              />
              <div class="space-y-1 min-w-0 flex-1">
                <p class="font-semibold text-gray-800 truncate">{{ item.ticket_type_name }}</p>
                <p class="text-sm text-gray-500 line-clamp-1">{{ item.event_name }}</p>

                <p class="text-xs text-gray-600" v-if="!isExpired(item)">
                  {{ formatDateTime(item.start_datetime) }} - {{ formatDateTime(item.end_datetime) }}
                </p>

                <p class="text-xs font-bold text-red-600" v-if="isExpired(item)">
                  Sự kiện đã kết thúc
                </p>

                <p v-if="item.description" class="text-xs text-gray-500 line-clamp-2 break-words">
                  {{ stripHtml(item.description) }}
                </p>
              </div>
            </div>

            <div 
              class="col-span-2 text-center font-medium" 
              :class="isExpired(item) ? 'text-gray-400' : 'text-red-500'"
            >
              {{ formatCurrency(item.base_price) }}
            </div>

            <div class="col-span-2 flex justify-center items-center gap-2">
              <button 
                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition" 
                @click="decrease(item)" 
                :disabled="isExpired(item)"
              >
                -
              </button>

              <span class="w-8 text-center font-semibold text-gray-700">
                {{ item.quantity }}
              </span>

              <button 
                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition" 
                @click="increase(item)" 
                :disabled="isExpired(item)"
              >
                +
              </button>
            </div>

            <div 
              class="col-span-2 text-center font-bold" 
              :class="isExpired(item) ? 'text-gray-400' : 'text-orange-600'"
            >
              {{ formatCurrency(item.base_price * item.quantity) }}
            </div>

            <div class="col-span-1 text-center">
              <button 
                class="text-red-600 hover:text-red-800 text-lg"
                @click="removeItem(item.ticket_type_id)"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </main>

      <div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[1460px] bg-white shadow-lg rounded-xl p-4 mt-4 flex justify-between items-center border border-gray-200" v-if="cartStore.items.length > 0">
        <div class="flex items-center gap-3 text-gray-700">
          <input type="checkbox" v-model="checkAll" @change="toggleCheckAll" />
          <p>Chọn tất cả ({{ cartStore.items.length }})</p>
        </div>

        <div class="text-right">
          <p class="text-gray-600 text-sm">Tổng cộng:</p>
          <p class="text-3xl font-bold text-red-600">
            {{ formatCurrency(totalPrice) }}
          </p>

          <button 
            class="mt-2 bg-orange-500 text-white px-6 py-2 rounded-lg shadow hover:bg-orange-600 transition"
            @click="checkout"
          >
            Mua hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeaderComponent from '@/components/customers/layouts/HeaderComponent.vue'
import NavBarComponent from '@/components/customers/layouts/NavBarComponent.vue'
import { useCartStore } from '@/stores/cart'
import { useRouter, useRoute } from 'vue-router'
import Swal from 'sweetalert2' // Import thư viện thông báo

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

// checkbox chọn tất cả
const checkAll = ref(false)

const toggleCheckAll = () => {
  cartStore.items.forEach(item => {
    if (!isExpired(item)) item.checked = checkAll.value
  })
}

// tính tổng tiền các item được chọn
const totalPrice = computed(() => {
  return cartStore.items
    .filter(i => i.checked && !isExpired(i))
    .reduce((sum, i) => sum + i.base_price * i.quantity, 0)
})

// tăng / giảm số lượng
const increase = (item) => { if(!isExpired(item)) item.quantity++ }
const decrease = (item) => { if(!isExpired(item) && item.quantity > 1) item.quantity-- }

// format tiền
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)

// format ngày giờ
const formatDateTime = (datetime) => {
  return new Date(datetime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}

// kiểm tra sự kiện đã hết
const isExpired = (item) => {
  return new Date(item.end_datetime) < new Date()
}

// checkout
const checkout = () => {
  const selected = cartStore.items.filter(i => i.checked && !isExpired(i))

  if (selected.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Chưa chọn vé',
      text: 'Vui lòng chọn ít nhất một vé để thanh toán!',
    })
    return
  }

  cartStore.setCheckoutItems(selected)
  router.push('/checkout')
}

// Xóa item
const removeItem = (ticketId) => {
  Swal.fire({
    title: 'Xoá sản phẩm?',
    text: "Bạn có chắc muốn xoá vé này khỏi giỏ hàng?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xoá',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.isConfirmed) {
      cartStore.removeFromCart(ticketId)
      Swal.fire('Đã xoá!', 'Sản phẩm đã được xoá khỏi giỏ hàng.', 'success')
    }
  })
}

// --- LOGIC XỬ LÝ PAYOS RETURN ---
const handlePaymentStatus = async () => {
    const { status, id, message } = route.query;

    // Nếu không có status trên URL thì không làm gì cả
    if (!status) return;

    // 1. Trường hợp THÀNH CÔNG
    if (status === 'success') {
        await Swal.fire({
            icon: 'success',
            title: 'Thanh toán thành công!',
            text: `Đơn hàng #${id} của bạn đã được xác nhận.`,
            confirmButtonText: 'Xem vé của tôi'
        }).then((result) => {
             // Nếu user bấm "Xem vé của tôi", chuyển hướng sang trang My Tickets
             if (result.isConfirmed) {
                 router.push('/my-order'); 
             }
        });
        
        // Vì backend đã xóa các vé đã mua, ta cần init lại để cập nhật list mới nhất (rỗng)
        await cartStore.init(); 
    } 
    
    // 2. Trường hợp THẤT BẠI
    else if (status === 'failed') {
        Swal.fire({
            icon: 'error',
            title: 'Thanh toán thất bại',
            text: 'Giao dịch bị từ chối hoặc gặp lỗi. Vui lòng thử lại.',
            confirmButtonText: 'Đã hiểu'
        });
    }
    
    // 3. Trường hợp HỦY (Cancelled)
    else if (status === 'cancelled') {
        Swal.fire({
            icon: 'info',
            title: 'Đã huỷ thanh toán',
            text: 'Bạn đã huỷ giao dịch này.',
            timer: 3000,
            showConfirmButton: false
        });
    }

    // 4. Trường hợp LỖI HỆ THỐNG
    else if (status === 'error') {
        Swal.fire({
            icon: 'warning',
            title: 'Lỗi',
            text: message || 'Có lỗi xảy ra trong quá trình xử lý.',
        });
    }

    // Sau khi hiện thông báo xong, xoá query params trên URL để User F5 không bị hiện lại popup
    router.replace({ path: route.path });
};

const stripHtml = (html) => {
  if (!html) return '';
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
  }
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

// --- ON MOUNTED ---
onMounted(async () => {
  // 1. Kiểm tra URL xem có phải trả về từ PayOS không
  await handlePaymentStatus();

  // 2. Load dữ liệu giỏ hàng mới nhất từ server
  // Nếu vừa thanh toán thành công, server sẽ trả về list đã trừ các vé đã mua
  await cartStore.init();

  // 3. Mặc định check tất cả (nếu còn hàng)
  if (cartStore.items.length > 0) {
     checkAll.value = true;
     cartStore.items.forEach(item => item.checked = true);
  }
})

</script>