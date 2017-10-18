<template>
  <transition name="slide">
    <div class="rule-wrapper">
      <div class="rule-title border-bottom-1px"> 签到规则</div>
      <div class="rule-content" v-html='text'></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getUserSystemConfig} from 'api/general';

  export default {
    data () {
      return {
        text: ''
      };
    },
    created() {
      this.showRule();
    },
    methods: {
      showRule () {
        getUserSystemConfig('cardsTradition').then((data) => {
          this.text = data.cvalue;
        }).catch(() => {
          this.text = '暂无';
        });
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~common/scss/mixin";

  .rule-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }

    .rule-title{
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      text-align: center; 
      @include border-bottom-1px(#eee);
      font-size: 0.32rem;
    }

    .rule-content{
      font-size: 0.24rem;
    }
  }
</style>
