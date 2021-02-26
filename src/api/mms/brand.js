import request from '@/router/axios'

export function getBrandList (params) {
  return request({
    url: '/mms/brand/page',
    params
  })
}

export function addBrand (data) {
  return request({
    url: '/mms/brand/create',
    method: 'post',
    data
  })
}

export function updateBrand (data) {
  return request({
    url: '/mms/brand/update',
    method: 'post',
    data
  })
}

export function getBrandDetail (params) {
  return request({
    url: '/mms/brand/detail',
    params
  })
}

export function deleteBrand (data) {
  return request({
    url: '/mms/brand/logic_del',
    method: 'post',
    data
  })
}

export function getAllBrand (params) {
  return request({
    url: '/mms/brand/list',
    params
  })
}
