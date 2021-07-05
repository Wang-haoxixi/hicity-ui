import request from "@/router/axios"

// 获取资讯列表
export function getNewsList(params) {
  return new request({
    url: '/cms/official_news/page',
    params
  })
}

// 添加资讯
export function addNews(data) {
  return new request({
    url: '/cms/official_news/create',
    method: 'post',
    data
  })
}

// 获取资讯详情
export function getNewsDetail(params) {
  return new request({
    url: '/cms/open/official_details',
    params
  })
}

// 更新资讯
export function updateNews(data) {
  return new request({
    url: '/cms/official_news/update',
    method: 'post',
    data
  })
}

// 获取城市可用栏目数据
export function cityColumn(params) {
  return request({
    url: "/cms/official_column/official_city_column",
    params
  });
}

// 资讯开通城市列表
export function newsOpenList(params) {
  return new request({
    url: "/cms/official_news/city_open_list",
    params
  })
}

// 删除资讯
export function deleteNews(data) {
  return request({
    url: "/cms/official_news/delete",
    method: "post",
    data
  });
}

// 推荐资讯
export function setRecommend(data) {
  return request({
    url: '/cms/rec_news/create',
    method: "post",
    data
  });
}

// 取消推荐资讯
export function cancelRecommend(id) {
  return request({
    url: `/cms/rec_news/cancel/${id}`,
    method: "post"
  });
}

// 推荐资讯列表
export function getRecommendPage(params) {
  return request({
    url: `/cms/rec_news/page`,
    params
  });
}

// 推荐资讯范围
export function getRecommendRange(params) {
  return request({
    url: `/cms/rec_news/rec_scope`,
    params
  });
}

// 标签分页
export function getLabelPage (params) {
  return request({
    url: '/cms/label_news/page',
    params
  })
}

// 标签列表，模糊查询
export function getLabelList (params) {
  return request({
    url: '/cms/label_news/list',
    params
  })
}

// 保存标签
export function saveLabel (data) {
  return request({
    url: '/cms/label_news/save',
    method: 'post',
    data
  })
}

// 删除标签
export function deleteLabel (id) {
  return request({
    url: `/cms/label_news/delete/${id}`,
    method: 'post',
  })
}

// 标签推荐
export function setLabelRecommend (data) {
  return request({
    url: `/cms/label_news/rec`,
    method: 'post',
    data
  })
}

// 标签取消推荐
export function cancelLabelRecommend (id) {
  return request({
    url: `/cms/label_news/cancel_rec/${id}`,
    method: 'post',
  })
}

// 标签推荐分页
export function getLabelRecommendPage (params) {
  return request({
    url: '/cms/label_news/rec_page',
    params
  })
}

// 标签推荐范围
export function getLabelRecommendRange (params) {
  return request({
    url: '/cms/label_news/rec_range',
    params
  })
}

// 资讯批量操作
export function batchHandler (data) {
  return request({
    url: `/cms/official_news/batch/operation`,
    method: 'post',
    data
  })
}

// 资讯操作
export function singleHandler (data) {
  return request({
    url: `/cms/official_news/operation`,
    method: 'post',
    data
  })
}

// 关联活动列表
export function getNewsActivityList (params) {
  return request({
    // url: '/cms/news_activity/list',
    url: '/cms/open/news_activity/detail_list',
    params
  })
}


