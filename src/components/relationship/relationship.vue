<template>
  <transition name="slide">
    <div class="follows-fans-wrapper">
      <div class="top-category border-bottom-1px">
        <div @click="selectItem(0)" class="item" :class="itemCls(0)">
          <div class="inner">我的关注(0)</div>
        </div>
        <div @click="selectItem(1)" class="item" :class="itemCls(1)">
          <div class="inner">我的粉丝(0)</div>
        </div>
      </div>
      <div class="content">
        <scroll :data="currentList" :hasMore="hasMore" @pullingUp="getRelations">
          <div v-for="item in currentList" class="item border-bottom-1px">
            <div class="img"><img :src="item.photo"/></div>
            <div class="info">
              <div class="name">{{item.nickname}}</div>
              <div class="desc">{{item.getDescription()}}</div>
            </div>
          </div>
        </scroll>
        <div v-show="!hasMore && !currentList.length" class="no-result-wrapper">
          <no-result :title="title"></no-result>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import {setTitle} from 'common/js/util';
  import {getPageFollowUsers, getPageFans} from 'api/user';
  import User from 'common/bean/user';

  export default {
    data() {
      return {
        relationList: {},
        currentList: [],
        currentIndex: 0,
        hasMore: true
      };
    },
    created() {
      this.first = true;
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    computed: {
      title() {
        return this.currentIndex === 0 ? '还没有任何关注哦' : '还没有任何粉丝哦';
      }
    },
    methods: {
      shouldGetData() {
        if (this.$route.path === '/user/relation') {
          setTitle('关注和粉丝');
          return this.first;
        }
        return false;
      },
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          this.relationList[this.currentIndex] = {
            start: 1,
            limit: 10,
            hasMore: true,
            data: []
          };
          this.getRelations();
        }
      },
      getRelations() {
        let item = this.relationList[this.currentIndex];
        if (this.currentIndex === 0) {
          this.getPageFollowUsers(item);
        } else {
          this.getPageFans(item);
        }
      },
      getPageFollowUsers(item) {
        getPageFollowUsers(item.start, item.limit).then((data) => {
          item.data = item.data.concat(data.list);
          if (data.list.length < item.limit || data.totalCount <= item.limit) {
            item.hasMore = false;
          }
          this.currentList = item.data;
          this.hasMore = item.hasMore;
          item.start++;
        });
      },
      getPageFans(item) {
        getPageFans(item.start, item.limit).then((data) => {
          let list = data.list.map((user) => {
            return new User(user);
          });
          item.data = item.data.concat(list);
          if (data.list.length < item.limit || data.totalCount <= item.limit) {
            item.hasMore = false;
          }
          this.currentList = item.data;
          this.hasMore = item.hasMore;
          item.start++;
        });
      },
      selectItem(index) {
        this.currentIndex = index;
        if (!this.relationList[index]) {
          this.currentList = [];
          this.relationList[index] = {
            start: 1,
            limit: 10,
            hasMore: true,
            data: []
          };
          this.getRelations();
        } else {
          this.currentList = this.relationList[index].data;
        }
        this.hasMore = this.relationList[index].hasMore;
      },
      itemCls(index) {
        return this.currentIndex === index ? 'active' : '';
      }
    },
    components: {
      Scroll,
      NoResult
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .follows-fans-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    .top-category {
      display: flex;
      height: 0.9rem;
      line-height: 0.9rem;
      @include border-bottom-1px($color-border);
      text-align: center;
      font-size: 0;
      background-color: #fff;

      .item {
        flex: 1;
        display: inline-block;
        font-size: $font-size-medium-xx;

        .inner {
          position: relative;
          display: inline-block;
        }

        &.active {
          color: $primary-color;

          .inner:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background: $primary-color;
          }
        }
      }
    }

    .content {
      position: absolute;
      top: 1.1rem;
      bottom: 0;
      left: 0;
      width: 100%;

      .item {
        display: flex;
        align-items: center;
        padding: 0.15rem 0.3rem;
        @include border-bottom-1px($color-border);
        background-color: #fff;

        &:last-child {
          @include border-none();
        }

        .img {
          width: 0.9rem;
          height: 0.9rem;
          flex: 0 0 0.9rem;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .info {
          flex: 1;
          padding-left: 0.2rem;
          overflow: hidden;

          .name {
            font-size: $font-size-medium-xx;
          }

          .desc {
            padding-top: 0.14rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: $font-size-medium-x;
            color: $color-text-l;
          }
        }
      }
    }

    .no-result-wrapper {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
