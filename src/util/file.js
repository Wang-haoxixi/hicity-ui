import { ossUpload, downloadUrl } from '@/api/admin/sys-file'

// base64格式
const base64Reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;

// base64转blob
const base64ToBlob = function(base64Data) {
    let arr = base64Data.split(','),
        fileType = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        l = bstr.length,
        u8Arr = new Uint8Array(l);
        
    while (l--) {
        u8Arr[l] = bstr.charCodeAt(l);
    }
    return new Blob([u8Arr], {
        type: fileType
    });
};

export function uploadImage (url) {
  return new Promise((resolve, reject) => {
    if (base64Reg.test(url)) {
      const blob = base64ToBlob(url);
      const file = new window.File([blob], 'temp.png', {type: blob.type})
      ossUpload(file).then(({data}) => {
        resolve(data)
      })
    } else {
      downloadUrl(url).then(blob => {
        const file = new window.File([blob], 'temp.png', {type: blob.type})
        ossUpload(file).then((data) => {
          resolve(data)
        })
      })
    } 
  })
}