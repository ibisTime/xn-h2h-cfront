<template>
  <div class="full-loading-wrapper">
    <div class="full-loading">
      <div class="inner-loading">
        <img src="./loading.gif">
        <p class="desc">{{title}}</p>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  };
</script>
<style scoped lang="scss">
  @import "~common/scss/variable";

  .full-loading-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .full-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      max-width: 5rem;
      transform: translate(-50%, -50%);
      border-radius: 0.1rem;
      font-size: 0;
      background: rgba(0, 0, 0, 0.6);

      .inner-loading {
        display: flex;
        align-items: center;
        padding: 0.2rem 0.3rem;
      }

      img {
        width: 0.48rem;
        height: 0.48rem;
      }

      .desc {
        flex: 1;
        padding-left: 0.1rem;
        line-height: 0.4rem;
        font-size: $font-size-medium;
        color: #fff;
      }
    }
  }
</style>
