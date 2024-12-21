import request from '@/utils/request'

//删除公告
export function deleteNotice(noticeIds){
  return request({
    url: '/gym/notice/'+noticeIds,
    method: 'delete',
  })
}
//查看公告详情
export function getNoticeInfo(noticeId){
  return request({
    url: '/gym/notice/'+noticeId,
    method: 'get',
  })
}
//管理员修改器材信息
export function updateNotice(data){
  return request({
    url: '/gym/notice',
    method: 'put',
    data: data
  })
}
//管理员查询器材列表
export function getNoticeList(query) {
  return request({
    url: '/gym/notice/list',
    method: 'get',
    params: query
  })
}
// 管理员添加器材类型
export function addNotice(data) {
  return request({
    url: '/gym/notice',
    method: 'post',
    data: data
  })
}


