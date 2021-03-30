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
    try {
      if (base64Reg.test(url)) {
        const blob = base64ToBlob(url);
        const file = new window.File([blob], 'temp.png', {type: blob.type})
        ossUpload(file).then(({data}) => {
          resolve(data)
        }, () => {
          reject(new Error('图片上传失败！'))
        }).catch(() => {
          reject(new Error('图片上传失败！'))
        })
      } else {
        downloadUrl(url).then(blob => {
          const file = new window.File([blob], 'temp.png', {type: blob.type})
          ossUpload(file).then((data) => {
            resolve(data)
          }, () => {
            reject(new Error('图片上传失败！'))
          }).catch(() => {
            reject(new Error('图片上传失败！'))
          })
        }, () => {
          reject(new Error('图片获取失败！'))
        }).catch(() => {
          reject(new Error('图片获取失败！'))
        })
      } 
    } catch (e) {
      reject(new Error('图片上传失败！'))
    }
  })
}

export function getFileMimeType(file) {
  const map = {
    'FFD8FFE0': 'jpg',
    '89504E47': 'png',
    '47494638': 'gif',
    "52494646": 'webp'
  }

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      try {
          let array = new Uint8Array(event.target.result);
          array = array.slice(0, 4);
          let arr = [...array]
          let key = arr.map(item => item.toString(16).toUpperCase().padStart(2, '0')).join('')
          resolve(map[key])

      } catch (e) {
        reject(e);
      }
    };
  });
}