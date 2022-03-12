<template>
  <div class="member-order"
       v-if="order">
    <!-- 头部 -->
    <OrderDetailAction :order="order" />
    <!-- 进度 -->
    <DetailStep :order="order" />
    <!-- 物流 -->
    <suspense>
      <template #default>
        <DetailLogistics v-if="[3,4,5].includes(order.orderState)"
                         :order="order" />
      </template>
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
    </suspense>
    <!--  -->
    <OrderInfo :order="order" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
import OrderDetailAction from './components/detail-action'
import DetailStep from './components/detail-step'
import DetailLogistics from './components/detail-logistics'
import OrderInfo from './components/detail.info.vue'
export default {
  name: 'OrderDetailPage',
  components: {
    OrderDetailAction,
    DetailStep,
    DetailLogistics,
    OrderInfo
  },
  setup () {
    const order = ref(null)
    const route = useRoute()
    findOrder(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }
}
</script>

<style>
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
