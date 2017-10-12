<template>
  <div class="message-wrapper">
    <scroll>
      <div class="message-title">
        <ul class="clearfix">
          <li class="attention">我的关注</li>
          <li class="fans">我的粉丝</li>
        </ul>        
      </div>
        <div class="split"></div>    
      <router-view></router-view>
    </scroll>
    <m-footer></m-footer>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MFooter from 'components/m-footer/m-footer';

  export default {
    data() {
      return {};
    },
    methods: {},
    components: {
      Scroll,
      MFooter
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";
  
  .message-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 1rem;
    font-size: $font-size-medium-xx;

    .message-title{
      width: 100%;
      height: 0.9rem;
      // padding: 0.3rem 1rem;
      background: #fff;
      @include border-top-1px(#F2F2F2);
      @include border-bottom-1px(#F2F2F2);

      ul{
        li{
          float: left;
          margin: 0.3rem 1.3rem;
        }
      }
    }

  }

</style>
