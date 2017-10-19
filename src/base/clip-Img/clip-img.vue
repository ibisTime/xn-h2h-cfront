<template>
  <transition name="slide-up">
    <div>
      <img ref="oriImg" style="visibility: hidden" crossOrigin="anonymous" :src="imgSrc"/>
      <div v-show="showFlag" ref="wrapper" class="clip-wrapper">
        <img class="origin" :src="imgSrc"/>
        <img ref="clipImg" @load="handleLoad" :src="imgSrc"/>
        <div ref="clipBox"
             class="clip-box"
             @touchstart="handleTouchStart"
             @touchmove.stop.prevent="handleTouchMove"></div>
        <div class="bottom">
          <span class="cancel" @click.stop="cancel">取消</span><span class="chose" @click.stop="choseImg">完成</span>
        </div>
        <canvas class="canvas" ref="canvas"></canvas>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    props: {
      imgUrl: {
        type: String,
        default: ''
      },
      imgType: {
        type: String,
        default: 'image/png'
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    computed: {
      imgSrc() {
        let index = this.imgUrl.indexOf('?imageMogr2');
        let url = this.imgUrl;
        if(index !== -1) {
          url = this.imgUrl.substr(0, index);
        }
        return url;
      }
    },
    created() {
      this.touch = {};
      this.maxTop = 0;
      this.minTop = 0;
      this.clipX = 0;
      this.clipY = 0;
      this.cWidth = 0;
      this.cHeight = 0;
    },
    methods: {
      handleLoad() {
        if (this.showFlag) {
          this.calculate();
        }
      },
      getPixelRatio(context) {
        let backingStore = context.backingStorePixelRatio ||
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
      },
      calculate() {
        let ratio = 1;
        if (this.$refs.canvas.getContext) {
          let context = this.$refs.canvas.getContext('2d');
          ratio = this.getPixelRatio(context);
        }
        this.cWidth = this.$refs.wrapper.offsetWidth * ratio / 2;
        let top = this.$refs.clipBox.offsetTop;
        let right = this.$refs.clipBox.offsetWidth;
        let bottom = this.$refs.clipBox.offsetHeight + top;
        if (this.$refs.clipImg.offsetHeight < this.$refs.clipBox.offsetHeight) {
          this.cHeight = this.$refs.clipImg.offsetHeight * ratio / 2;
          this.maxTop = (this.$refs.wrapper.offsetHeight - this.$refs.clipImg.offsetHeight) / 2;
          this.minTop = this.maxTop - (this.$refs.clipBox.offsetHeight - this.$refs.clipImg.offsetHeight);
          top = 0;
          bottom = this.$refs.clipImg.offsetHeight;
        } else {
          this.cHeight = this.cWidth;
          this.minTop = (this.$refs.wrapper.offsetHeight - this.$refs.clipImg.offsetHeight) / 2;
          this.maxTop = this.minTop + this.$refs.clipImg.offsetHeight - this.$refs.clipBox.offsetHeight;
          top -= (this.$refs.wrapper.offsetHeight - this.$refs.clipImg.offsetHeight) / 2;
          bottom -= (this.$refs.wrapper.offsetHeight - this.$refs.clipImg.offsetHeight) / 2;
        }
        this.clipY = top;
        this.$refs.clipImg.style.clip = `rect(${top}px,${right}px,${bottom}px,0)`;
      },
      show() {
        this.showFlag = true;
        setTimeout(() => {
          this.$refs.clipBox.style.top = (this.$refs.wrapper.offsetHeight - this.$refs.clipBox.offsetHeight) / 2 + 'px';
          setTimeout(() => {
            this.calculate();
          }, 20);
        }, 20);
      },
      hide() {
        this.showFlag = false;
      },
      cancel() {
        this.hide();
        this.$emit('cancel');
      },
      handleTouchStart(e) {
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
      },
      handleTouchMove(e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let delta = (this.touch.y2 - this.touch.y1) / 10;
        let origTop = Number.parseFloat(this.$refs.clipBox.style.top);
        let newTop = Math.min(this.maxTop, Math.max(this.minTop, origTop + delta));
        if (newTop === this.minTop || newTop === this.maxTop) {
          this.touch.y1 = this.touch.y2;
        }
        this.$refs.clipBox.style.top = newTop + 'px';
        let top = newTop;
        let right = this.$refs.clipBox.offsetWidth;
        let bottom = this.$refs.clipBox.offsetHeight + top;
        if (this.$refs.clipImg.offsetHeight < this.$refs.clipBox.offsetHeight) {
          top = 0;
          bottom = this.$refs.clipImg.offsetHeight;
        } else {
          top -= (this.$refs.wrapper.offsetHeight - this.$refs.clipImg.offsetHeight) / 2;
          bottom -= (this.$refs.wrapper.offsetHeight - this.$refs.clipImg.offsetHeight) / 2;
        }
        this.clipY = top;
        this.$refs.clipImg.style.clip = `rect(${top}px,${right}px,${bottom}px,0)`;
      },
      choseImg() {
        let oriImgWidth = this.$refs.oriImg.offsetWidth;
        let oriImgHeight = this.$refs.oriImg.offsetHeight;
        let outerHeight = this.$refs.clipImg.offsetHeight;
        let outerWidth = this.$refs.clipImg.offsetWidth;
        let rateW = oriImgWidth / outerWidth;
        let rateH = oriImgHeight / outerHeight;
        let width = outerWidth;
        let height = this.$refs.clipBox.offsetHeight;
        if (height > outerHeight) {
          height = outerHeight;
        }
        this.getImgBase64(rateW, rateH, width, height);
      },
      getImgBase64(rateW, rateH, width, height) {
        let base64 = '';
        let self = this;
        let image = new Image();
        image.onload = function() {
          let canvas = document.createElement('canvas');
          canvas.width = self.cWidth;
          canvas.height = self.cHeight;
          let context1 = canvas.getContext('2d');
          context1.drawImage(this, self.clipX * rateW, self.clipY * rateH, width * rateW, height * rateH, 0, 0, self.cWidth, self.cHeight);
          base64 = canvas.toDataURL(self.imgType);
          self.hide();
          self.$emit('choseImage', base64);
        };
        image.onerror = function() {
          var timeStamp = +new Date();
          self.getImgBase64(self.imgUrl + '?' + timeStamp);
        };
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = this.imgUrl;
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .clip-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
    background: #000;

    &.slide-up-enter-active, &.slide-up-leave-active {
      transition: all 0.3s;
    }

    &.slide-up-enter, &.slide-up-leave-to {
      top: 100%;
    }

    img {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      max-height: 100%;
      transform: translate(0, -50%);
      z-index: 2;

      &.origin {
        opacity: 0.7;
        z-index: 1;
      }
    }

    .clip-box {
      position: absolute;
      left: 1px;
      right: 1px;
      height: 0;
      padding-top: 100%;
      border: 1px solid #fff;
      z-index: 3;
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

      span {
        padding: 0 0.6rem;
        font-size: $font-size-medium;
        color: #fff;

        &.chose {
          float: right;
        }
      }
    }

    .canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      visibility: hidden;
    }
  }
</style>
