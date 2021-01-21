import request from "@/router/axios";

// 城市
export function citys(data) {
  return request({
    url: "/admin/city/permission/tree/?name=" + data,
    method: "get"
  });
}

// 分页查询广告位
export function adPosition(query) {
  return request({
    url: "/cms/info_adslot/page",
    method: "get",
    params: query
  });
}

// 添加广告位
export function addAdPosition(obj) {
  return request({
    url: "/cms/info_adslot/create",
    method: "post",
    data: obj
  });
}

// 更新广告位
export function editPlace(data) {
  return request({
    url: "/cms/info_adslot/update",
    method: "post",
    data: data
  });
}

// 删除广告位
export function delAdP(data) {
  return request({
    url: "/cms/info_adslot/delete/" + data,
    method: "post"
  });
}
