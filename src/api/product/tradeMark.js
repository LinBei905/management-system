import request from '@/utils/request'
function getPageList(page, limit = 5) {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })
}
function deleteMark(id) {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}
function addOrUpdate(data) {
  if (data.id) {
    return request({
      url: `/admin/product/baseTrademark/update`,
      method: 'put',
      data
    })
  } else {
    return request({
      url: `/admin/product/baseTrademark/save`,
      method: 'post',
      data
    })
  }
}
function getTrademarkList() {
  return request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: 'get'
  })
}
export default { getPageList, deleteMark, addOrUpdate, getTrademarkList }
