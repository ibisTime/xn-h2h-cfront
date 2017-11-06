<template>
  <transition name="slide">
    <div class="user-center-wrapper">
      <scroll ref="scroll" :data="goodsList" :hasMore="hasMore" @pullingUp="getPageGoods">
        <div class="top-wrapper">
          <div class="top"></div>
          <div class="user-info">
            <div class="top-info border-bottom-1px">
              <div class="img"><img :src="imgUrl | formatAvatar"/></div>
              <div class="right-info">
                <div class="nickname">{{nickname}}</div>
                <div class="time">{{loginTime}}</div>
              </div>
            </div>
            <div class="bottom-info">
              <div class="description" :class="moreCls">{{description}}</div>
              <div class="up-down" @click="showAllDesc" v-show="showMore"></div>
              <div class="btns">
                <span v-if="!this.isMine">
                  <span class="btn btn-left" @click="handleClick">{{btnText}}</span>
                  <span class="btn" @click="goChat">私信他</span>
                </span>
                <span v-else class="btn" @click="goSetting">编辑</span>
              </div>
            </div>
          </div>
        </div>
        <div class="goods-info"><i class="icon icon-left"></i>累计发布宝贝{{totalProduct}}个，在架{{totalOnProduct}}个<i class="icon icon-right"></i></div>
        <div class="goods-list">
          <div v-for="item in goodsList" class="item" @click="goDetail(item)">
            <div class="inner">
              <div class="img"><img v-lazy="formatImg(item.pic)" alt=""></div>
              <div class="item-info">
                <div class="name">{{item.name}}</div>
                <div class="prices"><span class="unit">¥</span><span class="price">{{item.price | formatAmount}}</span><span class="label type">{{item.typeName}}</span></div>
                <div class="addr">{{item.city}} | {{item.area}}</div>
                <i v-if="item.status!=='3'" class="status-icon" :class="getIconCls(item.status)"></i>
              </div>
            </div>
          </div>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE, ADD_USER_FOLLOW_NUM, DEL_USER_FOLLOW_NUM} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import {getPageMineGoods, getPublishGoodsCount} from 'api/biz';
  import {getUser, getUserById, isFollowUser, followUser, unFollowUser} from 'api/user';
  import {setTitle, getUserId, formatImg} from 'common/js/util';
  import {commonMixin} from 'common/js/mixin';
  import User from 'common/bean/user';

  export default {
    mixins: [commonMixin],
    data() {
      return {
        goodsList: [],
        start: 1,
        limit: 10,
        hasMore: true,
        userInfo: null,
        isMine: false,
        totalProduct: 0,
        totalOnProduct: 0,
        isFollow: false,
        showMore: false
      };
    },
    computed: {
      imgUrl() {
        return this.userInfo && this.userInfo.photo || '';
      },
      nickname() {
        return this.userInfo && this.userInfo.nickname || '';
      },
      loginTime() {
        return this.userInfo && this.userInfo.getLoginTime() || '';
      },
      description() {
        return this.userInfo && this.userInfo.getDescription() || '';
      },
      btnText() {
        return this.isFollow ? '取消关注' : '+ 关注';
      },
      moreCls() {
        return this.showMore ? '' : 'more';
      },
      ...mapGetters([
        'user',
        'watchingUser'
      ])
    },
    created() {
      this.first = true;
      let userId = getUserId();
      this.userId = this.$route.params.userId;
      this.isMine = userId === this.userId;
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    methods: {
      shouldGetData() {
        if (/\/user\/[^/]+$/.test(this.$route.path) || /\/user\/relation\/[^/]+$/.test(this.$route.path)) {
          setTitle('用户中心');
          return this.first;
        }
        return false;
      },
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          this.getUser();
          this.getPageGoods();
          this.getPublishGoodsCount();
        }
      },
      getUser() {
        if (this.isMine) {
          if (!this.user) {
            getUser().then((data) => {
              this.setUser(data);
              this.userInfo = new User(data);
              this.isShowMore();
            }).catch(() => {});
          } else {
            this.userInfo = this.user;
            this.isShowMore();
          }
        } else {
          isFollowUser(this.userId).then((data) => {
            this.isFollow = data;
          });
          if (!this.watchingUser) {
            getUserById(this.userId).then((data) => {
              this.userInfo = new User(data);
              this.isShowMore();
            });
          } else {
            this.userInfo = this.watchingUser;
            this.isShowMore();
          }
        }
      },
      isShowMore() {
        let desc = this.userInfo.getDescription();
        this.showMore = desc.length >= 70;
      },
      getPageGoods() {
        getPageMineGoods(this.start, this.limit, [3, 4, 5, 6], this.userId, 'status', 'asc').then((data) => {
          this.goodsList = this.goodsList.concat(data.list);
          if (data.totalCount <= this.limit || data.list.length < this.limit) {
            this.hasMore = false;
          }
          this.start++;
        });
      },
      getPublishGoodsCount() {
        getPublishGoodsCount(this.userId).then((data) => {
          this.totalOnProduct = data.totalOnProduct;
          this.totalProduct = data.totalProduct;
        });
      },
      formatImg(pic) {
        return formatImg(pic);
      },
      getIconCls(status) {
        return status === '4' ? 'sell-icon' : 'down-icon';
      },
      goSetting() {
        this.$router.push(this.$route.path + '/setting');
      },
      goDetail(item) {
        this.$router.push(this.$route.path + '/' + item.code);
      },
      goChat() {
        this.$router.push(`/message/${this.userId}`);
      },
      handleClick() {
        if (!this.fetching) {
          this.fetching = true;
          if (this.isFollow) {
            unFollowUser(this.userId).then(() => {
              this.isFollow = false;
              this.fetching = false;
              this.delFollowNum();
              this.$emit('updateFollow', false, this.userInfo);
            }).catch(() => {
              this.fetching = false;
            });
          } else {
            followUser(this.userId).then(() => {
              this.isFollow = true;
              this.fetching = false;
              this.addFollowNum();
              this.$emit('updateFollow', true, this.userInfo);
            }).catch(() => {
              this.fetching = false;
            });
          }
        }
      },
      showAllDesc() {
        this.showMore = false;
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 20);
      },
      ...mapMutations({
        setUser: SET_USER_STATE,
        addFollowNum: ADD_USER_FOLLOW_NUM,
        delFollowNum: DEL_USER_FOLLOW_NUM
      })
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .user-center-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 101;
    background: $color-background;

    .top-wrapper {
      padding: 0.3rem;
      padding-top: 0.5rem;

      .top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2rem;
        z-index: -1;
        background-color: rgb(94,135,244);
        background-image: linear-gradient(top, rgb(94,135,244), $primary-color);
      }

      .user-info {
        padding: 0.3rem;
        padding-bottom: 0.2rem;
        background-color: #fff;

        .top-info {
          display: flex;
          align-items: center;
          padding-left: 0.1rem;
          padding-bottom: 0.36rem;
          @include border-bottom-1px($color-border);

          .img {
            width: 1.36rem;
            height: 1.36rem;
            flex: 0 0 1.36rem;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .right-info {
            padding-left: 0.3rem;

            .nickname {
              font-size: $font-size-large-xx;
            }

            .time {
              margin-top: 0.27rem;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }

        .bottom-info {
          padding-top: 0.3rem;
          padding-left: 0.1rem;

          .description {
            max-height: 1.12rem;
            line-height: 0.39rem;
            overflow: hidden;
            font-size: $font-size-medium-x;

            &.more {
              max-height: none;
            }
          }

          .up-down {
            height: 0.38rem;
            background-size: 0.2rem;
            background-repeat: no-repeat;
            background-position: center;
            @include bg-image('down-arrow');
          }

          .btns {
            padding-top: 0.28rem;
            padding-bottom: 0.1rem;
            text-align: right;
            font-size: 0;

            .btn {
              display: inline-block;
              padding: 0.13rem 0.3rem;
              border: 1px solid $primary-color;
              border-radius: 0.05rem;
              font-size: $font-size-medium;
              color: $primary-color;
            }
            .btn-left {
              margin-right: 0.2rem;
            }            
          }
        }
      }
    }

    .goods-info {
      margin-bottom: 0.2rem;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      font-size: $font-size-medium-x;
      background: #fff;

      .icon {
        display: inline-block;
        height: 100%;
        width: 0.14rem;
        background-repeat: no-repeat;
        background-size: 0.14rem;
        vertical-align: middle;

        &.icon-left {
          margin-right: 0.12rem;
          background-position: right 0.2rem;
          @include bg-image('left');
        }

        &.icon-right {
          margin-left: 0.12rem;
          background-position: left 0.62rem;
          @include bg-image('right');
        }
      }
    }

    .goods-list {
      font-size: 0;

      .item {
        display: inline-block;
        width: 50%;
        padding-bottom: 0.2rem;
        vertical-align: top;

        &:nth-child(2n+1) {
          padding-right: 0.1rem;
        }

        &:nth-child(2n) {
          padding-left: 0.1rem;
        }

        .inner {
          .img {
            position: relative;
            height: 0;
            padding-top: 100%;

            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          }

          .item-info {
            position: relative;
            padding: 0.2rem;
            padding-bottom: 0.16rem;
            background-color: #fff;

            .name {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: $font-size-medium;
            }

            .prices {
              padding-top: 0.22rem;
              padding-bottom: 0.26rem;
              font-size: 0;

              .unit {
                font-size: $font-size-small-s;
                color: $color-red;
                vertical-align: bottom;
              }

              .price {
                font-size: $font-size-large-ss;
                color: $color-red;
                vertical-align: middle;
              }

              .label {
                display: inline-block;
                vertical-align: middle;
                padding: 0.04rem 0.1rem;
                margin-left: 0.14rem;
                font-size: $font-size-small-s;
              }

              .type {
                color: $primary-color;
                border: 1px solid $primary-color;
              }

              .new {
                color: $color-red;
                border: 1px solid $color-red;
              }
            }
            .addr {
              padding-left: 0.3rem;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: $font-size-small-s;
              color: $color-text-l;
              background-position: left center;
              background-repeat: no-repeat;
              background-size: 0.2rem;
              @include bg-image('addr')
            }

            .status-icon {
              position: absolute;
              top: 0.1rem;
              right: 0.2rem;
              width: 1rem;
              height: 1rem;
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;

              &.sell-icon {
                @include bg-image('sell');
              }

              &.down-icon {
                @include bg-image('down');
              }
            }
          }
        }
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
