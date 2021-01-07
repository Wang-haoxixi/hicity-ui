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
