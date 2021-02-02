import request from "@/router/axios";

// 分页查询广告
export function ads(data) {
  return request({
    url: "/cms/info_ad/page",
    method: "get",
    params: data
  });
}

// 删除广告
export function delAd(data) {
  return request({
    url: "/cms/info_ad/delete/" + data,
    method: "post"
  });
}

// 查询广告详情
export function adDetails(data) {
  return request({
    url: "/cms/info_ad/" + data,
    method: "get"
  });
}

// 通过字典类型(唯一)查找字典
// /dict/getDictByType/{type}
// 通过字典类型(唯一)查找字典
export function getDictByType(data) {
  return request({
    url: "/admin/dict/getDictByType/" + data,
    method: "get"
  });
}

// 会议大厅分页查询
export function activitiePage(data) {
  return request({
    url: "/dms/activity_publish/activity_page",
    method: "get",
    params: data
  });
}

// 添加广告
export function addAd(data) {
  return request({
    url: "/cms/info_ad/create",
    method: "post",
    data: data
  });
}

// 更新广告
export function updateAd(data) {
  return request({
    url: "/cms/info_ad/update",
    method: "post",
    data: data
  });
}
