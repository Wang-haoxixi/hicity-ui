import request from "@/router/axios";

// 资讯管理-资讯查询（分页）（官方）
export function officialReleaseList(data) {
  return request({
    url: "/cms/official_news/page",
    method: "get",
    params: data
  });
}

// 资讯管理-官方资讯发布（官方）
export function officaialNewsCreate(data) {
  return request({
    url: "/cms/official_news/create",
    method: "post",
    data: data
  });
}

// 栏目管理-城市开启的栏目查询（热门新闻）
export function cityColumn(data) {
  return request({
    url: "/cms/official_column/official_city_column",
    method: "get",
    params: data
  });
}

// 资讯管理-官方城市开启查询（官方）
export function checkCity(data) {
  return request({
    url: "/cms/official_news/city_open_list",
    method: "get",
    params: data
  });
}

// 资讯管理-资讯详情(官方)
export function officialDetail(data) {
  return request({
    url: "/cms/open/official_details",
    method: "get",
    params: data
  });
}

// 资讯管理-资讯删除（官方）
export function officialDel(data) {
  return request({
    url: "/cms/official_news/delete",
    method: "post",
    data: data
  });
}

// 资讯管理-官方资讯发布（官方）
export function officaialNewsUpdate(data) {
  return request({
    url: "/cms/official_news/update",
    method: "post",
    data: data
  });
}
