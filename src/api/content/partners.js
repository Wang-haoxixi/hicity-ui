import request from "@/router/axios";

// 获取申请列表-运营
export function partnerList(data) {
  return request({
    url: "/dms/partne/operate_page",
    method: "get",
    params: data
  });
}

// 获取合伙人详情
export function partnerDetail(data) {
  return request({
    url: "/dms/partne/" + data,
    method: "get"
  });
}
