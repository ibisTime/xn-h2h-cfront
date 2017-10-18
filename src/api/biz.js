import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';

/**
 * 发布商品
 * @param {activityCode?,area,city,province,latitude,longitude,
 * description,isNew,isPublish,name,originalPrice,pic,price,yunfei} params
 */
export function publish (params) {
  return fetch(808015, {
    storeCode: getUserId(),
    updater: getUserId(),
    kind: 1,
    ...params
  });
}

/**
 * 分页查询商品
 * @param {start,limit,category,type,province,city,area,name,location} params
 */
export function getPageGoods (params) {
  return fetch(808025, {
    status: 3,
    ...params
  });
}

/**
 * 详情查询商品
 * @param {string} code
 */
export function getGoodsDetail (code) {
  return fetch(808026, {
    code,
    userId: getUserId()
  });
}

/**
 * 列表查询商品分类
 */
export function getCategories (parentCode) {
  return fetch(808007, {
    status: 1,
    parentCode
  });
}

/**
 * 收藏/点赞/浏览
 * @param {string} type
 * @param {string} entityCode
 */
function xn801030(type, entityCode) {
  return fetch(801030, {
    category: 'P',
    interacter: getUserId(),
    type,
    entityCode
  });
}

/**
 * 收藏
 * @param {string} entityCode
 */
export function collection (entityCode) {
  return xn801030(1, entityCode);
}

/**
 * 点赞
 * @param {string} entityCode
 */
export function praise (entityCode) {
  return xn801030(2, entityCode);
}

/**
 * 浏览
 * @param {string} entityCode
 */
export function read (entityCode) {
  return xn801030(3, entityCode);
}

/**
 * 取消收藏/点赞
 * @param {string} type
 * @param {string} entityCode
 */
function xn801031 (type, entityCode) {
  return fetch(801031, {
    category: 'P',
    interacter: getUserId(),
    type,
    entityCode
  });
}

/**
 * 取消收藏
 * @param {string} entityCode
 */
export function cancelCollection (entityCode) {
  return xn801031(1, entityCode);
}

/**
 * 取消点赞
 * @param {string} entityCode
 */
export function cancelPraise (entityCode) {
  return xn801031(2, entityCode);
}

/**
 * 评论分页查询
 * @param {string} entityCode
 * @param {string} start
 * @param {string} limit
 */
export function getPageComments (entityCode, start, limit) {
  return fetch(801025, {
    entityCode,
    start,
    limit,
    orderColumn: 'comment_datetime',
    orderDir: 'desc',
    status: 'AB'
  });
}

/**
 * 商品评论
 * @param {string} content
 * @param {string} entityCode
 */
export function goodsRating (content, entityCode) {
  return fetch(801020, {
    content,
    entityCode,
    commenter: getUserId()
  });
}

/**
 * 立即下单
 * @param {string} productCode
 * @param {string} applyNote
 * @param {string} reAddress
 * @param {string} reMobile
 * @param {string} receiver
 */
export function applyOrder (productCode, applyNote, reAddress, reMobile, receiver) {
  return fetch(808060, {
    productCode,
    applyNote,
    reAddress,
    reMobile,
    receiver,
    applyUser: getUserId(),
    quantity: 1
  });
}

/**
 * 支付订单
 * @param {string} code
 * @param {string} payType (0、积分支付，1、余额支付，2、微信APP支付，5、微信H5支付，
 * 60、优惠券支付，61、积分+H5支付，62、积分+余额支付，63、积分+优惠券支付，
 * 64、微信H5+优惠券支付，65、余额+优惠券支付，66、积分+微信APP支付，
 * 67、优惠券+微信APP支付，68、积分+微信H5支付+优惠券，
 * 69、积分+微信APP支付+优惠券，70、积分+余额支付+优惠券)
 * @param {string} couponCode
 */
export function payOrder (code, payType, couponCode) {
  return fetch(808052, {
    codeList: [code],
    payType,
    couponCode
  });
}

/**
 * 分页查询订单
 * */
export function getPageOrders(start, limit, status) {
  let params = {
    start,
    limit,
    applyUser: getUserId(),
    orderColumn: 'apply_datetime',
    orderDir: 'desc'
  };
  if (status.constructor === Array) {
    params.statusList = status;
  } else {
    params.status = status;
  }
  return fetch(808068, params);
}

/**
 * 详情查询订单
 * @param {string} code
 */
export function getOrder (code) {
  return fetch(808066, {
    code
  });
}

/**
 * 取消订单
 * @param {string} code
 * @param {string} remark
 * */
export function cancelOrder(code, remark) {
  return fetch(808053, {
    code,
    remark,
    userId: getUserId()
  });
}

/**
 * 申请退款
 * @param {string} code
 * @param {string} remark
 */
export function tkOrder (code, remark) {
  return fetch(808061, {
    code,
    remark,
    updater: getUserId()
  });
}

/**
 * 退款审核
 * @param {string} code
 * @param {string} remark
 * @param {string} result 0 不同意，1同意
 */
export function tkReview (code, remark, result) {
  return fetch(808062, {
    code,
    remark,
    result,
    updater: getUserId()
  });
}

/**
 * 订单评论
 * @param {string} content
 * @param {string} orderCode
 * @param {string} productCode
 */
export function orderRating (content, orderCode, productCode) {
  return fetch(808059, {
    orderCode,
    commentList: [{
      content,
      productCode,
      score: 0
    }],
    commenter: getUserId()
  });
}

/**
 * 订单确认收货
 * @param {string} code
 * @param {string} remark
 * */
export function receiveOrder(code, remark) {
  return fetch(808057, {
    code,
    remark,
    updater: getUserId()
  });
}

/**
 * 分页查询我的优惠券
 * @param {number} start
 * @param {number} limit
 */
export function getPageCoupons (start, limit) {
  return fetch(801118, {
    start,
    limit,
    status: 0,
    toUser: getUserId()
  });
}

// 根据业务获取数量
export function businessNum(category, entityCode, type) {
  return fetch(801037, {
    category,
    entityCode,
    type
  });
}
