import request from '@/utils/request'


export function getGiftList(params) {
  return request({
    url: '/points/manage/gift',
    method: 'get',
    params: params
  })
}

export function addGift(gift) {
  return request({
    url: '/points/manage/gift',
    method: 'post',
    data: gift
  })
}

export function getGiftInfo(id) {
  return request({
    url: `/points/manage/gift/${id}`,
    method: 'get',
  })
}

export function disabledGift(id) {
  return request({
    url: `/points/manage/gift/${id}`,
    method: 'delete',
  })
}

export function deleteGift(ids) {
  return request({
    url: `/points/manage/gift/delete/${ids}`,
    method: 'delete',
  })
}

export function recoverGift(id) {
  return request({
    url: `/points/manage/gift/${id}`,
    method: 'put',
  })
}

export function updateGift(data) {
  return request({
    url: `/points/manage/gift`,
    method: 'put',
    data: data,
  })
}
