import {getUserId, formatAvatar} from 'common/js/util';

export function addMsg(msg, selToID) {
  var sess = msg.sess;
  if (!webim.MsgStore.sessMap[sess._impl.id]) {
    webim.MsgStore.sessMap[sess._impl.id] = sess;
  }
  let {fromAccount, fromAccountNick, time, uniqueId, random, isSend, elems} = msg;
  let _elems = elems.map((item) => {
    let obj = {
      type: item.type
    };
    if (item.type === 'TIMImageElem') {
      let imgInfoArray = item.content.ImageInfoArray.map((image) => {
        return {
          url: image.url
        };
      });
      obj.content = {
        ImageInfoArray: imgInfoArray
      };
    } else if (item.type === 'TIMFaceElem') {
      obj.content = {
        data: item.content.data,
        index: item.content.index
      };
    } else if (item.type === 'TIMTextElem') {
      obj.content = {
        text: item.content.text
      };
    }
    return obj;
  });
  let _msg = {
    fromAccount,
    fromAccountNick,
    time,
    uniqueId,
    random,
    isSend,
    icon: formatAvatar(msg.getSession().icon()),
    elems: _elems
  };
  var toUser = selToID;
  var fromUser = getUserId();
  return {
    msg: _msg,
    toUser,
    fromUser
  };
};
