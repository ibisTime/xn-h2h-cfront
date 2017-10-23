<template>
  <transition  name="slide">
    <div class="chat-wrapper" @click='hide'>
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
          <input type="text" placeholder="输入聊天内容"  v-model="emoji" @keyup.enter="dealMessage" class="msgedit"> 
          <span @click.stop="show"></span>
          <emoji ref="emoji" @select="selectItem"></emoji>
          <i @click="show"></i>
          <input class="file" type="file" :multiple="multiple" ref="fileInput" accept="image/*" >        
        </div>        
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Emoji from 'base/emoji/emoji';
  import {onSendMsg, getHistoryMsgCallback} from 'static/webim/message';

  export default {
    data () {
      return {
        emoji: '',
        photos: []
      };
    },
    created() {
      this.multiple = true;
      // this.dealMessage();
      this.getMessage();
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
        onSendMsg();
      },
      getMessage() {
        getHistoryMsgCallback();
      }
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
