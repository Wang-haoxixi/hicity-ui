import request from "@/router/axios";

export function getPositionList(data) {
  return request({
    url: '/dms/recruit/pc_page',
    method: 'post',
    data
  })
}

export function getPositionDetail(params) {
  return request({
    url: '/dms/recruit/detail',
    params
  })
}