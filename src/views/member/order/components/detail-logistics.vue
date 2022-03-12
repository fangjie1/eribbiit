<template>
  <div class="detail-logistics">
    <p>
      <span>{{list[0].text}}</span>
      <span>{{list[0].time}}</span>
    </p>
    <a @click="onLogisticsOrder(order)"
       href="javascript:;">查看物流</a>
    <!-- 将OrderLogistics传送至body标签的直接子节点上 -->
    <teleport to='#model'>
      <OrderLogistics ref="logisticsOrderCom" />
    </teleport>
  </div>
</template>
<script>
import { logisticsOrder } from '@/api/order'
import { ref } from 'vue'
import OrderLogistics from './order-logistics'
import { useLogisticsOrder } from '../index'
export default {
  name: 'DetailLogistics',
  components: {
    OrderLogistics
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  async setup (props) {
    const data = await logisticsOrder(props.order.id)
    const list = ref(data.result.list)
    return { list, ...useLogisticsOrder() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
