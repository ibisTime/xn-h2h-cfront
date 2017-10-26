<template>
  <div class="message-wrapper">
    <div class="content-wrapper">
      <message-list></message-list>
    </div>
    <m-footer @goPublish="goPublish"></m-footer>
  </div>
</template>
<script>
  import MFooter from 'components/m-footer/m-footer';
  import MessageList from 'components/message-list/message-list';

  export default {
    methods: {
      goPublish () {
        this.$router.push('/message/publish');
      }
    },
    components: {
      MFooter,
      MessageList
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .message-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 1rem;
    color: #484848;

    .message-title {
      width: 100%;
      height: 0.9rem;
      line-height: 0.9rem;
      background: #fff;
      @include border-top-1px(#F2F2F2);
      @include border-bottom-1px(#F2F2F2);
      font-size: $font-size-medium-xx;

      ul {
        display: flex;

        li {
          flex: 1;
          height: 0.9rem;
          text-align: center;
          display: block;

          &.active {
            border-bottom: 0.05rem solid #48b0fb;
            box-sizing: border-box;
            color: #48b0fb;

          }
        }
      }
    }
  }
</style>
