import request from '@/utils/request'

export function getOrderList(params) {
  return request({
    url: '/points/manage/order',
    method: 'get',
    params: params
  })
}

export function  markDeliver(id){
  return request({
    url: `/points/manage/order/${id}`,
    method: 'put',
  })
}
