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
      <div v-if="loading"
           class="loading"></div>
      <div class="none"
           v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem @on-logistics="onLogisticsOrder(item)"
                 @on-delete="onDeleteOrder(item)"
                 @on-cancel="onCancelOrder(item)"
                 @on-confirm="onConfirm(item)"
                 v-for="item in orderList"
                 :key="item.id"
                 :order="item" />
    </div>
    <XtxPagination v-if="total>0"
                   :current-page="requestParams.page"
                   :page-size="requestParams.pageSize"
                   :total="total"
                   @current-page="requestParams.page=$event" />
    <!-- 取消订单组件 -->
    <OrderCancel ref="orderCancelCom" />
    <!-- 查看物流组件 -->
    <OrderLogistics ref="logisticsOrderCom" />
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import { findOrderList, deleteOrder, confirmOrder } from '@/api/order'
import OrderCancel from './components/order-cancel.vue'
import Confirm from '@/components/lib/Confirm'
import Message from '@/components/lib/Message'
import OrderLogistics from './components/order-logistics'
export default {
  name: 'MemberOrder',
  components: {
    OrderItem,
    OrderCancel,
    OrderLogistics
  },
  setup () {
    const activeName = ref('all')

    // 查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    const orderList = ref([])
    const loading = ref(false)
    const total = ref(0)
    // 获取订单列表
    const getOrderList = () => {
      findOrderList(requestParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }
    // 筛选条件发生变化重新加载
    watch(requestParams, () => {
      loading.value = true
      getOrderList()
    }, { immediate: true })

    const tabClick = ({ index }) => {
      requestParams.page = 1
      requestParams.orderState = index
    }
    // 删除订单
    const onDeleteOrder = (item) => {
      Confirm({ text: '您确认删除该条订单吗？' }).then(() => {
        deleteOrder([item.id]).then(() => {
          Message({ text: '删除订单成功', type: 'success' })
          getOrderList()
        })
      }).catch(e => { })
    }
    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      requestParams,
      ...useCancelOrder(),
      onDeleteOrder,
      ...useConfirmOrder(),
      ...useLogisticsOrder()
    }
  }
}
// 封装逻辑-取消订单
const useCancelOrder = () => {
  const orderCancelCom = ref(null)
  const onCancelOrder = (item) => {
    orderCancelCom.value.open(item)
  }
  return { onCancelOrder, orderCancelCom }
}
// 封装逻辑-确认收货
const useConfirmOrder = () => {
  const onConfirm = (item) => {
    // item 就是你要确认收货的订单
    Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' }).then(() => {
      confirmOrder(item.id).then(() => {
        Message({ text: '确认收货成功', type: 'success' })
        // 确认收货后状态变成 待评价
        item.orderState = 4
      })
    })
  }
  return { onConfirm }
}
// 封装逻辑-查看物流
const useLogisticsOrder = () => {
  const logisticsOrderCom = ref(null)
  const onLogisticsOrder = (item) => {
    logisticsOrderCom.value.open(item)
  }
  return { onLogisticsOrder, logisticsOrderCom }
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
