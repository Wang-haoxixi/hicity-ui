import request from '@/router/axios'

export function getCouponsPage (params) {
  return request({
    url: '/mms/coupons/select/page',
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