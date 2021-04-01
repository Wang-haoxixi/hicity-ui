import request from "@/router/axios"

export function createComment(data) {
  return request({
    url: '/cms/common_comment/create',
    method: 'POST',
    data
  })
}