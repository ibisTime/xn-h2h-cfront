<template>
  <div class="loading">
    <img src="./loading.gif">
    <p class="desc">{{title}}</p>
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

  .loading {
    width: 100%;
    text-align: center;
    font-size: 0;

    img {
      width: 0.48rem;
      height: 0.48rem;
    }

    .desc {
      line-height: 0.4rem;
      font-size: $font-size-small;
    }
  }
</style>
