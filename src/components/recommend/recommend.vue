<template>
  <div class="recommend-wrapper">
  </div>
</template>
<script>
  export default {};
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";

  .recommend-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    @include bg-image('bg');
  }
</style>
