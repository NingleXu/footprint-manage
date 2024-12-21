import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";

// 查询用户列表
export function listRoute(query) {
  return request({
    url: '/route/manage/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getRoute(routeId) {
  return request({
    url: '/route/manage/byId/' + parseStrEmpty(routeId),
    method: 'get'
  })
}
