import request from "@/router/axios"

export function getProsecutePage(params) {
  return request({
    url: '/cms/prosecute/page',
    params
  })
}
