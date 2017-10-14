import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';

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
