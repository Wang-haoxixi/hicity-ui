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

export function offShelf(data) {
  return request({
    url: '/dms/recruit/off_shelf',
    method: 'post',
    data
  })
}

export function audit(data) {
  return request({
    url: '/dms/recruit/audit',
    method: 'post',
    data
  })
}