import request from "@/router/axios"

export function getGoodsList(params) {
  return new request({
    url: '/fms/cowry_goods/pc/page_list',
    params
  })
}

export function saveGoods(data) {
  return new request({
    url: '/fms/cowry_goods/save_pc',
    method: 'POST',
    data
  })
}

export function getGoodsDetail(id) {
  return new request({
    url: `/fms/cowry_goods/detail_pc/${id}`,
  })
}

export function deleteGoods(id) {
  return new request({
    url: `/fms/cowry_goods/delete/${id}`,
    method: 'POST',
  })
}

export function setGoodsState(data) {
  return new request({
    url: '/fms/cowry_goods/update/state',
    method: 'POST',
    data
  })
}