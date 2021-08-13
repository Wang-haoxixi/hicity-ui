import request from "@/router/axios";

export function getCompanyPage(params) {
  return request({
    url: '/dms/recruit_company/page_list',
    params
  })
}

export function getCompanyList(params) {
  return request({
    url: '/dms/recruit_company/name_list',
    params
  })
}

export function getAuditDetail(params) {
  return request({
    url: '/dms/recruit_audit/detail',
    params
  })
}

export function audit(data) {
  return request({
    url: '/dms/recruit_audit/create',
    method: 'POST',
    data
  })
}

export function getCompanyDetail(params) {
  return request({
    url: '/dms/open/recruit/company_detail',
    params
  })
}

export function getCompanyListByName(params) {
  return request({
    url: '/dms/recruit_company/name_list',
    params
  })
}
