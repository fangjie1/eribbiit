import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 导出基准地址，原因：其他地方不是通过axios发请求的地方用上基准地址4
// export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net'
export const baseURL = 'http://pcapi-xiaotuxian-front.itheima.net'
const instance = axios.create({
  // axios 的一些配置，baseURL  timeout
  baseURL

})
instance.interceptors.request.use(config => {
  const { profile } = store.state.user
  // 2. 判断是否有token
  if (profile.token) {
    // 3. 设置token
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})
instance.interceptors.response.use(res => res.data, err => {
  if (err.response && err.response.status === 401) {
    // 1. 清空无效用户信息
    // 2. 跳转到登录页
    // 3. 跳转需要传参（当前路由地址）给登录页码
    store.commit('user/setUser', {})
    // 当前路由地址
    // 组件里头：`/user?a=10` $route.path === /user  $route.fullPath === /user?a=10
    // js模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 是ref响应式数据
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // encodeURIComponent 转换uri编码，防止解析地址出问题
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 请求工具函数
export default (url, method = 'get', submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
