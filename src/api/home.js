// 定义首页需要的接口函数
import request from '@/utils/request'

export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
