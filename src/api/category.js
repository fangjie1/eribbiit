import request from '@/utils/request'

/**
 *获取所有分类
 * @returns Promise
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 * 获取单个顶级分类信息
 * @param {String} id 顶级分类ID
 */

export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}

/**
 * 获取二级分类筛选条件数据
 * @param {String} id - 二级分类ID
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}