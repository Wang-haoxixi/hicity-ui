const getters = {
  tag: state => state.tags.tag,
  website: state => state.common.website,
  userInfo: state => state.user.userInfo,
  theme: state => state.common.theme,
  themeName: state => state.common.themeName,
  isShade: state => state.common.isShade,
  isCollapse: state => state.common.isCollapse,
  keyCollapse: (state, getters) => getters.screen > 1 ? getters.isCollapse : false,
  screen: state => state.common.screen,
  isLock: state => state.common.isLock,
  isFullScren: state => state.common.isFullScren,
  lockPasswd: state => state.common.lockPasswd,
  tagList: state => state.tags.tagList,
  tagWel: state => state.tags.tagWel,
  access_token: state => state.user.access_token,
  refresh_token: state => state.user.refresh_token,
  expires_in: state => state.user.expires_in,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  menu: state => state.user.menu,
  menuAll: state => state.user.menuAll,
  logsList: state => state.logs.logsList,
  logsLen: state => state.logs.logsList.length || 0,
  logsFlag: (state, getters) => getters.logsLen === 0,
  dicList: state => state.user.dicList,
  userType: state => {
    if (state.user.userInfo.userType == 3 || state.user.userInfo.userType == 4) {
      return 1
    } else if (state.user.userInfo.userType == 1 || state.user.userInfo.userType == 2) {
      return 2
    } else if (state.user.userInfo.userType == 5 || state.user.userInfo.userType == 6) {
      return 3
    } else {
      return 0
    }
  },
  allCityTree: state => state.user.allCityTree,
}
export default getters
