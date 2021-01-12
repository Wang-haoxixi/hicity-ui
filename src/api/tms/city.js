import request from "@/router/axios"

export function getTagList(params) {
  return request({
    url: '/tms/city/tag/list',
    params
  })
}

export function setTagSort(data) {
  return request({
    url: '/tms/city/tag/sort',
    method: 'post',
    data
  })
}

