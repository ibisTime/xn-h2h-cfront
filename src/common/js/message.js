import {getUserId} from 'common/js/util';

const selType = webim.SESSION_TYPE.C2C; // 当前聊天类型
var selToID = 'U11111111111111112'; // 当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
// const msgLists = [];
var getPrePageC2CHistroyMsgInfoMap = {};

export function getHistoryMsgCallback(msgList, prepage) {
  debugger;
  console.log('拉取历史消息了');
  console.log(msgList);
  var msg;
  prepage = prepage || false;

  // 如果是加载前几页的消息，消息体需要prepend，所以先倒排一下
  if (prepage) {
    msgList.reverse();
  }

  for (var j in msgList) { // 遍历新消息
    msg = msgList[j];
    if (msg.getSession().id() === selToID) { // 为当前聊天对象的消息
      console.log(msg.getSession());
      // let selSess = msg.getSession();
      // 在聊天窗体中新增一条消息
      // addMsg(msg, prepage);
    }
  }
  //  消息已读上报，并将当前会话的消息设置成自动已读
  //  webim.setAutoRead(selSess, true, true);
}

// 获取最新的c2c历史消息,用于切换好友聊天，重新拉取好友的聊天消息
export function getLastC2CHistoryMsgs(cbOk, cbError) {
  if (!selToID || selToID === '@TIM#SYSTEM') {
    alert('当前的聊天id非法，selToID=' + selToID);
    return;
  }
  var lastMsgTime = 0; // 第一次拉取好友历史消息时，必须传0
  var msgKey = '';
  var options = {
    'Peer_Account': selToID, // 好友帐号
    'MaxCnt': 5, // 拉取消息条数
    'LastMsgTime': lastMsgTime, // 最近的消息时间，即从这个时间点向前拉取历史消息
    'MsgKey': msgKey
  };
  // let selSess;
  webim.MsgStore.delSessByTypeId(selType, selToID);

  webim.getC2CHistoryMsgs(
    options,
    function(resp) {
      // var complete = resp.Complete; // 是否还有历史消息可以拉取，1-表示没有，0-表示有

      if (resp.MsgList.length === 0) {
        webim.Log.warn('没有历史消息了:data=' + JSON.stringify(options));
        return;
      }
      getPrePageC2CHistroyMsgInfoMap[selToID] = { // 保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
        'LastMsgTime': resp.LastMsgTime,
        'MsgKey': resp.MsgKey
      };
      // 清空聊天界面
      // document.getElementsByClassName('msgflow')[0].innerHTML = '';
      if (cbOk) {
        var _list = resp.MsgList.map((item) => {
          return addMsg(item).msg;
        });
        cbOk(_list);
      }
    },
    cbError
  );
};

// 向上翻页，获取更早的好友历史消息
// var getPrePageC2CHistoryMsgs = function(cbOk, cbError) {
//   if (selType === webim.SESSION_TYPE.GROUP) {
//     alert('当前的聊天类型为群聊天，不能进行拉取好友历史消息操作');
//     return;
//   }
//   var tempInfo = getPrePageC2CHistroyMsgInfoMap[selToID]; // 获取下一次拉取的c2c消息时间和消息Key
//   var lastMsgTime;
//   var msgKey;
//   if (tempInfo) {
//     lastMsgTime = tempInfo.LastMsgTime;
//     msgKey = tempInfo.MsgKey;
//   } else {
//     alert('获取下一次拉取的c2c消息时间和消息Key为空');
//     return;
//   }
//   var options = {
//     'Peer_Account': selToID, // 好友帐号
//     'MaxCnt': reqMsgCount, // 拉取消息条数
//     'LastMsgTime': lastMsgTime, // 最近的消息时间，即从这个时间点向前拉取历史消息
//     'MsgKey': msgKey
//   };
//   webim.getC2CHistoryMsgs(
//     options,
//     function(resp) {
//       var complete = resp.Complete; // 是否还有历史消息可以拉取，1-表示没有，0-表示有
//       if (resp.MsgList.length == 0) {
//         webim.Log.warn("没有历史消息了:data=" + JSON.stringify(options));
//         return;
//       }
//       getPrePageC2CHistroyMsgInfoMap[selToID] = { // 保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
//         'LastMsgTime': resp.LastMsgTime,
//         'MsgKey': resp.MsgKey
//       };
//       if (cbOk) {
//         cbOk(resp.MsgList);
//       } else {
//         getHistoryMsgCallback(resp.MsgList, true);
//       }
//     },
//     cbError
//   );
// };
//  监听新消息事件
// newMsgList 为新消息数组，结构为[Msg]
// function onMsgNotify(newMsgList) {
//   alert(newMsgList);
//   var sess, newMsg;
//   // 获取所有聊天会话
//   var sessMap = webim.MsgStore.sessMap();

//   for (var j in newMsgList) { // 遍历新消息
//     newMsg = newMsgList[j];

//     if (newMsg.getSession().id() === selToID) { // 为当前聊天对象的消息
//       selSess = newMsg.getSession();
//       // 在聊天窗体中新增一条消息
//       console.warn(newMsg);
//       addMsg(newMsg);
//     }
//   }
//   // 消息已读上报，以及设置会话自动已读标记
//   webim.setAutoRead(selSess, true, true);
//   for (var i in sessMap) {
//     sess = sessMap[i];
//     if (selToID !== sess.id()) { // 更新其他聊天对象的未读消息数
//       updateSessDiv(sess.type(), sess.id(), sess.unread());
//     }
//   }
// }

// // 更新最近会话的未读消息数
// function updateSessDiv(sessType, toId, name, unreadMsgCount) {
//   var badgeDiv = document.getElementById('badgeDiv_' + toId);
//   if (badgeDiv && unreadMsgCount > 0) {
//     if (unreadMsgCount >= 100) {
//       unreadMsgCount = '99+';
//     }
//     badgeDiv.innerHTML = '<span>' + unreadMsgCount + '</span>';
//     badgeDiv.style.display = 'block';
//   } else if (badgeDiv === null) { // 没有找到对应的聊天id
//     var headUrl;
//     if (sessType === webim.SESSION_TYPE.C2C) {
//       headUrl = friendHeadUrl;
//     } else {
//       headUrl = groupHeadUrl;
//     }
//     addSess(sessType, toId, name, headUrl, unreadMsgCount, 'sesslist');
//   }
// }

// 新增一条最近会话
// function addSess(sessType, toId, name, faceUrl, unreadMsgCount, sesslist, addPositonType) {
//   var sessDivId = 'sessDiv_' + toId;
//   var sessDiv = document.getElementById(sessDivId);
//   if (sessDiv) { // 先判断是否存在会话DIV，已经存在，则不需要增加
//     return;
//   }
//   var sessList = document.getElementsByClassName(sesslist)[0];
//   sessDiv = document.createElement('div');
//   sessDiv.id = sessDivId;
//   // 如果当前选中的用户是最后一个用户
//   sessDiv.className = 'sessinfo';
//   // 添加单击用户头像事件
//   sessDiv.onclick = function() {
//     if (sessDiv.className === 'sessinfo-sel') return;
//     onSelSess(sessType, toId);
//   };
//   var faceImg = document.createElement('img');
//   faceImg.id = 'faceImg_' + toId;
//   faceImg.className = 'face';
//   faceImg.src = faceUrl;

//   if (name.length > maxNameLen) { // 名称过长，截取一部分
//     name = name.substr(0, maxNameLen) + '...';
//   }

//   var delchat = document.createElement('div');
//   delchat.className = 'delChat';
//   delchat.innerHTML = '删除会话';
//   delchat.onclick = function(e) {
//     var selSess = webim.MsgStore.sessByTypeId(sessType, toId);
//     if (sessType === 'C2C') {
//       sessType = 1;
//       webim.setAutoRead(selSess, true, false);
//     } else {
//       sessType = 2;
//       webim.groupMsgReaded({
//         'GroupId': toId,
//         'MsgReadedSeq': selSess._impl.curMaxMsgSeq
//       });
//     }
//     delChat(sessType, toId);
//     e.preventDefault();
//     e.stopPropagation();
//     return false;
//   };

//   var nameDiv = document.createElement('div');
//   nameDiv.id = 'nameDiv_' + toId;
//   nameDiv.className = 'name';
//   nameDiv.innerHTML = name;
//   var badgeDiv = document.createElement('div');
//   badgeDiv.id = 'badgeDiv_' + toId;
//   badgeDiv.className = 'badge';
//   if (unreadMsgCount > 0) {
//     if (unreadMsgCount >= 100) {
//       unreadMsgCount = '99+';
//     }
//     badgeDiv.innerHTML = '<span>' + unreadMsgCount + '</span>';
//     badgeDiv.style.display = 'block';
//   }
//   sessDiv.appendChild(faceImg);
//   sessDiv.appendChild(nameDiv);
//   sessDiv.appendChild(badgeDiv);
//   sessDiv.appendChild(delchat);
//   if (!addPositonType || addPositonType === 'TAIL') {
//     sessList.appendChild(sessDiv); // 默认插入尾部
//   } else if (addPositonType === 'HEAD') {
//     sessList.insertBefore(sessDiv); // 插入头部
//   } else {
//     console.log(webim.Log.error('未知addPositonType' + addPositonType));
//   }
// }

export function onSendMsg(msgContent, suc) {
  if (!selToID) {
    alert('你还没有选中好友或者群组，暂不能聊天');
    return;
  }
  let msgLen = webim.Tool.getStrBytes(msgContent);
  if (msgContent.length < 1) {
    alert('发送的消息不能为空!');
    return;
  }
  let maxLen, errInfo;
  if (selType === webim.SESSION_TYPE.C2C) {
    maxLen = webim.MSG_MAX_LENGTH.C2C;
    errInfo = '消息长度超出限制(最多' + Math.round(maxLen / 3) + '汉字)';
  } else {
    maxLen = webim.MSG_MAX_LENGTH.GROUP;
    errInfo = '消息长度超出限制(最多' + Math.round(maxLen / 3) + '汉字)';
  }
  if (msgLen > maxLen) {
    alert(errInfo);
    return;
  }
  // 发消息处理
  handleMsgSend(msgContent, suc);
}

function handleMsgSend(msgContent, suc) {
  // if (!selSess) {
  let selSess = new webim.Session(selType, selToID, selToID, Math.round(new Date().getTime() / 1000));
  // }
  let isSend = true; // 是否为自己发送
  let seq = -1; // 消息序列，-1表示sdk自动生成，用于去重
  let random = Math.round(Math.random() * 4294967296); // 消息随机数，用于去重
  let msgTime = Math.round(new Date().getTime() / 1000); // 消息时间戳
  let subType; // 消息子类型
  if (selType === webim.SESSION_TYPE.C2C) {
    subType = webim.C2C_MSG_SUB_TYPE.COMMON;
  } else {
    // webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
    // webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
    // webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
    // webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
  }
  let msg = new webim.Msg(selSess, isSend, seq, random, msgTime, getUserId(), subType);

  let textObj, faceObj, tmsg, emotionIndex, emotion, restMsgIndex;
  // 解析文本和表情
  let expr = /\[[^[\]]{1,3}\]/mg;
  let emotions = msgContent.match(expr);
  if (!emotions || emotions.length < 1) {
    textObj = new webim.Msg.Elem.Text(msgContent);
    msg.addText(textObj);
  } else {
    for (let i = 0; i < emotions.length; i++) {
      tmsg = msgContent.substring(0, msgContent.indexOf(emotions[i]));
      if (tmsg) {
        textObj = new webim.Msg.Elem.Text(tmsg);
        msg.addText(textObj);
      }
      emotionIndex = webim.EmotionDataIndexs[emotions[i]];
      emotion = webim.Emotions[emotionIndex];

      if (emotion) {
        faceObj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
        msg.addFace(faceObj);
      } else {
        textObj = new webim.Msg.Elem.Text(emotions[i]);
        msg.addText(textObj);
      }
      restMsgIndex = msgContent.indexOf(emotions[i]) + emotions[i].length;
      msgContent = msgContent.substring(restMsgIndex);
    }
    if (msgContent) {
      textObj = new webim.Msg.Elem.Text(msgContent);
      msg.addText(textObj);
    }
  }

  // msg.PushInfo = {
  //   'PushFlag': 0,
  //   'Desc': '测试离线推送内容', // 离线推送内容
  //   'Ext': '测试离线推送透传内容', // 离线推送透传内容
  //   'AndroidInfo': {
  //     'Sound': 'android.mp3' // 离线推送声音文件路径。
  //   },
  //   'ApnsInfo': {
  //     'Sound': 'apns.mp3', // 离线推送声音文件路径。
  //     'BadgeMode': 1
  //   }
  // };

  // msg.PushInfoBoolean = true; // 是否开启离线推送push同步
  // msg.sending = 1;
  // msg.originContent = msgContent;
  // webim.addMsg(msg);
  // $('#send_msg_text').val('');
  // turnoffFaces_box();

  webim.sendMsg(msg, function(resp) {
    console.log('发送成功了');
    if (selType === webim.SESSION_TYPE.C2C) { // 私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
      console.log(msg);
      suc && suc(addMsg(msg));
    }
  }, function(err) {
    console.log(err.ErrorInfo);
    // 提示重发
    // showReSend(msg);
  });
}

// function showReSend(msg) {
//   console.log('重发吧');
// resend a dom
// var resendBtn = $('<a href='javascript:;'>重发</a>');
// 绑定重发事件
// resendBtn.click(function() {
// 删除当前的dom
// $('#id_' + msg.random).remove();
// 发消息处理
// handleMsgSend(msg.originContent);
// });
//  $('#id_' + msg.random).find('.spinner').empty().append(resendBtn);
// }
export function addMsg(msg) {
  var sess = msg.sess;
  if (!webim.MsgStore.sessMap[sess._impl.id]) {
    webim.MsgStore.sessMap[sess._impl.id] = sess;
  }
  let {fromAccount, fromAccountNick, time, uniqueId, random, isSend, elems} = msg;
  console.log(msg);
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