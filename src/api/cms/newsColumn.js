import request from "@/router/axios"

export function getColumnList(params) {
  return new request({
    url: '/cms/news_column/news_column',
    params
  })
}

export function addColumn(data) {
  return new request({
    url: '/cms/news_column/create',
    method: 'post',
    data
  })
}

export function getColumnDetail(newsColumnId) {
  return new request({
    url: '/cms/news_column/details',
    params: {newsColumnId}
  })
}

export function deleteColumn(data) {
  return new request({
    url: '/cms/news_column/delete',
    method: 'post',
    data
  })
}

export function updateColumn(data) {
  return new request({
    url: '/cms/news_column/update',
    method: 'post',
    data
  })
}

export function columnEnable (data) {
  return request({
    url: '/cms/news_column/enable_stop',
    method: 'post',
    data
  })
}

export function columnOpenList (columnId) {
  return request({
    url: '/cms/news_column/city_open_list',
    params: {
      newsColumnId: columnId
    }
  })
}