/**
 * 活动
 * by boss
 */
import request from "@/router/axios";

// // 添加广告位
// export function addAdPosition(obj) {
//   return request({
//     url: "/cms/info_adslot/create",
//     method: "post",
//     data: obj
//   });
// }

// 管理活动列表
export function activitiesList(data) {
  return request({
    url: "/qms/activity_publish/pc/management_page",
    method: "get",
    params: data
  });
}
