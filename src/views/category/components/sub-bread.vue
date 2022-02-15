<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <Transition name="fade-right"
                mode="out-in">
      <XtxBreadItem v-if="category.top"
                    :to="`/category/${category.top.id}`">{{category.top.name}}</XtxBreadItem>
    </Transition>
    <Transition name="fade-right"
                mode="out-in">
      <XtxBreadItem v-if="category.sub"
                    :key="category.sub.id">{{category.sub.name}}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>

<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'SubCategory',
  setup () {
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      console.log(cate)
      return cate
    })
    return { category }
  }
}
</script>
