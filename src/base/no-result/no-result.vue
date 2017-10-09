<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .no-result {
    text-align: center;

    .no-result-icon {
      width: 1.72rem;
      height: 1.8rem;
      margin: 0 auto;
      background-image: url('no-result.png');
      background-size: 1.72rem 1.8rem;
    }
    .no-result-text {
      margin-top: 0.6rem;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
</style>
