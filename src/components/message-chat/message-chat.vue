<template>
  <transition  name="slide">
    <div class="chat-wrapper" @click='hide'>
      <div class="message-wrapper">
        <scroll :data="curChatList"
                :pullUpLoad="pullUpLoad"
                :listenScroll="listenScroll"
                :probeType="probeType"
                @scroll="scroll"
                ref="scroll">
          <div v-show="hasMore" class="loading-wrapper">
            <loading title=""></loading>
          </div>
          <div v-for="(info,index) in curChatList" ref="mesRef" class="message-content">
            <div class="time-split"><div v-show="showTime(info, index)" class="time-content">{{getDate(info.time)}}</div></div>
            <div class="receive" v-if="!info.isSend">
              <span class="avatar"><img :src="info.icon"/></span>
              <div class="p-content">
                <span class="triangle-left"></span>
                <i>
                  <template v-for="item in getContent(info)">
                    <template v-if="item.type==='TIMTextElem'">{{item.content}}</template>
                    <img @load="handleLoad" v-else :src="item.content"/>
                  </template>
                </i>
              </div>
            </div>
            <div v-else class="post clearfix">
              <span class="avatar"><img :src="info.icon"/></span>
              <div class="p-content">
                <span class="triangle-right"></span>
                <i>
                  <template v-for="item in getContent(info)">
                    <template v-if="item.type==='TIMTextElem'">{{item.content}}</template>
                    <img @load="handleLoad" v-else :src="item.content"/>
                  </template>
                </i>
                <div @click="reSendMsg(info, index)" v-show="showErr(info)" class="error-icon"></div>
                <div class="loading-wrapper" v-show="showLoading(info)"><loading title=""></loading></div>
              </div>
            </div>
           </div>
        </scroll>
      </div>
      <div class="message-footer">
        <div class="message-input">
          <input type="text" placeholder="输入聊天内容" ref="inputText" v-model="emoji" @keyup.enter="dealMessage" class="msgedit"/>
          <span @click.stop="show"></span>
          <emoji ref="emoji" @select="selectItem"></emoji>
          <i @click="show"></i>
          <input class="file" type="file" :multiple="multiple" ref="fileInput" @change="uploadPic" accept="image/*"/>
        </div>
      </div>
      <toast :text="text" ref="toast"></toast>
      <full-loading v-show="loadingFlag"></full-loading>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex';
  import {SET_CHAT_USERID, SET_CHAT_LIST, SET_USER_STATE} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import Loading from 'base/loading/loading';
  import Emoji from 'base/emoji/emoji';
  import Toast from 'base/toast/toast';
  import {addMsg} from 'common/js/message';
  import {getUserId, isUnDefined, formatChatDate} from 'common/js/util';
  import User from 'common/bean/user';
  import {getUser, getUserById} from 'api/user';

  const selType = webim.SESSION_TYPE.C2C;
  const subType = webim.C2C_MSG_SUB_TYPE.COMMON;
  const LIMIT = 10;
  const ERR = -1;
  const SENDING = 0;
  const SUCCESS = 1;

  export default {
    data () {
      return {
        emoji: '',
        hasMore: true,
        text: '',
        receiver: null,
        showEmoji: false
      };
    },
    created() {
      this.firstUpdate = true;
      this.firstFetching = true;
      this.userId = getUserId();
      this.pullUpLoad = null;
      this.listenScroll = true;
      this.probeType = 3;
      this.multiple = false;
      this.selToID = this.$route.params.id;
      this.selSess = null;
      this.LastMsgTime = 0;
      this.MsgKey = '';
      this.msgMap = {};
      this.setCurChatList([]);
      this.setCurChatUserId(this.selToID);
      this.getInitData();
    },
    computed: {
      loadingFlag() {
        if (this.user && this.receiver && this.tencentLogined) {
          return !((!this.curChatList.length && !this.hasMore) || this.curChatList.length);
        }
        return true;
      },
      ...mapGetters([
        'user',
        'curChatList',
        'curChatUserId',
        'tencentLogined'
      ])
    },
    methods: {
      getInitData() {
        this.getUser();
        this.getReceiveUser();
      },
      getUser() {
        if (!this.user) {
          getUser().then((data) => {
            this.setUser(data);
          }).catch(() => {});
        }
      },
      getReceiveUser() {
        getUserById(this.selToID).then((data) => {
          this.receiver = new User(data);
        }).catch(() => {});
      },
      scroll(pos) {
        if (pos.y > -20 && !this.fetching && !this.firstFetching && this.hasMore) {
          this.fetching = true;
          this.getHistoryMessage();
        }
      },
      show() {
        if (this.showEmoji) {
          this.$refs.emoji.hide();
        } else {
          this.$refs.emoji.show();
        }
        this.showEmoji = !this.showEmoji;
      },
      hide() {
        this.showEmoji = false;
        this.$refs.emoji.hide();
      },
      selectItem (emoji) {
        this.emoji += emoji;
      },
      dealMessage() {
        this.$refs.inputText.blur();
        if (!isUnDefined(this.emoji) && this.emoji.trim() !== '') {
          this.onSendMsg(this.emoji, (info) => {
            this.saveChatHistory(info);
            setTimeout(() => {
              this.$refs.scroll.scrollToElement(this.$refs.mesRef[this.curChatList.length - 1], 100);
            }, 40);
          });
          this.emoji = '';
        } else {
          this.showToast('消息内容不能为空');
        }
      },
      getContent(item) {
        let arr = [];
        item.elems.forEach((msg) => {
          let _item = {
            type: msg.type
          };
          if(msg.type === 'TIMTextElem') {
            _item.content = msg.content.text;
          } else if (msg.type === 'TIMFaceElem') {
            _item.content = webim.Emotions[msg.content.index][1];
          } else if (msg.type === 'TIMImageElem') {
            _item.content = msg.content.ImageInfoArray[2].url;
          }
          arr.push(_item);
        });
        return arr;
      },
      getHistoryMessage() {
        let self = this;
        this.getLastC2CHistoryMsgs((info, complete) => {
          self.hasMore = !complete;
          if (info.length) {
            let list = self.curChatList.slice();
            let _list = self.getNewList(info);
            _list = _list.concat(list);
            self.setCurChatList(_list);
            self.updateChatData();
            if (self.firstFetching) {
              self.scrollToElement();
            } else {
              self.scrollToTop();
            }
          } else {
            self.firstFetching = false;
            self.fetching = false;
          }
        }, () => {
          setTimeout(() => {
            self.showToast('历史消息获取失败');
          }, 20);
        });
      },
      scrollToElement() {
        setTimeout(() => {
          this.$refs.scroll.scrollToElement(this.$refs.mesRef[this.curChatList.length - 1], 100);
          setTimeout(() => {
            this.firstFetching = false;
            this.fetching = false;
          }, 200);
        }, 40);
      },
      scrollToTop() {
        setTimeout(() => {
          let _y = this.hasMore && -40 || 0;
          this.$refs.scroll.scrollTo(0, _y);
          setTimeout(() => {
            this.fetching = false;
          }, 200);
        }, 40);
      },
      getNewList(list) {
        return list.map((item) => {
          if (item.fromAccount === this.userId) {
            return {
              ...item,
              icon: this.user.photo,
              photo: this.receiver.photo,
              fromAccountNick: this.user.nickname
            };
          } else {
            return {
              ...item,
              icon: this.receiver.photo,
              photo: this.receiver.photo,
              fromAccountNick: this.receiver.nickname
            };
          }
        });
      },
      updateChatData() {
        if (this.firstUpdate) {
          this.firstUpdate = false;
          this.updateMessages({
            sender: this.user,
            receiver: this.receiver
          });
        }
      },
      onSendMsg(msgContent, suc) {
        let msgLen = webim.Tool.getStrBytes(msgContent);
        let maxLen = webim.MSG_MAX_LENGTH.C2C;
        if (msgLen > maxLen) {
          this.showToast('消息长度超出限制(最多' + Math.round(maxLen / 3) + '汉字)');
          return;
        }
        this.handleMsgSend(msgContent, suc);
      },
      handleMsgSend(msgContent, suc) {
        if (!this.selSess) {
          this.selSess = new webim.Session(selType, this.selToID, this.selToID, this.user.photo, Math.round(new Date().getTime() / 1000));
        }
        let random = Math.round(Math.random() * 4294967296); // 消息随机数，用于去重
        let msgTime = Math.round(new Date().getTime() / 1000); // 消息时间戳
        let msg = new webim.Msg(this.selSess, true, -1, random, msgTime, this.userId, subType, this.user.nickname);
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
        let result = addMsg(msg, this.selToID, this.receiver.photo);
        result.msg.status = SENDING;
        this.addMsg2CurList(result.msg);
        if (!this.msgMap[msg.uniqueId]) {
          this.msgMap[msg.uniqueId] = msg;
        }
        webim.sendMsg(msg, () => {
          if (selType === webim.SESSION_TYPE.C2C) {
            let newMsg = {
              toUser: result.toUser,
              fromUser: result.fromUser,
              msg: {
                ...result.msg,
                status: SUCCESS
              }
            };
            suc && suc(newMsg);
          }
        }, () => {
          let newMsg = {
            toUser: result.toUser,
            fromUser: result.fromUser,
            msg: {
              ...result.msg,
              status: ERR
            }
          };
          this.updateCurStatus(newMsg.msg);
          this.showToast('消息发送失败，请重新发送');
        });
      },
      updateCurStatus(msg, idx) {
        let list = this.curChatList.slice();
        let index = list.findIndex((item) => {
          return item.uniqueId === msg.uniqueId;
        });
        list.splice(index, 1, msg);
        this.setCurChatList(list);
        setTimeout(() => {
          let _idx = isUnDefined(idx) ? this.curChatList.length - 1 : idx;
          this.$refs.scroll.scrollToElement(this.$refs.mesRef[_idx], 100);
        }, 40);
      },
      addMsg2CurList(msg) {
        let list = this.curChatList.slice();
        list.push(msg);
        this.setCurChatList(list);
        setTimeout(() => {
          this.$refs.scroll.scrollToElement(this.$refs.mesRef[this.curChatList.length - 1], 100);
        }, 40);
      },
      uploadPic(e) {
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        files = Array.prototype.slice.call(files, 0, 1);
        let self = this;
        webim.uploadPic({
          'file': files[0],
          'onProgressCallBack': self.onProgressCallBack,
          'To_Account': self.selToID,
          'businessType': webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG
        }, function(resp) {
          self.sendPic(resp);
        }, function() {
          self.showToast('图片发送失败，请重新发送');
        });
      },
      sendPic(images) {
        if (!this.selSess) {
          this.selSess = new webim.Session(selType, this.selToID, this.selToID, '', Math.round(new Date().getTime() / 1000));
        }
        var msg = new webim.Msg(this.selSess, true, -1, -1, -1, this.userId, 0, this.user.nickname);
        var imagesObj = new webim.Msg.Elem.Images(images.File_UUID);
        for (var i in images.URL_INFO) {
          var img = images.URL_INFO[i];
          var newImg;
          var type;
          switch (img.PIC_TYPE) {
            case 1: // 原图
              type = 1; // 原图
              break;
            case 2: // 小图（缩略图）
              type = 3; // 小图
              break;
            case 4: // 大图
              type = 2; // 大图
              break;
          }
          newImg = new webim.Msg.Elem.Images.Image(type, img.PIC_Size, img.PIC_Width, img.PIC_Height, img.DownUrl);
          imagesObj.addImage(newImg);
        }
        msg.addImage(imagesObj);
        let result = addMsg(msg, this.selToID, this.receiver.photo);
        result.msg.status = SENDING;
        this.addMsg2CurList(result.msg);
        if (!this.msgMap[msg.uniqueId]) {
          this.msgMap[msg.uniqueId] = msg;
        }
        webim.sendMsg(msg, () => {
          this.$refs.fileInput.value = null;
          if (selType === webim.SESSION_TYPE.C2C) {
            let newMsg = {
              toUser: result.toUser,
              fromUser: result.fromUser,
              msg: {
                ...result.msg,
                status: SUCCESS
              }
            };
            this.saveChatHistory(newMsg);
            setTimeout(() => {
              this.$refs.scroll.scrollToElement(this.$refs.mesRef[this.curChatList.length - 1], 100);
            }, 40);
          }
        }, () => {
          let newMsg = {
            toUser: result.toUser,
            fromUser: result.fromUser,
            msg: {
              ...result.msg,
              status: ERR
            }
          };
          this.updateCurStatus(newMsg.msg);
          this.showToast('消息发送失败，请重新发送');
        });
      },
      onProgressCallBack() {},
      getLastC2CHistoryMsgs(cbOk, cbError) {
        webim.MsgStore.delSessByTypeId(selType, this.selToID);
        webim.getC2CHistoryMsgs({
          'Peer_Account': this.selToID,
          'MaxCnt': LIMIT,
          'LastMsgTime': this.LastMsgTime, // 最近的消息时间，即从这个时间点向前拉取历史消息
          'MsgKey': this.MsgKey
        }, (resp) => {
          // 是否还有历史消息可以拉取，1-表示没有，0-表示有
          var complete = resp.Complete;
          if (resp.MsgList.length === 0) {
            cbOk([], true);
          }
          // 保留服务器返回的最近消息时间和消息Key, 用于下次向前拉取历史消息
          this.LastMsgTime = resp.LastMsgTime;
          this.MsgKey = resp.MsgKey;
          if (cbOk) {
            var _list = resp.MsgList.map((item) => {
              return addMsg(item, this.selToID).msg;
            });
            cbOk(_list, !!complete);
          }
        }, cbError);
      },
      showToast(msg) {
        this.text = msg;
        this.$refs.toast.show();
      },
      handleLoad() {
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 20);
      },
      showTime(item, index) {
        if (!index) {
          return true;
        }
        let prevItem = this.curChatList[index - 1];
        return (item.time - prevItem.time) >= 60;
      },
      getDate(timestamp) {
        return formatChatDate(timestamp * 1000, true);
      },
      showLoading(item) {
        return item.status === SENDING;
      },
      showErr(item) {
        return item.status === ERR;
      },
      reSendMsg(item, index) {
        let msg = this.msgMap[item.uniqueId];
        let result = addMsg(msg, this.selToID, this.receiver.photo);
        result.msg.status = SENDING;
        this.updateCurStatus(result.msg, index);
        webim.sendMsg(msg, () => {
          if (selType === webim.SESSION_TYPE.C2C) {
            let newMsg = {
              toUser: result.toUser,
              fromUser: result.fromUser,
              msg: {
                ...result.msg,
                status: SUCCESS
              }
            };
            this.saveChatHistory(newMsg);
            setTimeout(() => {
              this.$refs.scroll.scrollToElement(this.$refs.mesRef[index], 100);
            }, 40);
          }
        }, () => {
          let newMsg = {
            toUser: result.toUser,
            fromUser: result.fromUser,
            msg: {
              ...result.msg,
              status: ERR
            }
          };
          this.updateCurStatus(newMsg.msg);
          this.showToast('消息发送失败，请重新发送');
        });
      },
      ...mapMutations({
        setCurChatUserId: SET_CHAT_USERID,
        setCurChatList: SET_CHAT_LIST,
        setUser: SET_USER_STATE
      }),
      ...mapActions([
        'saveChatHistory',
        'updateMessages'
      ])
    },
    beforeDestroy() {
      this.setCurChatUserId('');
      this.setCurChatList([]);
    },
    watch: {
      tencentLogined(newVal) {
        if (this.receiver && newVal && this.user) {
          this.getHistoryMessage();
        }
      },
      user(newVal) {
        if (this.receiver && newVal && this.tencentLogined) {
          this.getHistoryMessage();
        }
      },
      receiver(newVal) {
        if (this.user && newVal && this.tencentLogined) {
          this.getHistoryMessage();
        }
      }
    },
    components: {
      Scroll,
      Emoji,
      Toast,
      Loading,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .chat-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: #f7f7f7;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }

    .message-content {
      font-size: 0;
      padding: 0 0.3rem;

      .error-icon {
        width: 1rem;
        height: 1rem;
        background-size: 0.6rem;
        background-repeat: no-repeat;
        background-position: center;
        @include bg-image('gth');
      }

      &:last-child {
        padding-bottom: 0.3rem;
      }

      .time-split {
        padding: 0.3rem 0;
        text-align: center;
        font-size: 0;

        .time-content {
          display: inline-block;
          padding: 0.1rem;
          border-radius: 0.1rem;
          font-size: $font-size-small;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.1);
        }
      }

      .p-content, span {
        display: inline-block;
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      .p-content {
        position: relative;
        vertical-align: top;
        word-wrap: break-word;
        background: #fff;
        border-radius: 0.1rem;

        i {
          display: block;
          padding: 0.2rem;
          line-height: 0.38rem;
          font-style: normal;
        }
      }
      .receive {
        width: 6.9rem;

        .loading-wrapper {
          position: absolute;
          top: 50%;
          right: -0.1rem;
          transform: translate(100%, -50%);
        }

        .error-icon {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(100%, -50%);
        }

        .avatar {
          width: 0.76rem;
          height: 0.76rem;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .p-content {
          max-width: 4.8rem;
          box-sizing: content-box;
          margin-left: 0.4rem;
          font-size: $font-size-medium-xx;

          .triangle-left {
            position: absolute;
            left: -0.2rem;
            top: 0.1rem;
            display: inline-block;
            width: 0;
            height: 0;
            border-top: 0.25rem solid transparent;
            border-bottom: 0.25rem solid transparent;
            border-right: 0.25rem solid #fff;
          }

          img {
            max-width: 100%;
            vertical-align: bottom;
          }
        }
      }

      .post {
        width: 6.9rem;

        .loading-wrapper {
          position: absolute;
          top: 50%;
          left: -0.1rem;
          transform: translate(-100%, -50%);
        }

        .error-icon {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-100%, -50%);
        }

        .p-content, span {
          float: right;
          font-size:$font-size-medium-xx;
        }

        .avatar {
          width: 0.76rem;
          height: 0.76rem;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .p-content {
          max-width: 4.8rem;
          box-sizing: content-box;
          margin-right: 0.4rem;

          .triangle-right {
            position: absolute;
            right: -0.2rem;
            top: 0.1rem;
            display: inline-block;
            width: 0;
            height: 0;
            border-top: 0.25rem solid transparent;
            border-bottom: 0.25rem solid transparent;
            border-left: 0.25rem solid #fff;
          }

          img {
            max-width: 100%;
            vertical-align: bottom;
          }
        }
      }
    }

    .message-wrapper {
      position: absolute;
      top: 0;
      bottom: 1rem;
      width: 100%;
    }

    .message-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1rem;
      background-color: #fff;

      .message-input {
        position: relative;
        display: flex;
        padding: 0.15rem 0.36rem;
        width: 100%;
        height: 1rem;
        font-size: 0;
        border: 1px solid #eee;

        input {
          display: inline-block;
          width: 5.3rem;
          height: 0.7rem;
          border: 1px solid #eee;
          border-radius: 0.1rem;
          text-indent: 0.25rem;
          font-size: $font-size-medium-x;
        }

        span {
          position: absolute;
          right: 1.1rem;
          bottom: 0.2rem;
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          margin-left: 0.2rem;
          margin-top: 0.1rem;
          @include bg-image('emoji');
          background-size: 100%;
          background-position: center;
        }

        i {
          position: absolute;
          right: 0.4rem;
          bottom: 0.2rem;
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          margin-left: 0.2rem;
          margin-top: 0.1rem;
          @include bg-image('add');
          background-size: 100%;
          background-position: center;
        }

        .emoji {
          position: absolute;
          right: 0.2rem;
          bottom: 0.8rem;

        }

        .file {
          position: absolute;
          top: 0.2rem;
          right: 0.4rem;
          width: 0.5rem;
          height: 0.5rem;
          opacity: 0;
          z-index: 100;
        }
      }
    }
  }
</style>
