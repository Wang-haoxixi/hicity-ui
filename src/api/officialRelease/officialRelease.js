import request from "@/router/axios";

// 资讯管理-资讯查询（分页）（官方）
export function officialReleaseList(data) {
  return request({
    url: "/cms/official_news/page",
    method: "get",
    params: data
  });
}

// 栏目管理-官方栏目创建（官方）
export function officialColumnCreate(data) {
  return request({
    url: "/cms/official_column/create",
    method: "post",
    data: data
  });
}
