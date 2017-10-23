<template>
  <transition name="slide">
    <div class="follows-fans-wrapper">
      <div class="top-category border-bottom-1px">
        <div @click="selectItem(0)" class="item" :class="itemCls(0)">
          <div class="inner">我的关注({{totalFollowNum}})</div>
        </div>
        <div @click="selectItem(1)" class="item" :class="itemCls(1)">
          <div class="inner">我的粉丝({{totalFansNum}})</div>
        </div>
      </div>
      <div class="content">
        <scroll :data="currentList" :hasMore="hasMore" @pullingUp="getRelations">
          <div v-for="item in currentList" @click="goCenter(item)" class="item border-bottom-1px">
            <div class="img"><img :src="item.photo | formatAvatar"/></div>
            <div class="info">
              <div class="name">{{item.nickname}}</div>
            </div>
          </div>
        </scroll>
        <div v-show="!hasMore && !currentList.length" class="no-result-wrapper">
          <div class="no-result-icon"></div>
          <div class="no-result-text">{{title}}</div>
        </div>
      </div>
      <router-view @updateFollow="handleUpdate"></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import {setTitle} from 'common/js/util';
  import {commonMixin} from 'common/js/mixin';
  import {getPageFollowUsers, getPageFans, getUser} from 'api/user';

  export default {
    mixins: [commonMixin],
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
      let type = this.$route.query.type || 0;
      this.currentIndex = +type;
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    computed: {
      title() {
        return this.currentIndex === 0 ? '还没有任何关注哦' : '还没有任何粉丝哦';
      },
      totalFollowNum() {
        return this.user && this.user.totalFollowNum || 0;
      },
      totalFansNum() {
        return this.user && this.user.totalFansNum || 0;
      },
      ...mapGetters([
        'user'
      ])
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
          if (!this.user) {
            getUser().then((data) => {
              this.setUser(data);
            });
          }
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
          item.data = item.data.concat(data.list);
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
      },
      handleUpdate(isFollow, info) {
        if (this.relationList[0]) {
          if (isFollow) {
            this.relationList[0].data.unshift(info);
          } else {
            let index = this.relationList[0].data.findIndex((item) => {
              return item.userId === info.userId;
            });
            this.relationList[0].data.splice(index, 1);
          }
          if (this.currentIndex === 0) {
            this.currentList = this.relationList[0].data;
          }
        }
      },
      goCenter(user) {
        this.$router.push(this.$route.path + '/' + user.userId);
      },
      ...mapMutations({
        'setUser': SET_USER_STATE
      })
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
      top: 1.2rem;
      left: 0;
      width: 100%;
      text-align: center;

      .no-result-icon {
        width: 3rem;
        height: 3rem;
        margin: 0 auto;
        @include bg-image('no-result');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
      }
      .no-result-text {
        margin-top: 0.2rem;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
