import request from "@/router/axios"

export function getColumnList(param) {
  return new request({
    url: '/cms/news_column/news_column',
    param
  })
}

export function addNewsColumn(data) {
  return new request({
    url: '/cms/news_column/create',
    method: 'post',
    data
  })
}

export function deleteNewsColumn(data) {
  return new request({
    url: '/cms/news_column/delete',
    method: 'post',
    data
  })
}

export function updateNewsColumn(data) {
  return new request({
    url: '/cms/news_column/update',
    method: 'post',
    data
  })
}