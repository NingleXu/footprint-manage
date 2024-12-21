import request from '@/utils/request'

export function publishActivity(data) {
  return request({
    url: '/points/manage/activity/publish',
    method: 'post',
    data: data,
  })
}

export function listActivity(params) {
  return request({
    url: '/points/manage/activity',
    method: 'get',
    params: params,
  })
}

export function getActivityInfo(activityId) {
  return request({
    url: `/points/manage/activity/info/${activityId}`,
    method: 'get',
  })
}


// 取消活动
export function cancelActivity(activityId) {
  return request({
    url: '/points/manage/activity/' + activityId,
    method: 'put'
  })
}

export function listRecordList(params) {
  return request({
    url: '/points/manage/activity/joinList',
    method: 'get',
    params: params,
  })
}

export function activityGiftDistribute(ids, activityId) {
  return request({
    url: `/points/manage/activity/giftDistribute/` + activityId,
    method: 'post',
    data: ids,
  })
}

export function getActivityGiftDistributeRecord(activityId) {
  return request({
    url: `/points/manage/activity/distributeRecord/` + activityId,
    method: 'get',
  })
}
