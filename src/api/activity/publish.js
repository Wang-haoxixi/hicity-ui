/**
 * 活动发布
 * by boss
 */
import request from "@/router/axios";

// 根据分类字典编码返回子分类字典
export function activityClassify(data) {
  return request({
    url: "/admin/category/children/" + data,
    method: "get"
  });
}
// 返回城市树形菜单集合
export function cityTree(data) {
  return request({
    url: "/admin/city/tree",
    method: "get"
  });
}
// getPoster
export function posters(data) {
  return request({
    url: "/dms/activity_publish/get_poster",
    method: "get"
  });
}
// 通过字典类型(唯一)查找字典
export function activityType(data) {
  return request({
    url: "/admin/dict/getDictByType/" + data,
    method: "get"
  });
}
// /tag/page
// 后台分页查询标签
export function tagsPage(data) {
  return request({
    url: "/tms/tag/page",
    method: "get"
  });
}
// /activity_publish/save
// 创建活动信息
export function savePublish(data) {
  return request({
    url: "/dms/activity_publish/save",
    method: "post",
    data: data
  });
}

// 根据活动ID查询活动信息
export function activityInfo(data) {
  return request({
    url: "/dms/activity_publish/" + data,
    method: "get"
  });
}


// /activity_publish/update
// 修改活动信息
export function editSaveActivity(data) {
  return request({
    url: "/dms/activity_publish/update",
    method: "post",
    data: data
  });
}