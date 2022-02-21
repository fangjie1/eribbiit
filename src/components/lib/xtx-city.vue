<template>
  <div class="xtx-city"
       ref="target">
    <div class="select"
         @click="toggleDialog"
         :class="{active:visible}">
      <span class="placeholder">请选择配送地址</span>
      <span class="value"></span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option"
         v-if="visible">
      <span class="ellipsis"
            v-for="i in 24"
            :key="i">北京市</span>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
export default {
  name: 'XtxCity',
  setup () {
    // 控制展开收起,默认收起
    const visible = ref(false)
    const open = () => {
      visible.value = true
    }
    const close = () => {
      visible.value = false
    }
    const toggleDialog = () => {
      visible.value ? close() : open()
    }
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })
    // 获取城市数据
    // 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
    // 2. 何时获取？打开城市列表的时候，做个内存中缓存
    // 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
    // const getCityData = () => {
    //   // 这个位置可能有异常操作，封装成promise
    //   return new Promise((resolve, reject) => {
    //     if (window.cityData) {
    //       // 有缓存
    //       resolve(window.cityData)
    //     } else {
    //       // 无缓存
    //       const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
    //       axios.get(url).then(res => {
    //         window.cityData = res.data
    //         resolve(window.cityData)
    //       })
    //     }
    //   })
    // }
    return { visible, toggleDialog, target }
  }
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
