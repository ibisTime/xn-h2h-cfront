import {getInitWXSDKConfig} from 'api/general';
import {getUserId} from 'common/js/util';

const ERR_OK = 'get_brand_wcpay_request:ok';
const ERR_FAIL = 'get_brand_wcpay_request:fail';

let globalConfig = {};

/**
 * 初始化微信分享
 * @param config: {
 *   title, 分享标题
 *   desc,  分享描述
 *   link,  分享链接
 *   imgUrl 分享图标
 * }
 */
export function initShare(config, suc, err, isInitImage) {
  getInitWXSDKConfig().then((data) => {
    suc && suc(data);
    if (!/(\?|&)userReferee/.test(config.link)) {
      let result = /\?([^#]*)$/.exec(config.link);
      if (result) {
        if (result[1]) {
          config.link = config.link + '&userReferee=' + getUserId();
        } else {
          config.link = config.link + 'userReferee=' + getUserId();
        }
      } else {
        config.link = config.link + '?userReferee=' + getUserId();
      }
    } else {
      config.link.replace(/((?:\?|&)userReferee=)[^&$]+/, '$1' + getUserId());
    }
    _initShare(data, config, isInitImage);
  }).catch(() => {
    err && err();
  });
}

/**
 * 初始化微信支付
 * @param wxConfig: object, success: func, error: func, cancel: func
 */
export function initPay(wxConfig, success, error, cancel) {
  globalConfig['initPay'] = {
    wxConfig,
    success,
    error,
    cancel
  };
  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.removeEventListener('WeixinJSBridgeReady', _onBridgeReady);
      document.addEventListener('WeixinJSBridgeReady', _onBridgeReady, false);
    } else if (document.attachEvent) {
      document.detachEvent('WeixinJSBridgeReady', _onBridgeReady);
      document.detachEvent('onWeixinJSBridgeReady', _onBridgeReady);
      document.attachEvent('WeixinJSBridgeReady', _onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', _onBridgeReady);
    }
  } else {
    _onBridgeReady();
  }
}

/**
 * 初始化预览图片
 */
export function initShowImage () {
  getInitWXSDKConfig().then((data) => {
    wx.config({
      appId: data.appId,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList: ['previewImage']
    });
    wx.ready(() => {});
    wx.error(() => {});
  });
}

/**
 * 初始化微信分享
 * @param data: {appId, timestamp, nonceStr, signature}
 * @param config: {
 *   title,  分享标题
 *   desc,   分享描述
 *   link,   分享链接
 *   imgUrl  分享图标
 * }
 */
function _initShare(data, config, isInitImage) {
  let jsApiList = [
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareQZone'
  ];
  if (isInitImage) {
    jsApiList.push('previewImage');
  }
  wx.config({
    appId: data.appId,
    timestamp: data.timestamp,
    nonceStr: data.nonceStr,
    signature: data.signature,
    jsApiList: jsApiList
  });
  wx.ready(() => {
    // 分享给某人
    wx.onMenuShareAppMessage(config);
    // 朋友圈分享
    wx.onMenuShareTimeline(config);
    // qq分享
    wx.onMenuShareQQ(config);
    // qq空间分享
    wx.onMenuShareQZone(config);
  });
  wx.error(() => {});
}
// 微信支付
function _onBridgeReady() {
  let initPayConfig = globalConfig['initPay'];
  let wxConfig = initPayConfig.wxConfig;
  let success = initPayConfig.success;
  let error = initPayConfig.error;
  let cancel = initPayConfig.cancel;
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest', {
      appId: wxConfig.appId, // 公众号名称，由商户传入
      timeStamp: wxConfig.timeStamp, // 时间戳，自1970年以来的秒数
      nonceStr: wxConfig.nonceStr, // 随机串
      package: wxConfig.wechatPackage,
      signType: wxConfig.signType, // 微信签名方式：
      paySign: wxConfig.paySign // 微信签名
    },
    function(res) {
      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      if (res.err_msg === ERR_OK) {
        success && success();
      } else if (res.err_msg === ERR_FAIL) {
        error && error();
      } else {
        cancel && cancel();
      }
    }
  );
}
