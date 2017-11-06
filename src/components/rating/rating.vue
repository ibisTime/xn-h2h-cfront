<template>
  <transition name="slide-up">
    <div v-show="showFlag" class="rating-wrapper" @click.stop>
      <div class="close" @click="hide">
        <i class="close-icon close-icon0"></i>
        <i class="close-icon close-icon1"></i>
      </div>
      <div class="rating-form">
        <div class="item">
          <textarea placeholder="请输入评价内容" v-model="content" @input="valid" rows="5"></textarea>
          <span class="error">{{contErr}}</span>
        </div>
        <div class="btn">
          <button :disabled="disabled" @click="handleRating">提交</button>
        </div>
      </div>
      <toast ref="toast" :text="text"></toast>
    </div>
  </transition>
</template>
<script>
  import {orderRating, goodsRating} from 'api/biz';
  import Toast from 'base/toast/toast';
  import {isUnDefined} from 'common/js/util';

  export default {
    data() {
      return {
        content: '',
        contErr: '',
        disabled: false,
        showFlag: false,
        text: ''
      };
    },
    props: {
      orderCode: {
        type: String,
        default: ''
      },
      parentCode: {
        type: String,
        default: ''
      },
      user: {
        type: Object,
        default: null
      }
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      handleRating() {
        if (this.valid()) {
          this.disabled = true;
          if (this.orderCode) {
            this.orderRating();
          } else {
            this.goodsRating();
          }
        }
      },
      orderRating() {
        orderRating(this.content, this.orderCode, this.parentCode).then((data) => {
          this.disabled = false;
          if (/filter/.test(data[0])) {
            this.text = '您的评论存在敏感词，我们将进行审核';
          } else {
            this.text = '评价成功';
          }
          this.$refs.toast.show();
          this.$emit('ratingSuc', this.orderCode);
          this.content = '';
          setTimeout(() => {
            this.showFlag = false;
          }, 2000);
        }).catch(() => {
          this.disabled = false;
        });
      },
      goodsRating() {
        goodsRating(this.content, this.parentCode).then((data) => {
          this.disabled = false;
          let reg = /filter/.test(data.code);
          if (reg) {
            this.text = '您的评论存在敏感词，我们将进行审核';
          } else {
            this.text = '评价成功';
            this.$emit('ratingSuc', {
              code: data.code,
              content: this.content,
              nickname: this.user.nickname || '用户',
              commentDatetime: new Date(),
              photo: this.user.photo
            });
          }
          this.content = '';
          this.$refs.toast.show();
          setTimeout(() => {
            this.showFlag = false;
          }, 2000);
        }).catch(() => {
          this.disabled = false;
        });
      },
      valid() {
        if (isUnDefined(this.content)) {
          this.contErr = '不能为空';
          return false;
        }
        if (this.content.length > 200) {
          this.contErr = '长度不能超过200位';
          return false;
        }
        this.contErr = '';
        return true;
      }
    },
    components: {
      Toast
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .rating-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0.36rem;
    z-index: 102;
    background: #fff;

    .close {
      position: absolute;
      width: 0.8rem;
      height: 0.8rem;

      .close-icon {
        position: absolute;
        width: 0.06rem;
        height: 0.6rem;
        background: #666;
        left: 0.36rem;

        &.close-icon0 {
          transform: rotateZ(45deg);
        }

        &.close-icon1 {
          transform: rotateZ(-45deg);
        }
      }
    }

    .rating-form {
      margin-top: 1rem;

      .item {
        position: relative;
        margin-top: 0.3rem;
        font-size: 0;

        textarea {
          border: 1px solid #9d9d9d;
          border-radius: 0.08rem;
          width: 100%;
          line-height: 1.3;
          font-size: $font-size-medium;
          padding: 0.12rem;
        }

        .error {
          display: inline-block;
          padding-top: 0.12rem;
          font-size: $font-size-medium;
          color: #ff0000;
        }
      }

      .btn {
        margin-top: 0.4rem;

        button {
          display: block;
          width: 100%;
          line-height: 0.8rem;
          border-radius: 0.12rem;
          font-size: $font-size-medium-xx;
          background: $primary-color;
          color: #fff;

          &[disabled] {
            background: $color-disable-background;
          }
        }
      }
    }
  }

  .slide-up-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-up-enter, .slide-leave-to {
    transform: translate3d(0, 100%, 0);
  }
</style>
