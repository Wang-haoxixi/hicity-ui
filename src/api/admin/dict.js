import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/dict/page',
    method: 'get',
    params: query
  })
}

export function fetchItemList(query) {
  return request({
    url: '/admin/sys_dict_item/page',
    method: 'get',
    params: query
  })
}

export function addItemObj(obj) {
  return request({
    url: '/admin/dict/save_dict_item',
    method: 'post',
    data: obj
  })
}

export function delItemObj(id) {
  return request({
    url: '/admin/dict/remove_dict_item/' + id,
    method: 'post'
  })
}

export function putItemObj(obj) {
  return request({
    url: '/admin/dict/update_dict_item',
    method: 'post',
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/dict/save_dict',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/dict/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/admin/dict/remove_dict/' + row.id,
    method: 'post'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/dict/update_dict',
    method: 'post',
    data: obj
  })
}

export function remote(type) {
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get'
  })
}
