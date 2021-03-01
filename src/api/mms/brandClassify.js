import request from '@/router/axios'

export function getBrandClassifyList (params) {
  return request({
    url: '/mms/brand_classification/page',
    params
  })
}

export function addBrandClassify (data) {
  return request({
    url: '/mms/brand_classification/create',
    method: 'post',
    data
  })
}

export function updateBrandClassify (data) {
  return request({
    url: '/mms/brand_classification/update',
    method: 'post',
    data
  })
}

export function getBrandClassifyDetail (params) {
  return request({
    url: '/mms/brand_classification/detail',
    params
  })
}

export function deleteBrandClassify (data) {
  return request({
    url: '/mms/brand_classification/logic_del',
    method: 'post',
    data
  })
}

export function getBrandClassifyBgList () {
  return request({
    url: '/mms/brand_classification_bg/list',
  })
}
