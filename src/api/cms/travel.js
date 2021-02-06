import request from "@/router/axios"
const prefix = '/cms/travel'

// 话题分类列表
export function getClassifyList (params) {
  return request({
    url: `${prefix}/classify/pc/page_list`,
    params
  })
}

// 话题分类新增
export function addClassify (data) {
  return request({
    url: `${prefix}/classify/save`,
    method: 'POST',
    data
  })
}

// 话题分类修改
export function updateClassify (data) {
  return request({
    url: `${prefix}/classify/update`,
    method: 'POST',
    data
  })
}

// 话题分类删除
export function deleteClassify (id) {
  return request({
    url: `${prefix}/classify/delete/${id}`,
    method: 'POST',
  })
}

// 话题库列表
export function getTopicList (params) {
  return request({
    url: `${prefix}/topics/pc/page_list`,
    params
  })
}

// 话题库新增
export function addTopic (data) {
  return request({
    url: `${prefix}/topics/save`,
    method: 'POST',
    data
  })
}

// 话题库修改
export function updateTopic (data) {
  return request({
    url: `${prefix}/topics/update`,
    method: 'POST',
    data
  })
}

// 话题库删除
export function deleteTopic (id) {
  return request({
    url: `${prefix}/topics/delete/${id}`,
    method: 'POST',
  })
}

// 用户话题引用至官方
export function quoteTopic (id) {
  return request({
    url: `${prefix}/topics/quote/${id}`,
    method: 'POST',
  })
}

export function setEnableState (data) {
  return request({
    url: `${prefix}/conf/update/state`,
    method: 'POST',
    data
  })
}

// 根据游记话题id删除话题与话题分类的关联
export function deleteRelation (id) {
  return request({
    url: `${prefix}/topics/delete/classify/${id}`,
    method: 'POST',
  })
}

// 获取游记列表
export function getTravelList (params) {
  return request({
    url: `${prefix}/pc/page_list`,
    params
  })
}

// 获取游记列表
export function saveTravel (data) {
  return request({
    url: `${prefix}/save_pc`,
    method: 'POST',
    data
  })
}

// 获取游记列表
export function getTravelDetail (id) {
  return request({
    url: `${prefix}/detail_pc/${id}`,
  })
}

// 获取游记列表
export function deleteTravel (id) {
  return request({
    url: `${prefix}/delete/${id}`,
    method: 'post'
  })
}

// 咨询开通城市列表
export function travelOpenList(params) {
  return new request({
    url: '/cms/travel/city_scope',
    params
  })
}

