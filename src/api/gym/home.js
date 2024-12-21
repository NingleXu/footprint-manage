import request from '@/utils/request'


//导出营收报表
export function outputRevenueExcel(days) {
  return request({
    url: '/gym/main/revenueExcel/' + days,
    method: 'get',
    headers: {
      //这里和后端的相对应
      "Content-Type": "application/vnd.ms-excel",
    },
    responseType: "arraybuffer"
  })
}

export function getStudentIndexInfo(){
  return request({
    url: '/gym/main/student',
    method: 'get',
  })
}

export function getManagerIndexInfo() {
  return request({
    url: '/gym/main/manager',
    method: 'get',
  })
}

