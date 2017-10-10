<template>
  <div class="go-wrapper">
    <router-link to="/home" class="icon-home"></router-link>
  </div>
</template>
<script>
  export default {};
</script>
<style lang="scss" scoped>
  .go-wrapper {
    position: fixed;
    bottom: 1.6rem;
    right: 0;
    width: 1rem;
    height: 1rem;
    border-top-left-radius: 0.08rem;
    border-bottom-left-radius: 0.08rem;
    background: rgba(0, 0, 0, 0.2);

    .icon-home {
      display: inline-block;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 0.6rem;
      background-image: url(./home.png);
    }
  }
</style>
