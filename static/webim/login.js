//帐号模式，0-表示独立模式，1-表示托管模式
// var accountMode = 1;
// var AdminAcount = 'qwe101';
// var selType = webim.SESSION_TYPE.C2C; //当前聊天类型
var selToID = null; //当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
// var selSess = 'C2C'; //当前聊天会话对象
// var recentSessMap = {}; //保存最近会话列表
// var reqRecentSessCount = 50; //每次请求的最近会话条数，业务可以自定义

// //默认好友头像
// var friendHeadUrl = 'img/friend.jpg'; //仅demo使用，用于没有设置过头像的好友
// //默认群头像
// var groupHeadUrl = 'img/group.jpg'; //仅demo使用，用于没有设置过群头像的情况
// //存放c2c或者群信息（c2c用户：c2c用户id，昵称，头像；群：群id，群名称，群头像）
// var infoMap = {}; //初始化时，可以先拉取我的好友和我的群组信息
// var maxNameLen = 12; //我的好友或群组列表中名称显示最大长度，仅demo用得到
// var reqMsgCount = 15; //每次请求的历史消息(c2c获取群)条数，仅demo用得到

// var pageSize = 15; //表格的每页条数，bootstrap table 分页时用到
// var totalCount = 200; //每次接口请求的条数，bootstrap table 分页时用到

// var emotionFlag = false; //是否打开过表情选择框

// var curPlayAudio = null; //当前正在播放的audio对象

// var getPrePageC2CHistroyMsgInfoMap = {}; //保留下一次拉取好友历史消息的信息
// var getPrePageGroupHistroyMsgInfoMap = {}; //保留下一次拉取群历史消息的信息

// var defaultSelGroupId = null; //登录默认选中的群id，选填，仅demo用得到


function initInfoMap(cbOk) {
  //读取我的好友列表
  initInfoMapByMyFriends(
    cbOk
  );
}

var initInfoMapByMyFriends = function(cbOK) {

  var options = {
    'From_Account': loginInfo.identifier,
    'TimeStamp': 0,
    'StartIndex': 0,
    'GetCount': totalCount,
    'LastStandardSequence': 0,
    "TagList": [
      "Tag_Profile_IM_Nick",
      "Tag_Profile_IM_Image"
    ]
  };

  webim.getAllFriend(
    options,
    function(resp) {
      if (resp.FriendNum > 0) {

        var friends = resp.InfoItem;
        if (!friends || friends.length == 0) {
          if (cbOK)
            cbOK();
          return;
        }
        var count = friends.length;

        for (var i = 0; i < count; i++) {
          var friend = friends[i];
          var friend_account = friend.Info_Account;
          var friend_name = friend_image = '';
          for (var j in friend.SnsProfileItem) {
            switch (friend.SnsProfileItem[j].Tag) {
              case 'Tag_Profile_IM_Nick':
                friend_name = friend.SnsProfileItem[j].Value;
                break;
              case 'Tag_Profile_IM_Image':
                friend_image = friend.SnsProfileItem[j].Value;
                break;
            }
          }
          var key = webim.SESSION_TYPE.C2C + "_" + friend_account;
          infoMap[key] = {
            'name': friend_name,
            'image': friend_image
          };
        }
        if (cbOK)
          cbOK();
      }
    },
    function(err) {
      alert(err.ErrorInfo);
    }
  );
};

function initInfoMapCallbackOK() {
  initRecentContactList(initRecentContactListCallbackOK);
}

//初始化我的最近会话列表框回调函数

function initRecentContactListCallbackOK() {
  onSelSess(selType, selToID);

}
// 监听连接状态回调变化事件
export function onConnNotify(resp) {
  var info;
  switch (resp.ErrorCode) {
    case webim.CONNECTION_STATUS.ON:
      webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
      break;
    case webim.CONNECTION_STATUS.OFF:
      info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
      // alert(info);
      webim.Log.warn(info);
      break;
    case webim.CONNECTION_STATUS.RECONNECT:
      info = '连接状态恢复正常: ' + resp.ErrorInfo;
      // alert(info);
      webim.Log.warn(info);
      break;
    default:
      webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
      break;
  }
}

//监听新消息事件
var msgList = [];
var dateStart = null;
var dateEnd = null;
//newMsgList 为新消息数组，结构为[Msg]
export function onMsgNotify(newMsgList) {
  alert(JSON.stringify(newMsgList));
  var sess, newMsg;
  //获取所有聊天会话
  var sessMap = webim.MsgStore.sessMap();

  for (var j in newMsgList) { //遍历新消息
    newMsg = newMsgList[j];
    alert(newMsg);
    if (!selToID) { //没有聊天对象
      selToID = newMsg.getSession().id();
      selType = newMsg.getSession().type();
      selSess = newMsg.getSession();
      var headUrl;
      if (selType == webim.SESSION_TYPE.C2C) {
        headUrl = friendHeadUrl;
      } else {
        headUrl = groupHeadUrl;
      }
      addSess(selType, selToID, newMsg.getSession().name(), headUrl, 0, 'sesslist'); //新增一个对象
      setSelSessStyleOn(selToID);
    }
    if (newMsg.getSession().id() == selToID) { //为当前聊天对象的消息
      //在聊天窗体中新增一条消息
      console.warn(newMsg);
      // addMsg(newMsg);
    }
    msgList.push(newMsg.elems[0].content.text);
  }
  //消息已读上报，以及设置会话自动已读标记
  // webim.setAutoRead(selSess, true, true);

  for (var i in sessMap) {
    sess = sessMap[i];
    if (selToID != sess.id()) { //更新其他聊天对象的未读消息数
      if (!dateStart) {
        dateStart = new Date();
      }
      updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread());
      console.debug(sess.id(), sess.unread());
      dateEnd = new Date();
    }
  }
}
