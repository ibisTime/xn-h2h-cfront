<template>
  <div class="recommend-wrapper">
    <m-header title="邀请好友" actText="推荐历史" :border="border" @action="goHistory"></m-header>
    <div class="content">
      <div class="main">
        <button @click="showTJ">点击邀请好友</button>
        <div class="title">活动规则</div>
        <div class="info">
          <ul>
            <li>首次邀请5位</li>
            <li>首次邀请5位首次邀请5位首次邀请5位</li>
            <li>首次邀请5位首次邀请5位首次邀请5位首次邀请5位首次邀请5位</li>
          </ul>
        </div>
      </div>
    </div>
    <go-home></go-home>
    <share-mask ref="mask"></share-mask>
    <router-view></router-view>
  </div>
</template>
<script>
  import MHeader from 'components/m-header/m-header';
  import GoHome from 'components/go-home/go-home';
  import ShareMask from 'components/share-mask/share-mask';

  export default {
    created() {
      this.border = false;
    },
    methods: {
      showTJ() {
        this.$refs.mask.show();
      },
      goHistory() {
        this.$router.push('/home/recommend/history');
      }
    },
    components: {
      MHeader,
      GoHome,
      ShareMask
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .recommend-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .content {
      position: absolute;
      top: 0.88rem;
      left: 0;
      width: 100%;
      bottom: 0;
      background-size: 100% 100%;
      @include bg-image('bg');

      .main {
        position: absolute;
        top: 53%;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 0;

        button {
          width: 5.74rem;
          line-height: 0.96rem;
          border: 1px solid #383737;
          border-radius: 0.45rem;
          text-align: center;
          font-size: $font-size-large-s;
          color: #fff;
          background-color: $second-color;
        }

        .title {
          margin-top: 0.7rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 2.2rem;
          @include bg-image('title');
          font-size: $font-size-medium-xx;
        }

        .info {
          margin: 0.48rem 0.3rem 0;
          padding: 0.28rem 0.36rem;
          box-shadow: 0.1rem 0.1rem 0 rgba(0, 0, 0, 0.2);
          line-height: 0.4rem;
          font-size: $font-size-small;
          text-align: left;
          background-color: #fff;
        }
      }
    }
  }
</style>
