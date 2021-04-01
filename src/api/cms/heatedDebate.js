import request from "@/router/axios"
const prefix = '/cms/heated_debate'

// 获取热议列表
export function getDebateList (params) {
  return request({
    url: `${prefix}/pc/page_list`,
    params
  })
}

// 保存热议
export function saveDebate (data) {
  return request({
    url: `${prefix}/save_pc`,
    method: 'POST',
    data
  })
}

// 获取热议详情
export function getDebateDetail (id) {
  return request({
    url: `${prefix}/detail_pc/${id}`,
  })
}

// 删除热议
export function deleteDebate (id) {
  return request({
    url: `${prefix}/delete/${id}`,
    method: 'post'
  })
}

// 开通城市列表
export function debateOpenList(params) {
  return new request({
    url: `${prefix}/city_scope`,
    params
  })
}

// 根据名称匹配列表
export function debateMatchList(params) {
  return new request({
    url: `${prefix}/mobile/match`,
    params
  })
}
