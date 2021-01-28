/**
 * 活动
 * by boss
 */
import request from "@/router/axios";

// 管理活动列表
export function activitiesList(data) {
  return request({
    url: "/qms/activity_publish/pc/management_page",
    method: "get",
    params: data
  });
}

// 删除活动信息
export function activityDelete(data) {
  return request({
    url: "/qms/activity_publish/delete/" + data,
    method: "post"
  });
}
// /activity_publish/city_open_list
// 获取城市是否开启列表
export function checkCity(data) {
  return request({
    url: "/qms/activity_publish/city_open_list",
    method: "get",
    params: data
  });
}