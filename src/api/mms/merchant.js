import request from '@/router/axios'

export function getMerchantList (params) {
  return request({
    url: '/mms/merchant/page',
    params
  })
}

export function addMerchant (data) {
  return request({
    url: '/mms/merchant/create',
    method: 'post',
    data
  })
}

export function updateMerchant (data) {
  return request({
    url: '/mms/merchant/update',
    method: 'post',
    data
  })
}

export function getMerchantDetail (params) {
  return request({
    url: '/mms/merchant/detail',
    params
  })
}

export function deleteMerchant (data) {
  return request({
    url: '/mms/merchant/logic_del',
    method: 'post',
    data
  })
}
