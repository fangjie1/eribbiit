import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
/**
 *
 * @param {Element} target -Dom对象
 * @param {Function} apiFn -API函数
 */
export const useLazyData = (apiFn) => {
  const target = ref(null)
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        // 调用API获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    }, {
      threshold: 0
    }
  )
  // 返回--->数据（dom,后台数据）
  return { result, target }
}
