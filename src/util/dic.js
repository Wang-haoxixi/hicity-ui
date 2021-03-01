import {getStore} from './store'



export function getDicAll () {
  return getStore({name: 'dicList'})
}

export function getDic (name = '') {
  if (name === '') {
    console.warn('字典名不能为空')
    return
  }
  let dicList = getDicAll()
  return dicList[name]
}

export function getDicValue (name = '', value = '') {
  let dicData = getDic(name)
  if (dicData) {
    for (let i = 0; i < dicData.length; i++) {
      if (dicData[i].value == value) {
        console.log(dicData[i])
        return dicData[i].label
      }
    }
  } else {
    return ''
  }
}
