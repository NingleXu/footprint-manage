import request from '@/utils/request'


export function getUserCount() {
  return request({
    url: '/user/manage/userCount',
    method: 'get',
  })
}

export function getRouteCount() {
  return request({
    url: '/route/manage/routeCount',
    method: 'get',
  })
}

export function getDistanceCount() {
  return request({
    url: '/route/manage/distanceCount',
    method: 'get',
  })
}

export function getPostCount() {
  return request({
    url: '/forum/manage/postCount',
    method: 'get',
  })
}


export function getUserStats() {
  return request({
    url: '/user/manage/userStats',
    method: 'get',
  })
}

export function getRouteStats() {
  return request({
    url: '/route/manage/routeStats',
    method: 'get',
  })
}

export function getDistanceStats() {
  return request({
    url: '/route/manage/distanceStats',
    method: 'get',
  })
}

export function getPostStats() {
  return request({
    url: '/forum/manage/postStats',
    method: 'get',
  })
}


export function getPostPieStats() {
  return request({
    url: '/forum/manage/pieStats',
    method: 'get',
  })
}

export function getDistanceBarStats() {
  return request({
    url: '/route/manage/barStats',
    method: 'get',
  })
}

