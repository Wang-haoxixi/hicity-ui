import request from '@/router/axios'

export function getMerchantList (params) {
  return request({
    url: '/mms/merchant/list',
    params
  })
}

export function changeMerchant (id) {
  return request({
    url: `/mms/merchant/set/merchant?id=${id}`,
    method: 'post'
  })
}