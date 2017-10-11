<template>
  <transition name="slide">
    <div class="search-wrapper">
      <header>
        <div class="inner">
          <div class="search">
            <div class="search-icon"></div>
            <input type="text" placeholder="请输入商品名称" v-model="keyword"/>
          </div>
          <div class="cancel" @click="back">取消</div>
        </div>
      </header>
      <div v-show="keyword" class="result-wrapper">
        <scroll>
          <ul>
            <li></li>
          </ul>
        </scroll>
      </div>
      <div v-show="!keyword" class="history-wrapper">
        <div class="title">
          <h1>历史搜索</h1>
          <i class="del-icon" @click="clear"></i>
        </div>
        <scroll :pullUpLoad="pullUpLoad">
          <ul>
            <li>牙刷</li>
            <li>iphone</li>
            <li>牙刷</li>
            <li>iphone</li>
            <li>牙刷</li>
            <li>iphone</li>
            <li>牙刷</li>
            <li>iphone</li>
          </ul>
        </scroll>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';

  export default {
    data() {
      return {
        keyword: ''
      };
    },
    created() {
      this.pullUpLoad = null;
    },
    methods: {
      back() {
        this.$router.back();
      },
      clear() {}
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .search-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;

    header {
      height: 0.88rem;
      padding: 0.14rem 0 0.14rem 0.3rem;
      border-bottom: 1px solid #eee;

      .inner {
        height: 0.6rem;
        display: flex;
        align-items: center;

        .search {
          flex: 1;
          height: 0.6rem;
          display: flex;
          border-radius: 0.3rem;
          background: #f3f4f8;

          .search-icon {
            flex: 0 0 0.54rem;
            background-repeat: no-repeat;
            background-position: 0.2rem center;
            background-size: 0.24rem;
            @include bg-image('search');
          }

          input {
            flex: 1;
            padding-right: 0.3rem;
            font-size: $font-size-medium;
            background: transparent;
          }
        }

        .cancel {
          padding: 0 0.3rem;
          height: 0.6rem;
          line-height: 0.6rem;
          font-size: $font-size-medium-xx;
        }
      }
    }

    .history-wrapper {
      padding: 0.78rem 0.3rem 0.3rem;

      .title {
        position: relative;

        .del-icon {
          position: absolute;
          right: 0;
          top: 0;
          width: 0.5rem;
          height: 0.5rem;
          background-repeat: no-repeat;
          background-position: right top;
          background-size: 0.3rem;
          @include bg-image('delete');
        }
      }

      h1 {
        font-size: $font-size-medium-x;
        margin-bottom: 0.34rem;
      }

      ul {
        font-size: 0;

        li {
          display: inline-block;
          margin-bottom: 0.2rem;
          margin-right: 0.2rem;
          padding: 0.18rem 0.36rem;
          border-radius: 0.3rem;
          font-size: $font-size-medium-s;
          background: #f3f4f8;
        }
      }
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }
  }
</style>
