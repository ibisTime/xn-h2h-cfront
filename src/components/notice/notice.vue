<template>
  <transition name="slide">
    <div class="notices-wrapper">
      <scroll ref="scroll" :data="notices" :hasMore="hasMore" @pullingUp="getPageNotices">
        <div class="list-content">
          <div v-for="item in notices" class="item border-bottom-1px">
            <div class="img"><i></i></div>
            <div class="content">
              <div class="title">{{item.smsTitle}}</div>
              <div class="date">{{item.pushedDatetime | formatDate}}</div>
              <div class="desc">{{item.smsContent}}</div>
            </div>
          </div>
        </div>
      </scroll>
      <div v-show="!hasMore && !notices.length" class="no-result-wrapper">
        <no-result title="抱歉，暂无公告"></no-result>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import {setTitle} from 'common/js/util';
  import {getPageSysNotices} from 'api/general';
  import {commonMixin} from 'common/js/mixin';

  const LIMIT = 20;

  export default {
    mixins: [commonMixin],
    data() {
      return {
        notices: [],
        hasMore: true,
        start: 1
      };
    },
    created() {
      setTitle('系统公告');
      this.getPageNotices();
    },
    methods: {
      getPageNotices() {
        if (this.hasMore) {
          getPageSysNotices(this.start, LIMIT).then((data) => {
            if (data.totalCount <= LIMIT || data.list.length < LIMIT) {
              this.hasMore = false;
            }
            this.notices = this.notices.concat(data.list);
            this.start++;
          });
        }
      }
    },
    components: {
      Scroll,
      NoResult
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .notices-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }

    .list-content {
      padding-left: 0.36rem;
      background-color: #fff;

      .item {
        display: flex;
        align-items: top;
        padding: 0.5rem 0.36rem;
        padding-left: 0;
        @include border-bottom-1px($color-border);

        .img {
          width: 0.64rem;
          height: 0.64rem;
          flex: 0 0 0.64rem;
          font-size: 0;

          i {
            display: inline-block;
            width: 100%;
            height: 100%;
            background: url(notice.png) no-repeat;
            background-size: 0.64rem 0.64rem;
          }
        }

        .content {
          flex: 1;
          padding-left: 0.2rem;

          .title {
            font-size: $font-size-medium;
          }

          .date {
            padding-top: 0.2rem;
            font-size: $font-size-small;
            color: #999;
          }

          .desc {
            margin-top: 0.3rem;
            padding: 0.3rem;
            border-radius: 0.12rem;
            line-height: 1.2;
            font-size: $font-size-small;
            color: #999;
            background: #f5f5f5;
          }
        }
      }
    }

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
</style>
