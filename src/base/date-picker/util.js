let now = new Date();

const _DAYS1 = (() => {
  return Array.apply(null, { length: 28 }).map((item, index) => {
    let _index = (index + 1) + '';
    _index = '00'.substr(_index.length) + _index;
    return {
      text: `${index + 1}日`,
      value: _index
    };
  });
})();

const _DAYS2 = (() => {
  return Array.apply(null, { length: 29 }).map((item, index) => {
    let _index = (index + 1) + '';
    _index = '00'.substr(_index.length) + _index;
    return {
      text: `${index + 1}日`,
      value: _index
    };
  });
})();

const _DAYS3 = (() => {
  return Array.apply(null, { length: 30 }).map((item, index) => {
    let _index = (index + 1) + '';
    _index = '00'.substr(_index.length) + _index;
    return {
      text: `${index + 1}日`,
      value: _index
    };
  });
})();

const _DAYS4 = (() => {
  return Array.apply(null, { length: 31 }).map((item, index) => {
    let _index = (index + 1) + '';
    _index = '00'.substr(_index.length) + _index;
    return {
      text: `${index + 1}日`,
      value: _index
    };
  });
})();

const _MONTH2DAYS = {
  '01': _DAYS4,
  '02': _DAYS1,
  '03': _DAYS4,
  '04': _DAYS3,
  '05': _DAYS4,
  '06': _DAYS3,
  '07': _DAYS4,
  '08': _DAYS4,
  '09': _DAYS3,
  '10': _DAYS4,
  '11': _DAYS3,
  '12': _DAYS4
};

// 获取年份的列表
export function getYears() {
  let current = now.getFullYear();
  let min = current - 100;
  let max = current;
  let years = [];
  for(let i = min; i <= max; i++) {
    years.push({
      text: `${i}年`,
      value: i
    });
  }
  return years;
}

export function getMonths() {
  let result = [];
  for(let i = 1; i <= 12; i++) {
    let index = i + '';
    index = '00'.substr(index.length) + index;
    result.push({
      text: `${i}月`,
      value: index
    });
  }
  return result;
}

export function getDays(year, month) {
  if (month !== '02') {
    return _MONTH2DAYS[month];
  } else {
    if (_isLeapYear(year)) {
      return _DAYS2;
    } else {
      return _DAYS1;
    }
  }
}

// 获取当天的数据
export function getCurDatas() {
  let _month = (now.getMonth() + 1) + '';
  _month = '00'.substr(_month.length) + _month;
  return {
    selectedIndex: [100, now.getMonth(), now.getDate() - 1],
    datas: [getYears(), getMonths(), getDays(now.getFullYear(), _month)]
  };
}

function _isLeapYear(year) {
  return !!(!(year % 400) || (!(year % 4) && year % 100));
}
