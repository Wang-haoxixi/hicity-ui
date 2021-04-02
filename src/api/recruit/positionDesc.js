import request from "@/router/axios";

export function getDescList(params) {
  return request({
    url: '/dms/recruit/describe/template/pc/page',
    params
  })
}

export function addDesc(data) {
  return request({
    url: '/dms/recruit/describe/template/create',
    method: 'post',
    data
  })
}

export function updateDesc(data) {
  return request({
    url: '/dms/recruit/describe/template/update',
    method: 'POST',
    data
  })
}

export function deleteDesc(data) {
  return request({
    url: '/dms/recruit/describe/template/delete',
    method: 'POST',
    data
  })
}