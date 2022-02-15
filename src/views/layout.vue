<template>
  <div>
    <AppTopnav />
    <AppHeaderSticky />
    <AppHeader />
    <main class="app-body">
      <!-- 二级路由 -->
      <router-view></router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppTopnav from '@/components/app-topbar'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppTopnav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  // 获取下分类数据
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped lang='less'>
.app-body {
  min-height: 600px;
}
</style>
