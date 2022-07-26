import request from '@/utils/request'
function getCategory(Cid = 1, id) {
  return request({
    url: `/admin/product/getCategory${Cid === 1 ? Cid : Cid + '/' + id}`,
    method: 'get'
  })
}
function getAttrs(form) {
  return request({
    url: `/admin/product/attrInfoList/${form.id1}/${form.id2}/${form.id3}`,
    method: 'get'
  })
}
function deleteAttr(Cid, id) {
  return request({
    url: `/admin/product/deleteAttr/${id}`,
    method: 'delete'
  })
}
function addOrUpdateAttr(data) {
  return request({
    url: `/admin/product/saveAttrInfo`,
    method: 'post',
    data
  })
}
export default { getCategory, getAttrs, deleteAttr, addOrUpdateAttr }
