<template>
  <transition name="slide">
    <div class="search-wrapper">
      <header>
        <div class="inner">
          <div class="search">
            <div class="search-icon"></div>
            <input v-focus type="text" ref="searchInput" placeholder="请输入商品名称" v-model="query"/>
            <i v-show="query" class="close-icon" @click="clearInput"></i>
          </div>
          <div class="cancel" @click="back">取消</div>
        </div>
      </header>
      <div v-show="query" class="result-wrapper">
        <scroll ref="resultScroll" :pullUpLoad="pullUpLoad" :data="list">
          <ul>
            <li v-for="item in list" class="border-bottom-1px" @click="saveSearch(item.code)">{{item.name}}</li>
          </ul>
        </scroll>
      </div>
      <div v-show="searchHistory.length && !query" class="history-wrapper">
        <div class="title">
          <h1>历史搜索</h1>
          <i class="del-icon" @click="showConfirm"></i>
        </div>
        <scroll @beforeScrollStart="blurInput" :data="searchHistory" ref="historyScroll" :pullUpLoad="pullUpLoad">
          <ul>
            <li v-for="item in searchHistory" @click="addQuery(item)">{{item}}</li>
          </ul>
        </scroll>
      </div>
      <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Confirm from 'base/confirm/confirm';
  import {mapGetters, mapActions} from 'vuex';
  import {debounce} from 'common/js/util';
  import {directiveMixin} from 'common/js/mixin';
  import {getPageGoods} from 'api/biz';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        query: '',
        list: []
      };
    },
    created() {
      this.pullUpLoad = null;
      this.$watch('query', debounce((newQuery) => {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.historyScroll.refresh();
          }, 20);
        } else {
          this.search();
        }
      }, 200));
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    methods: {
      search() {
        getPageGoods({
          start: 1,
          limit: 10,
          name: this.query
        }).then((data) => {
          this.list = data.list;
        });
      },
      addQuery(query) {
        this.query = query;
      },
      saveSearch(code) {
        this.saveSearchHistory(this.query);
        this.$router.push(this.$route.path + '/' + code);
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      blurInput() {
        this.$refs.searchInput.blur();
      },
      clearInput() {
        this.query = '';
      },
      back() {
        this.$router.back();
      },
      ...mapActions([
        'saveSearchHistory',
        'clearSearchHistory'
      ])
    },
    components: {
      Scroll,
      Confirm
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
      border-bottom: 1px solid $color-border;

      .inner {
        height: 0.6rem;
        display: flex;
        align-items: center;

        .search {
          flex: 1;
          height: 0.6rem;
          display: flex;
          align-items: center;
          border-radius: 0.3rem;
          background: #f3f4f8;

          .search-icon {
            flex: 0 0 0.54rem;
            height: 0.34rem;
            background-repeat: no-repeat;
            background-position: 0.2rem center;
            background-size: 0.24rem;
            @include bg-image('search');
          }

          input {
            flex: 1;
            font-size: $font-size-medium;
            background: transparent;
          }

          .close-icon {
            display: inline-block;
            width: 0.7rem;
            height: 0.34rem;
            background-size: 0.3rem;
            background-position: center;
            background-repeat: no-repeat;
            @include bg-image('close');
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
      position: absolute;
      top: 0.88rem;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.78rem 0.3rem 0.6rem;

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
        padding-bottom: 0.34rem;
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

    .result-wrapper {
      position: absolute;
      top: 0.88rem;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 0.3rem;

      li {
        padding-left: 0.3rem;
        height: 1rem;
        line-height: 1rem;
        @include border-bottom-1px($color-border);
        font-size: $font-size-medium;
        color: $color-text-l;

        &:last-child {
          @include border-none();
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
