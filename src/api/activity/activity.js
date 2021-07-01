/**
 * 活动
 * by boss
 */
import request from "@/router/axios";

// 管理活动列表
export function activitiesList(data) {
  return request({
    url: "/dms/activity_publish/pc/management_page",
    method: "get",
    params: data
  });
}

// 删除活动信息
export function activityDelete(data) {
  return request({
    url: "/dms/activity_publish/delete/" + data,
    method: "post"
  });
}
// /activity_publish/city_open_list
// 获取城市是否开启列表
export function checkCity(data) {
  return request({
    url: "/dms/activity_publish/city_open_list",
    method: "get",
    params: data
  });
}

// 搜索圈子
export function searchOrg(data) {
  return request({
    url: "/admin/open/search_org",
    method: "get",
    params: data
  });
}

// 活动圈子关联新增
export function relevanceSave(data) {
  return request({
    url: "/dms/activity_circle/save",
    method: "post",
    data: data
  });
}

// 根据活动id查询圈子关联
export function orgedList(data) {
  return request({
    url: "/dms/activity_circle/select_by_id",
    method: "get",
    params: data
  });
}

// 删除活动圈子关联
export function deleteOrg(data) {
  return request({
    url: "/dms/activity_circle/delete/?id=" + data,
    method: "post",
  });
}

// 活动分销管理--分销
export function shareList(data) {
  return request({
    url: "/dms/activity_distribution/get_distribution_page",
    method: "get",
    params: data
  });
}

// 查看报名信息--分销
export function applyInfo(data) {
  return request({
    url: "/dms/activity_distribution_relation/detail",
    method: "get",
    params: data
  });
}

// 获取相册相片
export function getCirclePhotoes(data) {
  return request({
    url: "/admin/org/album/list_page",
    method: "get",
    params: data
  });
}

// 上传群相册
export function uploadToCircle(data) {
  return request({
    url: "/admin/org/album/upload",
    method: "post",
    data: data
  });
}

// 删除照片
export function removePhotoes(data) {
  return request({
    url: "/admin/org/album/remove",
    method: "post",
    data: data
  });
}