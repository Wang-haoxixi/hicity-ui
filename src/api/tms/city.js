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

export function tagEnable (data) {
  return request({
    url: '/tms/city/tag/enable',
    method: 'post',
    data
  })
}

export function addTag (data) {
  return request({
    url: '/tms/city/tag/create',
    method: 'post',
    data
  })
}

export function updateTag (data) {
  return request({
    url: '/tms/city/tag/edit',
    method: 'post',
    data
  })
}

export function deleteTag (data) {
  return request({
    url: '/tms/city/tag/delete',
    method: 'post',
    data
  })
}

export function tagOpenList (tagId) {
  return request({
    url: `/tms/city/tag/open_list/${tagId}`,
  })
}
