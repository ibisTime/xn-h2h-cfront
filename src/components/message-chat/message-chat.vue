<template>
  <transition  name="slide">
    <div class="chat-wrapper"   @click='hide'>
      <scroll>
    	   <div class="message-content">
           <div class="receive">
              <span class="avatar"></span>
              <p>
                <span class="triangle-left"></span>
                <i>111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111</i>
              </p>
           </div>
           <div class="post">
              <span class="avatar"></span>
              <p>
                <span class="triangle-right"></span>
                <i>2222222</i>
              </p>
           </div>
         </div>
      </scroll>
      <div class="message-footer">
        <div class="message-input">
          <input type="text" placeholder="输入聊天内容"  v-model="emoji" @focus='hide'> 
          <span @click.stop="show"></span>
          <emoji ref="emoji" @select="selectItem"></emoji>
          <i @click="show"></i>
          <input class="file" type="file" :multiple="multiple" ref="fileInput" accept="image/*" @change="fileChange">        
        </div>        
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Emoji from 'base/emoji/emoji';
  import EXIF from 'exif-js';
  import {getImgData} from 'common/js/util';
  // import {webim} from 'common/js/webim';
  import Qiniu from 'base/qiniu/qiniu';

  export default {
    data () {
      return {
        emoji: [],
        photos: []
      };
    },
    created() {
      this.multiple = true;
    },
    methods: {
      show() {
        this.$refs.emoji.show();
      },
      hide() {
        this.$refs.emoji.hide();
      },
      selectItem (emoji) {
        this.emoji.push(emoji);
      },
      // 检查文件类型和大小
      // checkFile(file) {
      //   // var legalExts = 'jpg|jpeg|png|bmp|gif|webp|txt|doc|docx|xls|ppt|zip|rar|gz';
      //   // var ext = obj.value.substr(obj.value.lastIndexOf(".") + 1).toLowerCase();//获得文件后缀名
      //   // var pos = legalExts.indexOf(ext);
      //   // if (pos < 0) {
      //   //    alert("您选中的文件类型非法，请重新选择");
      //   //    return false;
      //   // }
      //   let fileSize = Math.round(file.size / 1024 * 100) / 100; // 单位为KB
      //   if (fileSize > 20 * 1024) {
      //     alert('您选择的文件大小超过限制(最大为20M)，请重新选择');
      //     return false;
      //   }
      //   return true;
      // },

      // // 上传文件
      // uploadFile() {
      //   // let uploadFiles = document.getElementByClassName('file');
      //   // let file = uploadFiles.files[0];
      //   // 先检查图片类型和大小
      //   // if (!checkFile(file)) {
      //   //   return;
      //   // }
      //   let businessType, selType, selToID;// 业务类型，1-发群文件，2-向好友发文件
      //   if (selType === webim.SESSION_TYPE.C2C) { // 向好友发文件
      //     businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG;
      //   } else if (selType === webim.SESSION_TYPE.GROUP) { // 发群文件
      //     businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.GROUP_MSG;
      //   }
      //   // 封装上传文件请求
      //   let opt = {
      //     'toAccount': selToID, // 接收者
      //     'businessType': businessType, // 文件的使用业务类型
      //     'fileType': webim.UPLOAD_RES_TYPE.FILE, // 表示文件
      //     'fileMd5': '6f25dc54dc2cd47375e8b43045de642a', // 文件md5
      //     'totalSize': 56805, // 文件大小,Byte
      //     'base64Str': // 文件base64编码
      //           ''
      //   };
      //   webim.uploadPicByBase64(opt,
      //     function (resp) {
      //       // alert('success');
      //       // 发送文件
      //       // sendFile(resp);
      //     },
      //     function (err) {
      //       alert(err.ErrorInfo);
      //     }
      //   );
      // },

      fileChange(e) {
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        let self = this;
        let len = files.length;
        for (let i = 0; i < files.length; i++) {
          (function (i) {
            let file = files[i];
            let orientation;

            EXIF.getData(file, function() {
              orientation = EXIF.getTag(this, 'Orientation');
            });
            let reader = new FileReader();
            reader.onload = function(e) {
              getImgData(file.type, this.result, orientation, function(data) {
                let _url = URL.createObjectURL(file);
                let item = {
                  preview: data,
                  ok: false,
                  type: file.type,
                  key: _url.split('/').pop() + '.' + file.name.split('.').pop()
                };
                self.photos.push(item);
                self.uploadFile(data, item.key).then(() => {
                  item = {
                    ...item,
                    ok: true
                  };
                  self.updatePhotos(item);
                }).catch((err) => {
                  self.onUploadError(err);
                });
                if (i + 1 === len) {
                  self.$refs.fileInput.value = null;
                }
              });
            };
            console.log(file);
            reader.readAsDataURL(file);
          })(i);
        }
      }
    },
    components: {
      Scroll,
      Emoji,
      Qiniu
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
        min-width:3rem;
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
        min-width:3rem;
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
