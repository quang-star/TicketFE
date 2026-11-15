<template>
  <div class="min-w-[400px] min-h-screen bg-gray-100 font-sans">
    <HeaderComponent />
    <NavBarComponent />

    <div class="container mx-auto py-12 px-4">
      <h1 class="text-4xl font-bold text-center text-gray-900 tracking-tight">
        Thanh toán đơn hàng
      </h1>

      <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div class="w-full max-w-2xl">
          <div class="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
            <h5 class="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
              🛒 Đơn hàng
            </h5>

            <div v-if="checkoutItems.length === 0" class="text-center py-10 text-gray-500">
              <p class="mb-4">Không có vé nào được chọn để thanh toán.</p>
              <router-link to="/cart" class="inline-block px-5 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                Quay lại giỏ hàng
              </router-link>
            </div>

            <template v-else>
              <div v-for="item in checkoutItems" :key="item.ticket_type_id"
                class="flex items-center mb-5 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div class="relative">
                  <img :src="item.poster_image_url || defaultThumbnail"
                    class="w-16 h-16 object-cover rounded-xl shadow-sm border" />
                  <span
                    class="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {{ item.quantity }}
                  </span>
                </div>

                <div class="flex-1 ml-4">
                  <p class="text-gray-900 font-semibold text-sm">{{ item.ticket_type_name }}</p>
                  <p class="text-gray-700 text-sm">{{ formatPrice(item.base_price) }}</p>
                  <p class="text-gray-500 text-xs">{{ item.event_name }}</p>
                </div>

                <div class="text-right text-gray-900 font-bold text-sm w-24">
                  {{ formatPrice(item.base_price * item.quantity) }}
                </div>
              </div>

              <div class="mt-6 mb-6">
                <h6 class="text-sm font-semibold text-gray-700 mb-3">Phương thức thanh toán</h6>
                <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition"
                  :class="paymentMethod === 'payos' ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-gray-50'">
                  <input type="radio" name="payment_method" value="payos" v-model="paymentMethod"
                    class="accent-green-600 w-4 h-4" />
                  <div>
                    <p class="font-semibold text-gray-900 text-sm">Thanh toán trực tuyến qua PayOS</p>
                    <p class="text-xs text-gray-500">Quét mã QR ngân hàng / chuyển khoản nhanh</p>
                  </div>
                </label>
              </div>

              <hr class="my-6">

              <div class="flex justify-between items-center mb-6">
                <strong class="text-xl text-gray-900">Tổng cộng</strong>
                <strong class="text-2xl text-green-600 font-bold">{{ formatPrice(totalValue) }}</strong>
              </div>

              <div role="alert" class="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
                <div class="flex items-start gap-3">
                  <span class="text-xl leading-none" aria-hidden="true">⚠️</span>
                  <div class="text-sm leading-relaxed">
                    <p class="font-semibold text-amber-950">
                      Cảnh báo: Dự án phục vụ học tập &amp; nghiên cứu (Phi thương mại)
                    </p>
                    <p class="mt-1 text-amber-800">
                      Hệ thống chỉ mô phỏng quy trình đặt vé phục vụ học tập và nghiên cứu, không mang tính chất thương mại. Vui lòng không thực hiện thanh toán tiền thật hoặc nhập thông tin tài chính cá nhân thật.
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row justify-between items-center gap-6 mt-6">
                <router-link to="/cart" class="text-green-700 font-semibold hover:underline text-lg">
                  ← Trở về giỏ hàng
                </router-link>

                <button @click="placeOrder" :disabled="isSubmitting"
                  class="px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 
                        hover:from-green-600 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl 
                        shadow-md font-bold transition transform hover:-translate-y-0.5 text-lg">
                  {{ isSubmitting ? 'Đang xử lý...' : 'Đặt hàng ngay' }}
                </button>
              </div>
            </template>

          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import HeaderComponent from '@/components/customers/layouts/HeaderComponent.vue'
import NavBarComponent from '@/components/customers/layouts/NavBarComponent.vue'
import { useCartStore } from '@/stores/cart'
import api from '@/config/api'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const cartStore = useCartStore()
import { useRoute } from 'vue-router'

const route = useRoute()
const returnPath = route.fullPath
const defaultThumbnail = '/images/default.jpg'

// Lấy items từ store (fallback từ sessionStorage nếu F5 trang checkout)
const checkoutItems = computed(() => cartStore.checkoutItems)

onMounted(() => {
  if (cartStore.checkoutItems.length === 0) {
    try {
      const saved = JSON.parse(sessionStorage.getItem('checkout_items') || '[]')
      if (Array.isArray(saved) && saved.length > 0) {
        cartStore.setCheckoutItems(saved)
      }
    } catch (e) {
      console.error(e)
    }
  }
})

let parsedUserInfo = {}
try {
  parsedUserInfo = JSON.parse(sessionStorage.getItem('user_info') || '{}') || {}
} catch {
  parsedUserInfo = {}
}

const user_info = ref(parsedUserInfo)
const access_token = ref(sessionStorage.getItem('access_token'))
const isSubmitting = ref(false)

// Phương thức thanh toán (mặc định PayOS)
const paymentMethod = ref('payos')

// Tổng tiền
const totalValue = computed(() =>
  checkoutItems.value.reduce((sum, i) => sum + Number(i.base_price || 0) * Number(i.quantity || 0), 0)
)

// Format giá tiền
function formatPrice(price) {
  return Number(price || 0).toLocaleString('vi-VN') + '₫'
}

// Đặt hàng
async function placeOrder() {
  if (checkoutItems.value.length === 0) {
    alert('Không có vé nào để thanh toán!')
    router.push('/cart')
    return
  }

  if (!access_token.value) {
    alert('Vui lòng đăng nhập để thanh toán!')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  if (!paymentMethod.value) {
    alert('Vui lòng chọn phương thức thanh toán!')
    return
  }

  // Chuẩn hóa items để gửi backend
  const orderItems = checkoutItems.value.map(item => ({
    ticket_type_id: item.ticket_type_id, // phải khớp với DB TicketType
    quantity: item.quantity
  }))

  const payload = {
    customer_email: user_info.value?.email ?? '',
    customer_phone: user_info.value?.phone ?? '',
    customer_address: user_info.value?.address ?? '',
    user_id: user_info.value?.id ?? null,

    payment_method: paymentMethod.value,
    items: orderItems,
    return_path: returnPath // đường dẫn để trả về sau khi thanh toán online
  }

  isSubmitting.value = true
  try {
    const res = await api.post('/create-order', payload)

    if (res.data.code === 200) {
      sessionStorage.removeItem('checkout_items')
      const checkoutUrl = res.data.data?.checkout_url

      if (checkoutUrl) {
        // Luôn redirect sang link thanh toán nếu backend trả về
        window.location.href = checkoutUrl
        return
      }

      // Nếu không có checkout_url (vd đơn miễn phí 0đ)
      alert(res.data.message || 'Đặt hàng thành công! Cảm ơn bạn đã mua hàng.')
      router.push('/my-order')
    } else {
      alert(res.data.message || 'Có lỗi xảy ra khi tạo đơn hàng')
    }
  } catch (err) {
    console.error(err)
    const msg = err?.response?.data?.message || 'Lỗi kết nối đến server. Vui lòng thử lại.'
    alert(msg)
  } finally {
    isSubmitting.value = false
  }
}
</script>
