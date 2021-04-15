/**
 * 人员管理
 * by boss
 */
import request from "@/router/axios";

// 报名列表-我的
export function peopleManagement(data) {
  return request({
    url: "/dms/conference_enrole_form/page",
    method: "get",
    params: data
  });
}

// 活动报名表单查询（PC）
export function formInquire(data) {
  return request({
    url: "/dms/conference_enrole_form/contacts_by_enrole",
    method: "get",
    params: data
  });
}

// 添加活动报名审核说明
export function addAnnotation(data) {
  return request({
    url: "/dms/conference_enrole_form/update_remark",
    method: "post",
    data: data
  });
}

// 获取报名审核说明
// export function remarkInfo(data) {
//   return request({
//     url: "/dms/conference_enrole_form/get_remark",
//     method: "get",
//     params: data
//   });
// }

// 查询报名签到码
export function signInCode(data) {
  return request({
    url: "/dms/conference_enrole_form/sign_in_code",
    method: "get",
    params: data
  });
}

// 核销签到码
export function checkCode(data) {
  return request({
    url: "/dms/conference_enrole_form/write_off",
    method: "post",
    data: data
  });
}

export function dataExport (id) {
  return request({
    url: `/dms/conference_enrole_form/download?conferenceId=${id}`,
    responseType: "arraybuffer"
  }).then(res => {
    let disposition = res.headers['content-disposition']
    downloadExe(res, decodeURI(disposition.substring(disposition.indexOf('fileName=') + 9)))
  })
}


function downloadExe(response, name) {
  // 处理返回的文件流
  // let filename = getTitle(response.headers['content-disposition'].replace(/"/g, ''))
  // console.log(filename)
  const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
  // ie 兼容
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob)
  } else {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = name
    document.body.appendChild(link)
    link.style.display = 'none'
    link.click()
    link.remove()
  }
}

function getTitle (contentDisposition) {
  let obj = ''
  let list = contentDisposition.split('; ')
  list.forEach(item=>{
    let n = item.split('=')
    if (n[1]) {
      obj = n[1]
    } else {
      obj = n[0]
    }
  })
  return obj
}