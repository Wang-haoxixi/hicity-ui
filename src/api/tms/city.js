import request from "@/router/axios"

export function getTagList(params) {
  return request({
    url: '/tms/city/tag/list',
    params
  })
}

