export const calcDate = (date1, date2) => {
  var date3 = date2 - date1

  var days = Math.floor(date3 / (24 * 3600 * 1000))

  var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))

  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))

  var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(date3 / 1000)
  return {
    leave1,
    leave2,
    leave3,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

function getDay (day, cn = false) {
  switch (day) {
    case 0:
      return cn ? '日' : 7
    case 1:
      return cn ? '一' : 1
    case 2:
      return cn ? '二' : 2
    case 3:
      return cn ? '三' : 3
    case 4:
      return cn ? '四' : 4
    case 5:
      return cn ? '五' : 5
    case 6:
      return cn ? '六' : 6
    default:
      return ''
  }
}

/**
 * 日期格式化
 */
export function dateFormat(date, format = 'yyyy-MM-dd hh:mm:ss') {
  if (date !== 'Invalid Date') {
    var o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      'S': date.getMilliseconds(), // millisecond
      'W': getDay(date.getDay(), true),
      'w': getDay(date.getDay())
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  }
  return ''
}

export function getDateDiff (time, format = 'yyyy.MM.dd') {
	var result = ''
	var minute = 1000 * 60
	var hour = minute * 60
	var day = hour * 24
	var month = day * 30
	var now = parseInt(new Date().getTime() / 1000 + 1) * 1000
	//2020-11-24 00:00:02 如果time是这种格式，需要把“-”转换成 “/” str.replace(/-/g,"/"),兼容IOS安卓
	var lastTime = new Date(time.replace(/-/g, "/")).getTime()
	var diffValue = now - lastTime
	if (diffValue < 0) return
	var monthC = diffValue / month
	var weekC = diffValue / (7 * day)
	var dayC = diffValue / day
	var hourC = diffValue / hour
	var minC = diffValue / minute
	if (dayC >= 7) {
		result = dateFormat(new Date(time.replace(/-/g, "/")), format)
	} else if (dayC >= 1 && dayC < 7) {
		result = "" + parseInt(dayC) + "天前"
		// result = "" + time
	} else if (hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前"
	} else if (minC >= 5) {
		result = "" + parseInt(minC) + "分钟前"
	} else {
		result = "刚刚"
	}
	return result
}
