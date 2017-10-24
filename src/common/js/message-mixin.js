import {getSig, getAccountType, getTxAppCode, getUserId} from 'common/js/util';
import {getTencentParamsAPi} from 'api/user';

export const messageMixin = {
  created() {
    this.selToID = '';
    this.selType = '';
    this.selSess = '';
  },
  methods: {
    onConnNotify(resp) {
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
    },
    onMsgNotify(newMsgList) {
      var sess;
      var newMsg;
      // 获取所有聊天会话
      var sessMap = webim.MsgStore.sessMap();
      var msgList = [];

      for (var j in newMsgList) { // 遍历新消息
        newMsg = newMsgList[j];
        console.log(newMsg, newMsg.getSession());
        if (!this.selToID) { // 没有聊天对象
          this.selToID = newMsg.getSession().id();
          this.selType = newMsg.getSession().type();
          this.selSess = newMsg.getSession();
          // var headUrl;
          // if (this.selType == webim.SESSION_TYPE.C2C) {
          //   headUrl = friendHeadUrl;
          // } else {
          //   headUrl = groupHeadUrl;
          // }
          // addSess(this.selType, this.selToID, newMsg.getSession().name(), '', 0, 'sesslist'); // 新增一个对象
          // setSelSessStyleOn(this.selToID);
        }
        if (newMsg.getSession().id() === this.selToID) { // 为当前聊天对象的消息
          // 在聊天窗体中新增一条消息
          console.warn(newMsg);
          // addMsg(newMsg);
        }
        msgList.push(newMsg.elems[0].content.text);
      }
      // 消息已读上报，以及设置会话自动已读标记
      // webim.setAutoRead(selSess, true, true);

      for (var i in sessMap) {
        sess = sessMap[i];
        if (this.selToID !== sess.id()) { // 更新其他聊天对象的未读消息数
          // if (!dateStart) {
          //   dateStart = new Date();
          // }
          // updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread());
          console.debug(sess.id(), sess.unread());
          // dateEnd = new Date();
        }
      }
    },
    tencentLogin() {
      let loginInfo = {};
      loginInfo.identifier = getUserId();
      loginInfo.accountType = getAccountType();
      loginInfo.userSig = getSig();
      loginInfo.sdkAppID = getTxAppCode();
      loginInfo.appIDAt3rd = getTxAppCode();
      if (!loginInfo.sdkAppID || !loginInfo.accountType || !loginInfo.userSig) {
        getTencentParamsAPi().then((data) => {
          loginInfo.accountType = data.accountType;
          loginInfo.userSig = data.sig;
          loginInfo.sdkAppID = data.txAppCode;
          loginInfo.appIDAt3rd = data.txAppCode;
          this.login(loginInfo);
        });
      } else {
        this.login(loginInfo);
      }
    },
    login(loginInfo) {
      let listeners = {
        'onConnNotify': this.onConnNotify,
        'onMsgNotify': this.onMsgNotify
      };
      let options = {
        'isAccessFormalEnv': true,
        'isLogOn': false
      };
      var self = this;
      webim.login(
        loginInfo, listeners, options,
        function(resp) {
          console.log(resp);
          loginInfo.identifierNick = resp.identifierNick;
          loginInfo.headurl = resp.headurl;
          self.onMsgNotify();
        },
        function(err) {
          alert(err.ErrorInfo);
        }
      );
    }
  }
};