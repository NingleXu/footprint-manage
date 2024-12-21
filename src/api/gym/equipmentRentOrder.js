import request from '@/utils/request'

//用户进行补费
export function orderPendingFees(data){
  return request({
    url: '/gym/equipment/rent/pendingFees',
    method: 'post',
    data:data
  })
}

//管理员对器材进行审查
export function reviewRentEquipment(data){
  return request({
    url: '/gym/equipment/rent/review',
    method: 'post',
    data:data
  })
}

//用户归还器材
export function returnRentEquipment(data){
  return request({
    url: '/gym/equipment/rent/return',
    method: 'post',
    data:data
  })
}

//用户查看自己的租借订单
export function getUserRentOrderList(){
  return request({
    url: '/gym/equipment/rent/userList',
    method: 'get',
  })
}
//用户进行器材租借
export function equipmentRent(data){
  return request({
    url: '/gym/equipment/rent',
    method: 'post',
    data: data
  })
}
//用户查看所有可预约的器材
export function getRentableEquipmentList(query){
  return request({
    url: '/gym/equipment/rentableList',
    method: 'get',
    params: query
  })
}

//管理员查询租借
export function getEquipmentRentOrderList(query) {
  return request({
    url: '/gym/equipment/rent/list',
    method: 'get',
    params: query
  })
}
//查询租借订单详情
export function getEquipmentRentOrderInfo(orderId){
  return request({
    url: '/gym/equipment/rent/'+orderId,
    method: 'get',
  })
}
