import request from '@/router/axios'

export function getPlatformCouponsPage (params) {
  return request({
    url: '/mms/coupons/platform/select/page',
    params
  })
}

export function getCityCouponsPage (params) {
  return request({
    url: '/mms/coupons/city/select/page',
    params
  })
}

export function createCoupons (data) {
  return request({
    url: '/mms/coupons/create',
    method: 'POST',
    data
  })
}

export function getCouponsDetail (id) {
  return request({
    url: `/mms/coupons/select?id=${id}`,
  })
}

export function deleteCouponsBatch (data) {
  return request({
    url: '/mms/coupons/delete',
    method: 'post',
    data
  })
}

export function updateCoupons (data) {
  return request({
    url: '/mms/coupons/update',
    method: 'POST',
    data
  })
}

export function couponsOn (id) {
  return request({
    url: `/mms/coupons/put/on?id=${id}`,
    method: 'POST',
  })
}

export function couponsDown (id) {
  return request({
    url: `/mms/coupons/put/down?id=${id}`,
    method: 'POST',
  })
}

export function getCityList (params) {
  return request({
    url: '/mms/coupons/select/cities',
    params
  })
}

export function getCityReceiveList (params) {
  return request({
    url: '/mms/coupons/receive/city/select/page',
    params
  })
}

export function getPlatformReceiveList (params) {
  return request({
    url: '/mms/coupons/receive/platform/select/page',
    params
  })
}

export function couponsRecommend (params) {
  return request({
    url: '/mms/coupons/city/top/deal',
    method: 'POST',
    params
  })
}

export function getRecommendList (params) {
  return request({
    url: '/mms/coupons/city/top/list',
    params
  })
}

export function getPlatformWriteoffList (params) {
  return request({
    url: '/mms/coupons/platform/write_off/page',
    params
  })
}

export function getCityWriteoffList (params) {
  return request({
    url: '/mms/coupons/city/write_off/page',
    params
  })
}

export function getOrderDetail (params) {
  return request({
    url: '/mms/coupons/order/detail',
    params
  })
}

export function getWriteoffDetail (params) {
  return request({
    url: '/mms/coupons/write_off/detail',
    params
  })
}