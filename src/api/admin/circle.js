import request from "@/router/axios";

const prefixUrl = "/admin/circle";

// 获取圈子列表
export function getCircleList(params) {
  return request({
    url: `${prefixUrl}/platform_page`,
    params
  })
}

// 圈子详情
export function circleDetail(params) {
  return request({
    url: `${prefixUrl}/details`,
    params
  })
}

// 解散圈子
export function dismissCircle(data) {
  return request({
    url: `${prefixUrl}/dismiss_circle`,
    method: 'post',
    data
  })
}

// 圈子日志
export function getCircleLog(params) {
  return request({
    url: '/admin/circle_log/page',
    params
  })
}