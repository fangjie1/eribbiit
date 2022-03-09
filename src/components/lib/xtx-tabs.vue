<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // 数据双向绑定
    const activeName = useVModel(props, 'modelValue', emit)
    // 给每个panel传当前激活的面板
    provide('activeName', activeName)
    // 点击选项卡触发函数
    const tabClick = (name, index) => {
      activeName.value = name
      emit('tab-click', { name, index })
    }
    return { activeName, tabClick }
  },
  render () {
    const panels = this.$slots.default()
    const dynamicPanels = []
    panels.forEach(item => {
      // 静态
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item)
      } else {
        // 动态
        item.children.forEach(com => {
          dynamicPanels.push(com)
        })
      }
    })
    const nav = <nav>
      {dynamicPanels.map((item, i) => {
        return <a onClick={() => this.tabClick(item.props.name, i)} class={{ active: item.props.name === this.activeName }} href="javascript:;">{item.props.label}</a>
      })}
    </nav>
    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
  // 返回的内容回进行渲染
  // 1.在babel插件下可以在vue中写jsx语法
  // 2.数据的使用
  // const name = 'tom'
  // const title = 'tom 12'
  // // 3.事件绑定
  // // 4.定义一个jsx对象
  // const sub = [<sub>123</sub>, <sub>123</sub>]
  // const say = () => { console.log('111') }
  // return <h1 title={title} onClick={say}>{name}{sub}</h1>
}
</script>
<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
