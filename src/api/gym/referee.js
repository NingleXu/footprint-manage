import request from '@/utils/request'

export function getRefereeList(){
    return request({
      url: '/gym/competitionEvent/refereeList',
      method: 'get',
    })
  }