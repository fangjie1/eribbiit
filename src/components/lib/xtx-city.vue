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
      <div v-if="loading"
           class="loading"></div>
      <span class="ellipsis"
            v-for="item in currList"
            :key="item.code"
            v-else>{{item.name}}</span>
    </div>
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  setup () {
    // 控制展开收起,默认收起
    const visible = ref(false)
    const open = () => {
      visible.value = true
      // 获取地区数据
      loading.value = true
      getCityData().then(data => {
        allCityData.value = data
        loading.value = false
      })
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
    const allCityData = ref([])
    const loading = ref(false)
    // 获取城市数据
    const getCityData = () => {
      // 这个位置可能有异常操作，封装成promise
      return new Promise((resolve, reject) => {
        if (window.cityData) {
          // 有缓存
          resolve(window.cityData)
        } else {
          // 无缓存
          const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
          axios.get(url).then(res => {
            window.cityData = res.data
            resolve(window.cityData)
          })
        }
      })
    }
    const currList = computed(() => {
      // 默认省一级
      const list = allCityData.value
      return list
    })
    return { visible, toggleDialog, target, loading, currList }
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
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
