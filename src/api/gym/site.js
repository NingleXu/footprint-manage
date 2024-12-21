import request from '@/utils/request'

//用户出示预约信息
export function presentAppointmentInformation(id){
  return request({
    url: '/gym/site/appoint/presentAppointmentInformation/'+id,
    responseType: "blob",
    method: 'get'
  })
}

//管理员查询预约列表
export function getAppointList(query){
  return request({
    url: '/gym/site/appoint/list',
    method: 'get',
    params: query
  })
}

//取消预约
export function cancelAppointOrder(data){
  return request({
    url: '/gym/site/appoint/cancel',
    method: 'put',
    data: data
  })
}

//用户签退
export function appointSignOut(data){
  return request({
    url: '/gym/site/appoint/signOut',
    method: 'put',
    data: data
  })
}
//用户签到
export function appointSignIn(data){
  return request({
    url: '/gym/site/appoint/signIn',
    method: 'put',
    data: data
  })
}

//查看我的预约
export function getMyAppoint(){
  return request({
    url: '/gym/site/appoint/userRecord',
    method: 'get',
  })
}

//进行预约
export function siteAppoint(data){
  return request({
    url: '/gym/site/appoint',
    method: 'post',
    data: data
  })
}

//查看预先检查预约情况
export function getAppointPreView(data){
  return request({
    url: '/gym/site/appoint/preview',
    method: 'post',
    data: data
  })
}

export function getAppointBySiteType(query){
  return request({
    url: '/gym/site/appoint',
    method: 'get',
    params: query
  })
}

export function getAppointTime(){
  return request({
    url: '/gym/site/appoint/time',
    method: 'get',
  })
}

export function listSite(query) {
  return request({
    url: '/gym/site/list',
    method: 'get',
    params: query
  })
}

export function addSite(data){
  return request({
    url: '/gym/site',
    method: 'post',
    data : data
  })
}

export function listChooseType(){
  return request({
    url: '/gym/site/chooseType',
    method: 'get',
  })
}

export function getSite(siteId){
  return request({
    url: '/gym/site/'+siteId,
    method: 'get'
  })
}

export function updateSite(data) {
  return request({
    url: '/gym/site',
    method: 'put',
    data: data
  })
}


//查询
export function listSiteType(query) {
  return request({
    url: '/gym/site/type/list',
    method: 'get',
    params: query
  })
}
export function getSiteType(siteTypeId){
  return request({
    url: '/gym/site/type/'+siteTypeId,
    method: 'get'
  })
}

export function updateSiteType(data) {
  return request({
    url: '/gym/site/type',
    method: 'put',
    data: data
  })
}


export function  addSiteType(data){
  return request({
    url: '/gym/site/type',
    method: 'post',
    data : data
  })
}

export function delSiteType(siteTypeId) {
  return request({
    url: '/gym/site/type/' + siteTypeId,
    method: 'delete'
  })
}

// /gym/eventManage/event
