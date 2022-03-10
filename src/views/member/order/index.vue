<template>
  <div class="member-order">
    <XtxTabs @tab-click="tabClick"
             v-model="activeName">
      <XtxTabsPanel v-for="item in orderStatus"
                    :key="item.name"
                    :label="item.label"
                    :name="item.name"></XtxTabsPanel>
    </XtxTabs>
    <div class="order-list">
      <div v-if="true"
           class="loading"></div>
      <div class="none"
           v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem v-for="item in orderList"
                 :key="item.id"
                 :order="item" />
    </div>
    <XtxPagination />
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import { findOrderList } from '@/api/order'
export default {
  name: 'MemberOrder',
  components: {
    OrderItem
  },
  setup () {
    const activeName = ref('all')
    const orderList = ref([])
    // 查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 筛选条件发生变化重新加载
    const loading = ref(false)
    watch(requestParams, () => {
      loading.value = true
      findOrderList(requestParams).then(data => {
        orderList.value = data.result.items
        loading.value = false
      })
    }, { immediate: true })
    const tabClick = ({ index }) => {
      requestParams.page = 1
      requestParams.orderState = index
    }
    return { activeName, orderStatus, orderList, tabClick, loading }
  }
}
</script>
<style scoped lang="less">
.member-order {
  height: 100%;
}
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
