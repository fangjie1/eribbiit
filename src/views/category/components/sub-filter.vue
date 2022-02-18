<template>
  <!-- 筛选区 -->
  <div class="sub-filter"
       v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a @click="changeBrand(brand.id)"
           :class="{active:filterData.selectedBrand===brand.id}"
           href="javascript:;"
           v-for="brand in filterData.brands"
           :key="brand.id">{{brand.name}}</a>
      </div>
    </div>
    <div class="item"
         v-for="item in filterData.saleProperties"
         :key="item.id">
      <div class="head">{{item.name}}：</div>
      <div class="body">
        <a @click="changeProp(item,prop.id)"
           :class="{active:item.selectedProp===prop.id}"
           href="javascript:;"
           v-for="prop in item.properties"
           :key="prop.id">{{prop.name}}</a>
      </div>
    </div>
  </div>
  <div v-else
       class="sub-filter">
    <XtxSkeleton class="item"
                 width="800px"
                 height="40px" />
    <XtxSkeleton class="item"
                 width="800px"
                 height="40px" />
    <XtxSkeleton class="item"
                 width="600px"
                 height="40px" />
    <XtxSkeleton class="item"
                 width="600px"
                 height="40px" />
    <XtxSkeleton class="item"
                 width="600px"
                 height="40px" />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (prop, { emit }) {
    const route = useRoute()
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoading.value = true
        newVal && findSubCategoryFilter(route.params.id).then(({ result }) => {
          // 品牌全部
          result.selectedBrand = null
          result.brands.unshift({ id: null, name: '全部' })
          // 销售属性全部
          result.saleProperties.forEach(item => {
            item.selectedProp = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          filterData.value = result
          filterLoading.value = false
        })
      }
    }, { immediate: true })
    // 获取筛选参数
    const getFilterParams = () => {
      const obj = { brandId: null, attrs: [] }
      obj.brandId = filterData.value.selectedBrand
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }
    // 选择品牌
    const changeBrand = (brandId) => {
      if (filterData.value.selectedBrand === brandId) return
      filterData.value.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }
    // 选中属性
    const changeProp = (item, propId) => {
      if (item.selectedProp === propId) return
      item.selectedProp = propId
      emit('filter-change', getFilterParams())
    }
    return { filterData, filterLoading, changeBrand, changeProp }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
.xtx-skeleton {
}
</style>
