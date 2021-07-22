import request from '@/router/axios'
import CHN from './CHN.json'

export function getMapJson (code) {
  if (code != '100000_full') {
    return request({
      url: '/admin/forward/redirect',
      // noApi: true,
      params: {
        url: `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${code}`
      }
    })
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: CHN
        })
      }, 300)
    })
  }
}

export function recruitStatistics (cityId) {
  return request({
    url: '/dms/recruit/statistics/get',
    params: {
      cityId
    }
  })
}

export function newsStatistics (params) {
  return request({
    url: '/cms/content_statistics/data_type/count',
    params
  })
}

export function newsPopularStatistics (params) {
  return request({
    url: '/cms/content_statistics/popular_list',
    params
  })
}

export function newsStatisticsMap (cityId) {
  return request({
    url: '/cms/content_statistics/plat_publish/count',
    params: {
      cityId
    }
  })
}

export function shopStatisticsMap (cityId) {
  return request({
    url: `/mms/store/get_store_count/${cityId}`,
  })
}

export function activityStatisticsMap (cityId) {
  return request({
    url: '/dms/activity_data_city/select_by_id',
    params: {
      cityId
    }
  })
}

export function activityStatistics (params) {
  return request({
    url: '/dms/activity_data_city/get/activity_data',
    params
  })
}

export function activityRank (params) {
  return request({
    url: '/dms/activity_data_city/heroes_list',
    params
  })
}


export function orderStatisticsTotal (cityId) {
  return request({
    url: '/fms/order/statistics/overview/data',
    params: {
      cityId
    }
  })
}

export function orderStatistics (params) {
  return request({
    url: '/fms/order/statistics/quantity/trend',
    params
  })
}

export function circleStatistics (params) {
  return request({
    url: '/admin/circle/statistics/get',
    params
  })
}

export function terminalRanking (params) {
  return request({
    url: '/admin/user/statistics/register/terminal_ranking',
    params
  })
}

export function activeTrend (params) {
  return request({
    url: '/admin/user/statistics/active_trend',
    params
  })
}

export function overviewData (params) {
  return request({
    url: '/admin/user/statistics/overview_data',
    params
  })
}


