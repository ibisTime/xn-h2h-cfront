<template>
  <span class="am-badge">
    <sup class="am-badge-text">{{text}}</sup>
  </span>
</template>
<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .am-badge {
    position: relative;
    display: inline-block;
    line-height: 1;
    vertical-align: middle;

    sup {
      vertical-align: baseline;
    }

    .am-badge-text {
      display: block;
      position: relative;
      top: auto;
      transform: translateX(0);
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      height: .36rem;
      line-height: .36rem;
      min-width: .18rem;
      border-radius: .24rem;
      padding: 0 .12rem;
      text-align: center;
      white-space: nowrap;
      transform-origin: -10% center;
      // z-index: 10;
      font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,SimSun,sans-serif;
      font-size: $font-size-small;
      background-color: $color-red;
      color: #fff;
    }
  }
</style>
