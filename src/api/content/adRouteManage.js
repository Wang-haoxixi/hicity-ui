import request from "@/router/axios";
// 广告路径管理分页
export function adPathPage(data) {
    return request({
        url: "/cms/info_ad_addres/page",
        method: "get",
        params: data
    });
}
// 广告路径管理详情
export function adPathDetail(data) {
    return request({
        url: "/cms/info_ad_addres/" + data,
        method: "get",
    });
}
// 广告路径删除
export function adPathDelete(data) {
    return request({
        url: "/cms/info_ad_addres/delete/" + data,
        method: "post"
    });
}
// 广告路径新增
export function adPathAdd(data) {
    return request({
        url: "/cms/info_ad_addres/create",
        method: "post",
        data: data
    });
}
// 广告路径编辑
export function adPathUpdate(data) {
    return request({
        url: "/cms/info_ad_addres/update",
        method: "post",
        data: data
    });
}