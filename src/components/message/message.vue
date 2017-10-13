<template>
  <div class="message-wrapper">
    <scroll>
      <div class="message-title">
        <ul class="clearfix">
          <li><router-link class='route-item' to='/message/attention'>我的关注(0)</router-link></li>
          <li><router-link class='route-item' to='/message/fans'>我的粉丝(0)</router-link></li>
        </ul>        
      </div>
        <!-- <div class="split"></div>     -->
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
      line-height: 0.9rem;
      background: #fff;
      @include border-top-1px(#F2F2F2);
      @include border-bottom-1px(#F2F2F2);
      ul{ 
        display: flex;       
        li{
          flex: 1;
          height: 0.9rem;
          text-align: center;
          .route-item{
            &:active{
              border-bottom: 4px solid #48b0fb;
              box-sizing:border-box;
              font-weight: 700;
              color: #48b0fb;            
            }            
          } 
        }
      }
    }

  }

</style>
