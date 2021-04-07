import request from "@/router/axios"

export function cowryFlowPage (params) {
  return request({
    url: '/fms/cowry_flow/pc/page_list',
    params
  })
}