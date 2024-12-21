import request from '@/utils/request'


// 新增
export function addEventList(data){
    return request({
      url: '/gym/competitionEvent',
      method: 'post',
      data:data
    })
  }

//查询列表
export function getEventList(query) {
  return request({
    url: '/gym/competitionEvent/list',
    method: 'get',
    params: query
  })
}

// 删除
export function cancelEvent(data){
  return request({
    url: '/gym/competitionEvent/cancel',
    method: 'post',
    data: data
  })
}

// 修改预约的赛事
export function updateEvent(data) {
  return request({
    url: '/gym/competitionEvent',
    method: 'put',
    data: data
  })
}

// 查询近七天的赛事
export function getSevenList() {
  return request({
    url: '/gym/competitionEvent/sevenList',
    method: 'get',
  })
}