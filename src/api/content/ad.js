import request from "@/router/axios";

// 分页查询广告
export function ads(data) {
  return request({
    url: "/ims/info_ad/page",
    method: "get",
    params: data
  });
}

// 删除广告
export function delAd(data) {
  return request({
    url: "/ims/info_ad/delete/" + data,
    method: "post"
  });
}

// 查询广告详情
export function adDetails(data) {
  return request({
    url: "/ims/info_ad/" + data,
    method: "get"
  });
}

// /sys-file/oss/upload
// oss上传文件
export function filePic(data) {
  return request({
    url: "/admin/sys-file/oss/upload",
    method: "post",
    data:data
  });
}