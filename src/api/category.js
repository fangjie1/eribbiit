import request from '@/utils/request'

// 获取品牌数据 limit--个数
export const findAllCategory = (limit = 6) => {
  return request('/home/category/head', 'get', { limit })
}
