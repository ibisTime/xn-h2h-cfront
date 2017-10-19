<template>
  <transition name="slide-up">
    <div v-show="showFlag" class="show-map-wrapper">
      <div class="close" @click="hide"><i class="close-icon"></i></div>
      <div class="content" id="mapContainer"></div>
    </div>
  </transition>
</template>
<script>
  export default {
    props: {
      lng: {
        type: Number,
        default: 116.40
      },
      lat: {
        type: Number,
        default: 39.91
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    created() {},
    methods: {
      initMap() {
        let map = new AMap.Map('mapContainer', {
          resizeEnable: true,
          zoom: 13,
          center: [this.lng, this.lat]
        });
        /* eslint-disable no-new */
        new AMap.Marker({
          map: map,
          position: [this.lng, this.lat]
        });
      },
      show() {
        this.showFlag = true;
        this.initMap();
      },
      hide() {
        this.showFlag = false;
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";

  .show-map-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;

    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .close {
      position: absolute;
      top: 0;
      left: 0;
      width: 1.2rem;
      height: 1.2rem;
      z-index: 1;
      border-bottom-right-radius: 0.2rem;
      background: rgba(0, 0, 0, 0.3);

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

    &.slide-up-enter-active, &.slide-up-leave-active {
      transition: all 0.3s;
    }

    &.slide-up-enter, &.slide-up-leave-to {
      transform: translate3d(0, 100%, 0);
    }
  }
</style>
