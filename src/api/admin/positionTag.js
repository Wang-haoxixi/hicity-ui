import request from "@/router/axios";

export function getTagList(params) {
  return request({
    url: '/dms/recruit/lable/lable_page',
    params
  })
}

export function addTag(data) {
  return request({
    url: '/dms/recruit/lable/lable_create',
    method: 'post',
    data
  })
}

export function updateTag(data) {
  return request({
    url: '/dms/recruit/lable/lable_update',
    method: 'POST',
    data
  })
}

export function deleteTag(data) {
  return request({
    url: '/dms/recruit/lable/lable_delete',
    method: 'POST',
    data
  })
}

export function addTagType(data) {
  return request({
    url: '/dms/recruit/lable/type_create',
    method: 'POST',
    data
  })
}

export function updateTagType(data) {
  return request({
    url: '/dms/recruit/lable/type_update',
    method: 'POST',
    data
  })
}

export function getAllTagType(params) {
  return request({
    url: '/dms/recruit/lable/type_page',
    params
  })
}