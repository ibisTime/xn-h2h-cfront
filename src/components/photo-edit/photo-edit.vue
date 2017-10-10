<template>
  <transition name="opacity">
    <div class="photo-edit-wrapper" v-show="showFlag">
      <div @click="hide" class="close"><i class="close-icon"></i></div>
      <img :src="url"/>
      <div class="bottom">
        <span class="delete" @click="del">删除</span>
        <span class="edit" @click="edit">编辑</span>
        <span class="chose" @click="chose">设为封面</span>
      </div>
      <clip-img @choseImage="updateImg"
                ref="clipImg"
                :imgType="type"
                :imgUrl="url"></clip-img>
    </div>
  </transition>
</template>
<script>
  import ClipImg from 'base/clip-img/clip-img';

  export default {
    props: {
      url: {
        type: String,
        default: ''
      },
      imgKey: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      del() {
        this.$emit('deleteImg', this.imgKey);
        this.hide();
      },
      edit() {
        this.$refs.clipImg.show();
      },
      /**
       * 设置为封面
       * */
      chose() {
        this.$emit('beMain', this.imgKey);
        this.hide();
      },
      /**
       * 保存裁剪后的图片
       * */
      updateImg(img) {
        this.$emit('updateImg', img, this.imgKey);
      }
    },
    components: {
      ClipImg
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .photo-edit-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: #000;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
    }

    .close {
      position: absolute;
      top: 0;
      left: 0;
      width: 1.2rem;
      height: 1.2rem;
      z-index: 1;
      border-bottom-right-radius: 0.2rem;
      background: rgba(0, 0, 0, 0.4);

      .close-icon {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 0.6rem;
        @include bg-image('close');
      }
    }

    .bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 0.8rem;
      line-height: 0.8rem;
      background: rgba(0, 0, 0, 0.4);
      z-index: 4;
      font-size: 0;
      font-weight: bold;
      text-align: center;

      span {
        display: inline-block;
        padding: 0 0.3rem;
        font-size: $font-size-medium;
        color: #fff;

        &.delete {
          float: left;
        }

        &.chose {
          float: right;
        }
      }
    }

    &.opacity-enter-active, &.opacity-leave-active {
      transition: all 0.3s;
    }

    &.opacity-enter, &.opacity-leave-to {
      opacity: 0;
    }
  }
</style>
