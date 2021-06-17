import request from '@/router/axios'

export function getMerchantAccountPage (params) {
  return request({
    url: '/fms/account/flow/income_details/pc',
    params
  })
}

export function getPartnerAccountPage (params) {
  return request({
    url: '/fms/account/flow/partner/list',
    params
  })
}

export function getPartnerAmount (params) {
  return request({
    url: '/fms/account/partner/info',
    params
  })
}

export function accountRecharge (data) {
  return request({
    url: '/fms/account/partner/recharge',
    method: 'post',
    data
  })
}

export function accountSettle (data) {
  return request({
    url: '/fms/account/partner/settle',
    method: 'post',
    data
  })
}


