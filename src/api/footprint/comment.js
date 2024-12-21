import request from '@/utils/request'

export function listComment(query) {
  return request({
    url: '/forum/manage/comment',
    method: 'get',
    params: query
  })
}

export function delComment(data) {
  return request({
    url: '/forum/manage/comment/delete',
    method: 'delete',
    params: data
  })
}

export function recoverComment(commentId) {
  return request({
    url: '/forum/manage/comment/recover/' + commentId,
    method: 'put'
  })
}
