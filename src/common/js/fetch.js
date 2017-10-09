import {SYSTEM_CODE} from './config';
import {getCookie} from './cookie';
import Message from 'base/message/message';
import axios from 'axios';
import {clearUser} from 'common/js/util';

const ERR_OK = '0';
const ERR_TIME_OUT = '4';

const message = new Message();

export default function fetch(code, param) {
  const url = '/api';

  const data = {
    systemCode: SYSTEM_CODE,
    companyCode: SYSTEM_CODE,
    token: getCookie('token'),
    ...param
  };

  param = 'code=' + code + '&json=' + encodeURIComponent(JSON.stringify(data));
  return axios.post(url, param, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then((res) => {
    res = res.data;
    if (res.errorCode === ERR_TIME_OUT) {
      message.show('登录超时，请重新登录');
      clearUser();
      _reloadPage();
      return Promise.reject('timeout');
    }
    if(res.errorCode !== ERR_OK) {
      if (res.errorInfo) {
        message.show(res.errorInfo.toString());
      } else {
        message.show('操作失败');
      }
      return Promise.reject(res.errorInfo);
    }
    return Promise.resolve(res.data);
  });
}

function _reloadPage() {
  fetch(805917, {
    ckey: 'WX_H5_ACCESS_KEY'
  }).then((data) => {
    let appId = data.cvalue;
    let redirectUri = encodeURIComponent(`${location.origin}?${location.hash}`);
    let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
    setTimeout(() => {
      location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
    }, 100);
  });
}
