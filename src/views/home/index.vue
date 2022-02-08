<template>
  <div class="container">
    <HomeCategory />
  </div>
</template>

<script>
import HomeCategory from './components/home-category'
export default {
  name: 'HomePage',
  components: {
    HomeCategory
  }
}
</script>

<style lang="less" scoped>
.container {
  // .hoverShadow();
  // color: @xtxColor;
}
</style>
