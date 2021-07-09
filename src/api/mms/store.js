import request from '@/router/axios'

export function getStoreList (params) {
  return request({
    url: '/mms/store/page',
    params
  })
}

export function addStore (data) {
  return request({
    url: '/mms/store/create',
    method: 'post',
    data
  })
}

export function updateStore (data) {
  return request({
    url: '/mms/store/update',
    method: 'post',
    data
  })
}

export function getStoreDetail (params) {
  return request({
    url: '/mms/store/detail',
    params
  })
}

export function deleteStore (data) {
  return request({
    url: '/mms/store/logic_del',
    method: 'post',
    data
  })
}

export function getStoreQrCode (params) {
  return request({
    url: '/mms/store/get/qr/code',
    params
  })
}


export function getManageList (params) {
  return request({
    url: '/mms/store_manage/find_list',
    params
  })
}

export function addManage (data) {
  return request({
    url: '/mms/store_manage/create',
    method: 'post',
    data
  })
}

export function updateManage (data) {
  return request({
    url: '/mms/store_manage/update',
    method: 'post',
    data
  })
}

export function getManageDetail (id) {
  return request({
    url: `/mms/store_manage/find_by_store_manager_id/${id}`,
  })
}

export function deleteManage (data) {
  return request({
    url: '/mms/store_manage/logic_del',
    method: 'post',
    data
  })
}

export function getManageQrCode (params) {
  return request({
    url: '/mms/store_manage/get/qr/code',
    params
  })
}

export function getAllManager (params) {
  return request({
    url: '/mms/store_manage/find_all',
    params
  })
}

export function getManagerStorePage (params) {
  return request({
    url: '/mms/store_manage/find_store_info',
    params
  })
}

export function unbundlingStore (data) {
  return request({
    url: '/mms/store_manage/update_un_bun_ling',
    method: 'POST',
    data
  })
}

export function cancelManager (data) {
  return request({
    url: '/mms/store_manage/update_merchant_cancel',
    method: 'POST',
    data
  })
}

export function getCashierPage (params) {
  return request({
    url: '/mms/store/get_cashier_page',
    params
  })
}

export function unbundlingCashier (data) {
  return request({
    url: '/mms/store_manage/un_ling_cashier',
    method: 'POST',
    data
  })
}

export function getStoreOrderPage (params) {
  return request({
    url: '/mms/store_order/page',
    params
  })
}

export function getStoreOrderDetail (params) {
  return request({
    url: '/mms/store_order/proceeds_detail_pc',
    params
  })
}

export function getMerchantStoreList (params) {
  return request({
    url: '/mms/store/store_cashier_list',
    params
  })
}

export function getMerchantOrderPage (params) {
  return request({
    url: '/mms/store_order/proceeds_page',
    params
  })
}



