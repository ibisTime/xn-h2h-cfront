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
 * 订单评论
 * @param {string} content
 * @param {string} orderCode
 */
export function orderRating (content, orderCode) {
  return fetch(801020, {
    content,
    orderCode,
    commenter: getUserId()
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
  return fetch(808065, params);
}
/**
 * 取消订单
 * */
export function cancelOrder(code, remark) {
  return fetch(808053, {
    code,
    remark
  });
}
/**
 * 订单确认收货
 * */
export function receiveOrder(code, remark) {
  return fetch(808057, {
    code,
    remark,
    updater: getUserId()
  });
}
/**
 * 订单评论
 * */
export function ratingOrder(orderCode, content) {
  return fetch(620211, {
    orderCode,
    content,
    commenter: getUserId()
  });
}

// 评论
export function rating(parentCode, content) {
  return fetch(620160, {
    parentCode,
    content,
    commenter: getUserId()
  });
}
