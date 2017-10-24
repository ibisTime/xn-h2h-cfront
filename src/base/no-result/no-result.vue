<template>
  <div class="no-result">
    <div class="no-result-icon" :style="getImg()"></div>
    <p class="no-result-text">{{title}}</p>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import noImg from './no-result.png';

  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      }
    },
    methods: {
      getImg() {
        return {
          backgroundImage: `url(${this.icon || noImg})`
        };
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .no-result {
    text-align: center;

    .no-result-icon {
      width: 2.4rem;
      height: 2rem;
      background-repeat: no-repeat;
      margin: 0 auto;
      background-size: 2.4rem;
    }
    .no-result-text {
      margin-top: 0.3rem;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
</style>
