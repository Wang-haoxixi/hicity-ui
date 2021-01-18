import request from "@/router/axios"

export function getColumnList(param) {
  return new request({
    url: '/cms/officaial_column/page',
    param
  })
}

export function addColumn(data) {
  return new request({
    url: '/cms/officaial_column/create',
    method: 'post',
    page
  })
}

export function deleteColumn(data) {
  return new request({
    url: '/cms/officaial_column/delete',
    method: 'post',
    data
  })
}

export function updateColumn(data) {
  return new request({
    url: '/cms/officaial_column/update',
    method: 'post',
    data
  })
}