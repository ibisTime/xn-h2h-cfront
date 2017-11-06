import {getSig, getAccountType, getTxAppCode, getUserId} from 'common/js/util';
import {addMsg, setProfilePortrait, getProfilePortrait} from 'common/js/message';
import {getTencentParamsAPi, getUser} from 'api/user';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import {SET_TENCENT_LOGINED, SET_USER_STATE} from 'store/mutation-types';

export const messageMixin = {
  computed: {
    ...mapGetters([
      'curChatUserId',
      'userMap',
      'user'
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
      for (var j in newMsgList) {
        var newMsg = newMsgList[j];
        if (newMsg.getSession().id() === this.curChatUserId) {
          selSess = newMsg.getSession();
        }
        let photo = '';
        let user = this.userMap[newMsg.fromAccount];
        if (user) {
          newMsg.fromAccountNick = user.nickname;
          photo = user.photo;
          this.saveChatHistory(addMsg(newMsg, newMsg.getSession().id(), photo));
        } else {
          var self = this;
          getProfilePortrait(newMsg.fromAccount, function(res) {
            newMsg.fromAccountNick = res.nickname;
            photo = res.photo;
            self.updateUserMap({
              userId: newMsg.fromAccount,
              nickname: res.nickname,
              photo: res.photo
            });
            self.saveChatHistory(addMsg(newMsg, newMsg.getSession().id(), photo));
          }, function() {
            self.saveChatHistory(addMsg(newMsg, newMsg.getSession().id(), photo));
          });
        }
      }
      webim.setAutoRead(selSess, true, true);
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
        getUser().then((data) => {
          self.setUser(data);
          let gender = self.user.gender;
          let nickname = self.user.nickname;
          let photo = data.photo;
          setProfilePortrait({gender, nickname, photo});
        });
        self.setTententLogined(true);
        self.onMsgNotify();
      }, function() {
        self.setTententLogined(false);
      });
    },
    ...mapMutations({
      setTententLogined: SET_TENCENT_LOGINED,
      setUser: SET_USER_STATE
    }),
    ...mapActions([
      'saveChatHistory',
      'updateUserMap'
    ])
  }
};
