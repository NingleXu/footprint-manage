import request from '@/utils/request'

export function getLotteryPrizes() {
  return request({
    url: '/points/manage/lottery',
    method: 'get',
  })
}


export function getLotteryStatus() {
  return request({
    url: '/points/manage/lottery/status',
    method: 'get',
  })
}

export function startLottery() {
  return request({
    url: '/points/manage/lottery/start',
    method: 'put',
  })
}

export function stopLottery() {
  return request({
    url: '/points/manage/lottery/stop',
    method: 'put',
  })
}


export function updateLottery(data) {
  return request({
    url: '/points/manage/lottery/update',
    method: 'put',
    data: data

  })
}

export function getLotteryLog(query) {
  return request({
    url: '/points/manage/lottery/record',
    method: 'get',
    params: query

  })
}

export function getAccountPointsList(query) {
  return request({
    url: '/points/manage/list',
    method: 'get',
    params: query

  })
}

export function accountDisabled(id) {
  return request({
    url: `/points/manage/disabled/${id}`,
    method: 'put',
  })
}

export function accountRecover(id) {
  return request({
    url: `/points/manage/recover/${id}`,
    method: 'put',
  })
}

export function getAccountPointsHistory(query, id) {
  return request({
    url: `/points/manage/history/${id}`,
    method: 'get',
    params: query

  })
}
