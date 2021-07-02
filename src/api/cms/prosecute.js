import request from "@/router/axios"

export function getProsecutePage(params) {
  return request({
    url: '/cms/prosecute/page',
    params
  })
}

export function getProsecuteDetail(params) {
  return request({
    url: '/cms/prosecute/detail',
    params
  })
}

export function handleProsecute(data) {
  return request({
    url: '/cms/prosecute/handle',
    method: 'POST',
    data
  })
}
