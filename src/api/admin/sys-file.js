import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/sys_file/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/sys_file',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/sys_file/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/sys_file/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/sys_file',
    method: 'put',
    data: obj
  })
}
