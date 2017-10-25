import {getSig, getAccountType, getTxAppCode, getUserId} from 'common/js/util';
import {addMsg} from 'common/js/message';
import {getTencentParamsAPi} from 'api/user';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import {SET_TENCENT_LOGINED} from 'store/mutation-types';

export const messageMixin = {
  computed: {
    ...mapGetters([
      'curChatUserId'
    ])
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
          webim.Log.warn(info);
          break;
        case webim.CONNECTION_STATUS.RECONNECT:
          info = '连接状态恢复正常: ' + resp.ErrorInfo;
          webim.Log.warn(info);
          break;
        default:
          webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
          break;
      }
    },
    onMsgNotify(newMsgList) {
      var selSess;
      // 获取所有聊天会话
      var sessMap = webim.MsgStore.sessMap();
      // 遍历新消息
      for (var j in newMsgList) {
        var newMsg = newMsgList[j];
        // 为当前聊天对象的消息
        if (newMsg.getSession().id() === this.curChatUserId) {
          selSess = newMsg.getSession();
          this.saveChatHistory(addMsg(newMsg, newMsg.getSession().id()));
        }
      }
      // 消息已读上报，以及设置会话自动已读标记
      webim.setAutoRead(selSess, true, true);
      debugger;
      for (var i in sessMap) {
        var sess = sessMap[i];
        // 更新其他聊天对象的未读消息数
        if (this.curChatUserId !== sess.id()) {
          console.debug(sess.id(), sess.unread());
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
      webim.login(loginInfo, listeners, options, function() {
        self.setTententLogined(true);
        self.onMsgNotify();
      }, function() {
        self.setTententLogined(false);
      });
    },
    ...mapMutations({
      setTententLogined: SET_TENCENT_LOGINED
    }),
    ...mapActions([
      'saveChatHistory'
    ])
  }
};
