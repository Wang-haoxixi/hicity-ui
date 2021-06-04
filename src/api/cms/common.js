import request from "@/router/axios"

export function createComment(data) {
  return request({
    url: '/cms/common_comment/create',
    method: 'POST',
    data
  })
}

export function getCommentPage(params) {
  return request({
    url: '/cms/common_comment/pc/page',
    params
  })
}

export function hideComment(data) {
  return request({
    url: '/cms/common_comment/hidden',
    method: 'POST',
    data
  })
}