import request from "@/router/axios"

export function getColumnList(params) {
  return new request({
    url: '/cms/official_column/page',
    params
  })
}

export function addColumn(data) {
  return new request({
    url: '/cms/official_column/create',
    method: 'post',
    data
  })
}

export function deleteColumn(data) {
  return new request({
    url: '/cms/official_column/delete',
    method: 'post',
    data
  })
}

export function updateColumn(data) {
  return new request({
    url: '/cms/official_column/update',
    method: 'post',
    data
  })
}

export function columnEnable (data) {
  return request({
    url: '/cms/official_column/enable_stop',
    method: 'post',
    data
  })
}

export function columnOpenList (columnId) {
  return request({
    url: '/cms/official_column/city_open_list',
    params: {
      officialColumnId: columnId
    }
  })
}