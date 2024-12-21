import request from '@/utils/request'

// 查询用户列表
export function listPost(query) {
  return request({
    url: '/forum/manage/post',
    method: 'get',
    params: query
  })
}

export function delPost(data) {
  return request({
    url: '/forum/manage/post/delete',
    method: 'delete',
    params: data
  })
}

export function recoverPost(postId) {
  return request({
    url: '/forum/manage/post/recover/' + postId,
    method: 'put'
  })
}

export function setPostBetter(postId) {
  return request({
    url: '/forum/manage/post/better/' + postId,
    method: 'put'
  })
}

export function setPostRecommend(postId) {
  return request({
    url: '/forum/manage/post/recommend/' + postId,
    method: 'put'
  })
}
