import request from "@/router/axios"

// 获取资讯列表
export function getNewsList(params) {
  return new request({
    url: '/cms/news/news_page',
    params
  })
}

// 添加资讯
export function addNews(data) {
  return new request({
    url: '/cms/news/create',
    method: 'post',
    data
  })
}

// 获取资讯详情
export function getNewsDetail(params) {
  return new request({
    url: '/cms/open/news_details',
    params
  })
}

// 更新资讯
export function updateNews(data) {
  return new request({
    url: '/cms/news/update',
    method: 'post',
    data
  })
}

// 资讯开通城市列表
export function newsOpenList(params) {
  return new request({
    url: '/cms/news/city_open_list',
    params
  })
}

// 删除资讯
export function deleteNews(data) {
  return new request({
    url: '/cms/news/delete',
    method: 'post',
    data
  })
}

// 资讯启停
export function newsEnable (data) {
  return request({
    url: '/cms/news/enable_stop',
    method: 'post',
    data
  })
}