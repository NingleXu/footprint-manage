import request from '@/utils/request'

//查看器材详情
export function getEquipment(equipmentId){
  return request({
    url: '/gym/equipment/'+equipmentId,
    method: 'get',
  })
}
//管理员修改器材信息
export function updateEquipment(data){
  return request({
    url: '/gym/equipment',
    method: 'put',
    data: data
  })
}
//管理员查询器材列表
export function getEquipmentList(query) {
  return request({
    url: '/gym/equipment/list',
    method: 'get',
    params: query
  })
}
// 管理员添加器材类型
export function addEquipment(data) {
  return request({
    url: '/gym/equipment',
    method: 'post',
    data: data
  })
}


