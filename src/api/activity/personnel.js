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

// 活动报名表单查询（PC）
export function formInquire(data) {
  return request({
    url: "/dms/conference_enrole_form/contacts_by_enrole",
    method: "get",
    params: data
  });
}

// 添加活动报名审核说明
export function addAnnotation(data) {
  return request({
    url: "/dms/conference_enrole_form/update_remark",
    method: "post",
    data: data
  });
}

// 获取报名审核说明
// export function remarkInfo(data) {
//   return request({
//     url: "/dms/conference_enrole_form/get_remark",
//     method: "get",
//     params: data
//   });
// }

// 查询报名签到码
export function signInCode(data) {
  return request({
    url: "/dms/conference_enrole_form/sign_in_code",
    method: "get",
    params: data
  });
}

// 核销签到码
export function checkCode(data) {
  return request({
    url: "/dms/conference_enrole_form/write_off",
    method: "post",
    data: data
  });
}