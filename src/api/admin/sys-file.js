import request from '@/router/axios'
import axios1 from 'axios'

export function fetchList(query) {
  return request({
    url: '/admin/sys_file/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/sys_file',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/sys_file/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/sys_file/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/sys_file',
    method: 'put',
    data: obj
  })
}

export function ossUpload (file) {
  let data = new FormData()
  data.append('file', file)
  return request({
    url: '/admin/sys_file/oss/upload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'post',
    data
  })
}

export function downloadUrl(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          if (this.response) {
            resolve(this.response)
          } else {
            reject(new Error('图片获取失败！'))
          }
        } else {
          reject(new Error('图片获取失败！'))
        }
      }
    }
    xhr.send();
  })
  
}
