<template>
  <div class="trades-wrapper" ref="trades">
    <scroll ref="scroll" :hasMore="hasMore" @pullingUp="getTradeCircle" :data="tradeList">
      <ul class="trades-items-wrapper" ref="tradeList">
        <li v-for="item in tradeList" @click="goDetail(item.code)" class="trade-wrapper" >
          <div class="trade-top">
            <div class="head-pic" :style="getImgStyl(item.photo)"></div>
            <div class="person-info">
              <div class="name">{{item.nickName}}</div>
              <div class="area">
                <span>{{item.city}} </span>|<span> {{spaceTime(item)}}</span>
              </div>
            </div>
            <div class="clothes">来自{{item.typeName}}</div>
          </div>
          <div class="photos-wrapper">
            <trade-scroll :data="item.pic.split('||')"></trade-scroll>
          </div>
          <div class="trade-bottom">
            <div class="description">{{item.description}}</div>
            <div class="goods-price">￥<span>{{item.price | formatAmount}}</span></div>
            <ul class="operate-icon">
              <li class="want">{{item.totalInteract}}</li>
              <li class="message">{{item.totalComment}}</li>
            </ul>
          </div>
        </li>
        <div v-show="!tradeList.length && !hasMore" class="no-result-wrapper">
          <no-result title="抱歉，暂无内容"></no-result>
        </div>
      </ul>
    </scroll>
    <router-view @collect="handleCollect" @rating="handleRating"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import TradeScroll from 'components/trade-scroll/trade-scroll';
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import {getPageGoods} from 'api/biz';
  import {formatImg, calcSpace, formatDate} from 'common/js/util';
  import {commonMixin} from 'common/js/mixin';

  const LIMIT = 20;

  export default {
    mixins: [commonMixin],
    data() {
      return {
        hasMore: true,
        start: 1,
        isPublish: 1,
        tradeList: []
      };
    },
    created() {
      this.getInitData();
    },
    methods: {
      getInitData() {
        this.getTradeCircle();
      },
      getTradeCircle () {
        getPageGoods({
          start: this.start,
          limit: LIMIT,
          isPublish: this.isPublish
        }).then((data) => {
          this.tradeList = this.tradeList.concat(data.list);
          if (data.list.length < LIMIT || data.totalCount <= LIMIT) {
            this.hasMore = false;
          }
          this.start++;
        });
      },
      spaceTime(item) {
        return calcSpace(formatDate(item.loginLog, 'yyyy-MM-dd-hh-mm'));
      },
      getImgStyl(pic) {
        return {
          backgroundImage: `url(${formatImg(pic)})`
        };
      },
      handleCollect(item, isLike) {
        let index = this.findIndex(item.code);
        let trade = this.tradeList[index];
        if (isLike) {
          this.tradeList.splice(index, 1, {
            ...trade,
            totalInteract: ++trade.totalInteract
          });
        } else {
          this.tradeList.splice(index, 1, {
            ...trade,
            totalInteract: --trade.totalInteract
          });
        }
      },
      handleRating(code) {
        let index = this.findIndex(code);
        let trade = this.tradeList[index];
        this.tradeList.splice(index, 1, {
          ...trade,
          totalComment: ++trade.totalComment
        });
      },
      findIndex(code) {
        return this.tradeList.findIndex((trade) => {
          return trade.code === code;
        });
      },
      goDetail(code) {
        this.$router.push(this.$route.path + '/' + code);
      }
    },
    components: {
      Scroll,
      TradeScroll,
      NoResult
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .trades-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #F5F5F5;

    .trades-items-wrapper {
      position: relative;
      width: 100%;

      .trade-wrapper {
        border-top: 1px solid #eee;
        background: #fff;
        width: 100%;
        font-size: $font-size-medium-x;

        .trade-top {
          display: flex;
          height: 1.5rem;

          .head-pic {
            width: 0.9rem;
            height: 0.9rem;
            margin: 0.3rem 0.24rem 0.2rem 0.3rem;
            background-size: 100% 100%;
            border-radius: 50%;
          }

          .person-info {
            flex: 2;
            padding-top: 0.45rem;
            width: 2.5rem;

            .name {
              color: #484848;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .area {
              margin-top: 0.1rem;
              color: #999899;
              font-size: $font-size-small;
            }
          }

          .clothes {
            margin:0 0.3rem;
            line-height: 1.5rem;
            color: #48b0fb;
          }
        }

        .photos-wrapper {
          margin-left: 0.3rem;
        }

        .trade-bottom {
          margin:0.2rem 0.3rem 0;
          color: #484848;

          .description {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .goods-price {
            margin: 0.3rem 0;
            display: inline-block;
            width: 30%;
            color: #ff5000;
            font-size: $font-size-small;

            span {
              font-size: $font-size-large-xx;
            }
          }

          .operate-icon {
            display: inline-block;
            float: right;

            li {
              float: left;
              width: 1.3rem;
              height: 0.45rem;
              line-height: 0.45rem;
              background-size: 0.3rem;
              background-repeat: no-repeat;
              background-position: 0 50%;
              margin-top: 0.3rem;
              padding-left: 0.4rem;
              font-size: $font-size-small;
              color: $color-text-l;

              &:last-child {
                width: 0.8rem;
              }
            }

            .want {
              @include bg-image('want');
            }

            .message {
              @include bg-image('message');
            }

            .more {
              @include bg-image('more');
            }
          }
        }
      }
    }
  }
</style>
