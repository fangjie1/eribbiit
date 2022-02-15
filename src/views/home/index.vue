<template>

  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图-->
      <HomeBanner />
    </div>
    <!-- 新鲜好物 -->
    <HomeNew />
    <!-- 人气推荐 -->
    <HomeHot />
    <!-- 热门品牌 -->
    <HomeBrand />
    <!-- 商品区域 -->
    <HomeProduct />
    <!-- 最新专题 -->
    <HomeSpecial />
  </div>

</template>

<script>
import HomeCategory from './components/home-category'
import HomeBanner from './components/home-banner'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand'
import HomeProduct from './components/home-product'
import HomeSpecial from './components/home-special'
import { ref } from 'vue'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  },
  setup () {
    const show = ref(true)
    return { show }
  }
}
</script>

<style lang="less" scoped>
</style>
