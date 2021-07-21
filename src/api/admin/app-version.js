import request from "@/router/axios";

export function saveVersion(data) {
  return request({
    url: '/admin/app_version/save',
    method: 'POST',
    data
  })
}

export function getVersionPage(params) {
  return request({
    url: '/admin/app_version/list',
    params
  })
}
