import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

export function manageList(query) {
  return request({
    url: '/admin/user/manager_page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/delete/' + id,
    method: 'post',
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data: obj
  })
}

export function getDetails(obj) {
  return request({
    url: '/admin/user/details/' + obj,
    method: 'get'
  })
}

export function updateRole (data) {
  return request({
    url: '/admin/user/edit/role',
    method: 'post',
    data
  })
}

export function getAllUser(params) {
  return request({
    url: '/admin/user/user_list/by_name',
    method: 'get',
    params
  })
}
