<template>
  <transition  name="slide">
    <div class="chat-wrapper" @click='hide'>
      <scroll :data="curChatList"  :pullUpLoad="pullUpLoad" rel="chatData">
        <div v-for="info in curChatList"  class="message-content">
          <div class="receive" v-if="isSendReceive(info)">
            <span class="avatar"></span>
            <p>
              <span class="triangle-left"></span>
              <i v-html="getContent(info)"></i>
            </p>
           </div>                
           <div v-else class="post clearfix">
              <span class="avatar"></span>
              <p>
                <span class="triangle-right"></span>
                <i v-html="getContent(info)"></i>
              </p>
           </div>
         </div>
      </scroll>
      <div class="message-footer">
        <div class="message-input">
          <input type="text" placeholder="输入聊天内容"  v-model="emoji" @keyup.enter="dealMessage" class="msgedit"> 
          <span @click.stop="show"></span>
          <emoji ref="emoji" @select="selectItem"></emoji>
          <i @click="show"></i>
          <input class="file" type="file" :multiple="multiple" ref="fileInput" @change="uploadPic" accept="image/*" >    
        </div>        
      </div>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex';
  import Scroll from 'base/scroll/scroll';
  import Emoji from 'base/emoji/emoji';
  import {onSendMsg, getLastC2CHistoryMsgs, addMsg} from 'common/js/message';
  import {getUserId, debounce} from 'common/js/util';
  import {SET_CHAT_USERID, SET_CHAT_LIST} from 'store/mutation-types';
  // import {onMsgNotify} from 'common/js/message-mixin';

  const selType = webim.SESSION_TYPE.C2C;

  export default {
    data () {
      return {
        text: '',
        emoji: '',
        photos: []
      };
    },
    created() {
      this.pullUpLoad = null;
      this.multiple = false;
      this.selToID = this.$route.params.id;
      this.selSess = null;
      this.$watch('chatData', debounce((newData) => {
        if (!newData) {
          setTimeout(() => {
            this.$refs.chatData.refresh();
          }, 20);
        };
      }, 200));
      // this.dealMessage();
      this.getHistoryMessage();
    },
    computed: {
      ...mapGetters([
        'curChatList',
        'curChatUserId'
      ])
    },
    methods: {
      show() {
        this.$refs.emoji.show();
      },
      hide() {
        this.$refs.emoji.hide();
      },
      selectItem (emoji) {
        this.emoji += emoji;
      },
      dealMessage() {
        onSendMsg(this.emoji, (info) => {
          this.saveChatHistory(info);
        });
      },
      getContent(item) {
        let html = '';
        item.elems.forEach((msg) => {
          if(msg.type === 'TIMTextElem') {
            html += `<i>${msg.content.text}</i>`;
          } else if (msg.type === 'TIMFaceElem') {
            html += `<img src="${webim.Emotions[msg.content.index][1]}"/>`;
          } else if (msg.type === 'TIMImageElem') {
            html += `<img src="${msg.content.ImageInfoArray[0].url}" style="width: 4rem;"/>`;
          }
        });
        return html;
      },
      isSendReceive(info) {
        if (info.fromUser === this.curChatUserId) {
          return true;
        } else {
          return false;
        }
      },
      getHistoryMessage() {
        getLastC2CHistoryMsgs((info) => {
          let _list = this.curChatList.slice();
          _list = info.concat(_list);
          this.setCurChatList(_list);
        });
      },
      uploadPic(e) {
        console.log('test');
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        files = Array.prototype.slice.call(files, 0, 1);
        let self = this;
        let file = files[0];
        // 封装上传图片请求
        var opt = {
          'file': file, // 图片对象
          'onProgressCallBack': self.onProgressCallBack, // 上传图片进度条回调函数
          // 'abortButton': document.getElementById('upd_abort'), // 停止上传图片按钮
          'To_Account': self.selToID, // 接收者
          'businessType': webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG // 业务类型
        };
        // 上传图片
        webim.uploadPic(opt,
          function(resp) {
            self.sendPic(resp, file.name);
          },
          function(err) {
            alert(err.ErrorInfo);
          }
        );
      },
      sendPic(images, imgName) {
        if (!this.selToID) {
          alert('您还没有好友，暂不能聊天');
          return;
        }

        if (!this.selSess) {
          this.selSess = new webim.Session(selType, this.selToID, this.selToID, '', Math.round(new Date().getTime() / 1000));
        }
        var msg = new webim.Msg(this.selSess, true, -1, -1, -1, getUserId(), 0, 'ppp');
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
        // if(imgName){
        //     var data=imgName;// 通过自定义消息中的data字段保存图片名称
        //     var custom_obj = new webim.Msg.Elem.Custom(data, '', '');
        //     msg.addCustom(custom_obj);
        // }
        var self = this;
        // 调用发送图片消息接口
        webim.sendMsg(msg, function(resp) {
          if (selType === webim.SESSION_TYPE.C2C) {
            self.saveChatHistory(addMsg(msg));
          }
        }, function(err) {
          alert(err.ErrorInfo);
        });
      },
      onProgressCallBack() {},
      ...mapMutations({
        setCurChatUserId: SET_CHAT_USERID,
        setCurChatList: SET_CHAT_LIST
      }),
      ...mapActions([
        'saveChatHistory'
      ])

    },
    components: {
      Scroll,
      Emoji
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

  .message-content{
    height: 100%;
    font-size: 0;
    p,span{
      display: inline-block;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    p{
      position: relative;
      padding:0 0.2rem;
      vertical-align: top;
      word-wrap: break-word;
      background: #fff;
      border-radius: 0.2rem;
      i{
        display: block;
        padding: 0.2rem;
        font-style:normal
      }      
    }    
    .receive{
      width: 6.9rem;
      min-height:1rem;
      margin: 0.3rem;
      
      .avatar{
        width:0.76rem;
        height:0.76rem;
        @include bg-image('heads');
      }
      p{
        max-width:4.8rem;
        min-height:1rem;
        box-sizing:content-box;
        margin-left: 0.4rem;
        font-size:$font-size-medium-xx;
        .triangle-left {
          position: absolute;
          left: -0.2rem;
          top: 0.2rem;
          display: inline-block;
          width:0;   
          height:0;   
          border-top:0.25rem solid transparent;   
          border-bottom:0.25rem solid transparent;   
          border-right:0.25rem solid #fff;
        }
      }
    }

    .post{
      width: 6.9rem;
      min-height:1rem;
      margin: 0.3rem;
      p, span{
        float: right;
        font-size:$font-size-medium-xx;
      }
      .avatar{
        width:0.76rem;
        height:0.76rem;
        @include bg-image('heads');
      }
      p{
        max-width: 4.8rem;
        min-height:0.95rem;
        box-sizing:content-box;
        margin-right: 0.4rem;
        .triangle-right {
          position: absolute;
          right: -0.2rem;
          top: 0.2rem;
          display: inline-block;
          width:0;   
          height:0;   
          border-top:0.25rem solid transparent;   
          border-bottom:0.25rem solid transparent;   
          border-left:0.25rem solid #fff;
        }
      }
    }
  }

  .message-footer{
    position: fixed;
    bottom: 0;
    left: 0;      
    width: 100%;
    min-height: 1rem;
    background-color: #fff;

    .message-input{
      position: relative;
      display: flex;
      padding: 0.15rem 0.36rem;
      width: 100%;
      height: 1rem;
      font-size: 0;
      border: 1px solid #eee;      
      input{
        display: inline-block;
        width: 5.3rem;
        height: 0.7rem;
        border: 1px solid #eee;
        border-radius: 0.1rem;
        text-indent: 0.25rem;
        font-size: $font-size-medium-x;
      }
      span{
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
      i{
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
      .emoji{
        position: absolute;
        right: 0.2rem;
        bottom: 0.8rem;
        
      }
      .file{
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
