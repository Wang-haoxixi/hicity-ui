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
    url: "/cms/officaial_news/create",
    method: "post",
    data: data
  });
}
