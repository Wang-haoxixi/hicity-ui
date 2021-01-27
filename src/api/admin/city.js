import request from "@/router/axios";
export function getCityTree(query) {
  return request({
    url: "/admin/city/tree",
    method: "get",
    params: query
  });
}

export function postCity(obj) {
  return request({
    url: "/admin/city/create",
    method: "post",
    data: obj
  });
}

export function getCityById(id) {
  return request({
    url: "/admin/city/info/" + id,
    method: "get"
  });
}

export function getCityPage(params) {
  return request({
    url: "/admin/city/cityPage",
    method: "get",
    params: params
  });
}

export function deleteCity(id) {
  return request({
    url: "/admin/city/delete/" + id,
    method: "post"
  });
}

export function putCity(obj) {
  return request({
    url: "/admin/city/update",
    method: "post",
    data: obj
  });
}

//根据dept获取父级city
export function getCityByDept(deptId) {
  return request({
    url: `/admin/city/get_top_parent_city/${deptId}`,
    method: "get"
    // params: params,
  });
}
//根据dept获取city
export function getCityBy(deptId) {
  return request({
    url: `/admin/city/deptId/${deptId}`,
    method: "get"
    // params: params,
  });
}
//根据deptid获取城市
export function getCityInfoByDept(deptId) {
  return request({
    url: `/admin/city/deptId/${deptId}`,
    method: "get"
    // params: params,
  });
}

//区划编码校验重复
export function checkRegionCode(data) {
  return request({
    url: "/admin/city/checkRegionNumber",
    method: "post",
    data: data
  });
}

//城市名称校验重复
export function checkCityName(data) {
  return request({
    url: "/admin/city/checkRegionName",
    method: "post",
    data: data
  });
}

// 根据城市ID返回城市树形菜单集合
export function getTreeByCityId() {
  return request({
    url: `/admin/city/getTree`,
    method: "get"
    // params: params,
  });
}

// 导出字段下载
export function downloadColumns() {
  return request({
    url: `/admin/sys/city/columns`,
    method: "get"
  });
}

export function adminCityList() {
  return request({
    url: "/admin/city/admin_list",
    params: {
      regionLvl: "3"
    }
  });
}

// 城市业务开通分页
export function adminCityOpenList(params) {
  return request({
    url: "/admin/city/opening_list",
    params
  });
}

// =======
// 区县 - 城市业务开通分页
export function adminOpeningCountyList(params) {
  return request({
    url: "/admin/city/opening_county_list",
    params
  });
}
// ==========

// 城市业务开通
export function adminCityOpen(data) {
  return request({
    url: "/admin/city/opening",
    method: "post",
    data
  });
}

// 城市业务锁定状态改变
export function adminCityLock(data) {
  return request({
    url: "/admin/city/locking",
    method: "post",
    data
  });
}

// 城市业务模块列表
export function adminCityModule(params) {
  return request({
    url: "/admin/module/list",
    params
  });
}
