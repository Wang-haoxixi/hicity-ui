/**
 * 人员管理
 * by boss
 */
import request from "@/router/axios";

// 报名列表-我的
export function peopleManagement(data) {
  return request({
    url: "/dms/conference_enrole_form/page",
    method: "get",
    params: data
  });
}