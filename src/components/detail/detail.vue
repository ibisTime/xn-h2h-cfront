<template>
  <transition name="slide">
    <div class="goods-detail-wrapper">
      <div v-if="!none" class="goods-content">
        <div class="scroll-wrapper">
          <scroll :data="messages" :hasMore="hasMore" ref="scroll">
            <header>
              <div class="top">
                <div class="name">{{name}}</div>
                <div class="icon-like" :class="likeCls" @click="collection"></div>
              </div>
              <div class="center">
                <span class="unit">¥</span>
                <span class="price">{{sellPrice | formatAmount}}</span>
                <span class="text">原价¥{{oriPrice | formatAmount}}</span>
                <span class="text">运费¥{{freight | formatAmount}}</span>
                <span class="text fr">浏览{{readCount}}</span>
              </div>
              <div class="bottom">
                <div class="inner" @click="showMap">
                  <i class="icon icon-addr"></i>
                  <span>{{addr}}</span>
                  <i class="icon icon-right"></i>
                </div>
              </div>
              <div class="status-icon" :class="statusCls" v-show="statusShow"></div>
            </header>
            <div class="description">
              <div class="text-content" :class="textCls">{{description}}</div>
              <div class="up-down" v-if="showAll" @click="showDesc">展开<i class="icon down"></i></div>
              <div class="pic-wrapper">
                <div class="normal-pic">
                  <img @load="imgLoad" @click="showImage(item)" v-for="item in noramlPic" :src="item"/>
                </div>
                <div class="special-pic">
                  <div class="spec-item" v-for="item in specialPic">
                    <div class="inner" @click="showImage(item)" :style="getSyl(item)"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card" v-if="publisher" @click="goUserCenter">
              <div class="img"><img :src="publisher.photo | formatImg"/></div>
              <div class="content">
                <div class="name">{{publisher.nickname}}</div>
                <div class="info">{{publisherDesc}}</div>
              </div>
              <div class="icon-right"></div>
            </div>
            <div class="message">
              <div class="title">互动（{{totalMesCount}}）</div>
              <div v-if="!messages.length" class="no-result">
                <div class="img"></div>
                <div class="text">更多宝贝细节，帮大家问问卖家</div>
                <div class="button"><button @click="showRating">我要留言</button></div>
              </div>
              <ul v-else class="ratings">
                <li class="mine">
                  <div class="img"><img :src="this.user && this.user.photo"></div>
                  <div class="rating">说点什么吧，看对眼就上</div>
                  <div class="button"><button @click="showRating">我要留言</button></div>
                </li>
                <li class="info border-bottom-1px" v-for="item in messages">
                  <div class="img"><img v-lazy="formatImg(item.photo)"></div>
                  <div class="text">
                    <div class="name">{{item.nickname}}</div>
                    <div class="msg">{{item.content}}</div>
                  </div>
                </li>
              </ul>
            </div>
          </scroll>
        </div>
        <footer>
          <div class="price">
            <div class="top">金额：<span class="unit">¥</span><span>{{totalAmount | formatAmount}}</span></div>
            <div class="bottom" v-show="showDiscount">已享受{{showDiscount}}折优惠</div>
          </div>
          <div v-show="showSell" class="btn" @click="goChat">联系卖家</div>
          <div v-show="showShare" class="btn buy" @click="shareGoods">分享宝贝</div>
          <div class="btn buy" @click="goBuy" v-show="showBuy">马上买</div>
        </footer>
        <full-loading v-show="loadingFlag"></full-loading>
        <rating ref="rating" :parentCode="$route.params.code" :user="user" @ratingSuc="ratingSuc"></rating>
        <show-map :lat="lat" :lng="lng" ref="map"></show-map>
      </div>
      <div v-else class="no-result-wrapper">
        <no-result title="抱歉，商品已被删除"></no-result>
      </div>
      <share-mask ref="mask"></share-mask>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE, SET_WATCHING_USER} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import FullLoading from 'base/full-loading/full-loading';
  import ShowMap from 'base/show-map/show-map';
  import ShareMask from 'components/share-mask/share-mask';
  import Rating from 'components/rating/rating';
  import {getGoodsDetail, getPageComments, collection, read, cancelCollection} from 'api/biz';
  import {getUserById, getUser} from 'api/user';
  import {formatImg, isUnDefined, getShareImg, setTitle, getUserId} from 'common/js/util';
  import {initShare} from 'common/js/weixin';
  import {commonMixin} from 'common/js/mixin';
  import User from 'common/bean/user';

  export default {
    mixins: [commonMixin],
    data() {
      return {
        loadingFlag: true,
        messages: [],
        noramlPic: [],
        specialPic: [],
        detail: null,
        isLike: false,
        isShow: false,
        showAll: false,
        description: '',
        hasMore: true,
        publisher: null,
        start: 1,
        limit: 10,
        totalMesCount: 0,
        none: false,
        showSell: true,
        statusShow: false,
        showBuy: true,
        showShare: false
      };
    },
    computed: {
      name() {
        return this.detail && this.detail.name || '';
      },
      sellPrice() {
        return this.detail && this.detail.price || 0;
      },
      oriPrice() {
        return this.detail && this.detail.originalPrice || 0;
      },
      freight() {
        if (this.detail) {
          if (this.detail.activityType === '2') {
            return 0;
          }
          return this.detail.yunfei && this.detail.yunfei || 0;
        };
      },
      addr() {
        return this.detail ? `${this.detail.city} | ${this.detail.area}` : '';
      },
      readCount() {
        return this.detail ? this.detail.totalScanNum : 0;
      },
      statusCls() {
        if (this.detail) {
          if (this.detail.status === '4') {
            return 'sell';
          } else if (this.detail.status === '5' || this.detail.status === '6') {
            return 'down';
          }
        }
        return '';
      },
      likeCls() {
        return this.isLike ? 'active' : '';
      },
      textCls() {
        return this.isShow ? 'show' : '';
      },
      publisherDesc() {
        return this.publisher ? this.publisher.toString() : '';
      },
      totalAmount() {
        if (this.detail) {
          let price = +this.detail.price;
          let yunfei = +this.detail.yunfei;
          this.detail.activityType === '2' ? yunfei = 0 : yunfei;
          let discount = this.detail.discount;
          discount = isUnDefined(discount) ? 10 : +discount * 10;
          return (price * discount / 10) + yunfei;
        }
        return 0;
      },
      showDiscount() {
        if (this.detail) {
          let discount = this.detail.discount;
          return !isUnDefined(discount) && +discount !== 1 ? discount * 10 : false;
        }
        return false;
      },
      lat() {
        return this.detail && +this.detail.latitude || 0;
      },
      lng() {
        return this.detail && +this.detail.longitude || 0;
      },
      ...mapGetters([
        'user'
      ])
    },
    created() {
      this.code = this.$route.params.code;
      this.pics = [];
      setTitle('商品详情');
      Promise.all([
        this.getDetail(),
        this.getUser()
      ]).then(() => {
        this.loadingFlag = false;
      }).catch(() => {
        this.loadingFlag = false;
      });
      this.getPageComments();
      read(this.code).catch(() => {});
    },
    methods: {
      getDetail() {
        return getGoodsDetail(this.code).then((data) => {
          if (data.code) {
            this.getUserById(data.storeCode);
            initShare({
              title: data.name,
              desc: data.description,
              link: location.href,
              imgUrl: getShareImg(data.pic)
            }, null, null, true);
            setTitle(data.name);
            if (data.storeCode === getUserId()) {
              this.showSell = false;
              this.showBuy = false;
              if (data.status === '3') {
                this.showShare = true;
              }
            }
            if (data.status === '4' || data.status === '5' || data.status === '6') {
              this.statusShow = true;
              this.showBuy = false;
            }
            this.detail = data;
            this.isLike = data.isCollect === '1';
            this.description = data.description;
            this.showAll = this.description.length >= 200;
            this.isShow = this.description.length < 200;
            let pics = this.detail.pic.split('||');
            this.pics = pics.map((pic) => {
              return formatImg(pic);
            });
            let len = pics.length;
            let sIdx = 4;
            if (len <= 4) {
              sIdx = len;
            } else if (len % 2) {
              sIdx = 3;
            }
            this.noramlPic = this.pics.slice(0, sIdx);
            this.specialPic = this.pics.slice(sIdx);
          } else {
            this.none = true;
          }
        });
      },
      getPageComments() {
        getPageComments(this.code, this.start, this.limit).then((data) => {
          this.messages = this.messages.concat(data.list);
          this.totalMesCount = data.totalCount;
          if (data.list.length < this.limit || data.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.start++;
        }).catch(() => {});
      },
      getUser() {
        if (!this.user) {
          return getUser().then((data) => {
            this.setUser(data);
          });
        } else {
          return Promise.resolve(this.user);
        }
      },
      getUserById(userId) {
        getUserById(userId).then((data) => {
          this.setWatchingUser(data);
          this.publisher = new User(data);
          setTimeout(() => {
            this.$refs.scroll && this.$refs.scroll.refresh();
          }, 20);
        });
      },
      showMap() {
        this.$refs.map.show();
      },
      collection() {
        if (this.isLike) {
          this.cancelCollect();
        } else {
          this.collect();
        }
      },
      collect() {
        collection(this.code).then(() => {
          this.isLike = true;
          this.$emit('collect', this.detail, true);
        }).catch(() => {});
      },
      cancelCollect() {
        cancelCollection(this.code).then(() => {
          this.isLike = false;
          this.$emit('collect', this.detail, false);
        }).catch(() => {});
      },
      getSyl(pic) {
        return {backgroundImage: `url(${pic})`};
      },
      formatImg(pic) {
        return formatImg(pic);
      },
      showDesc() {
        this.isShow = true;
        this.showAll = false;
        setTimeout(() => {
          this.$refs.scroll && this.$refs.scroll.refresh();
        }, 20);
      },
      imgLoad() {
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 20);
      },
      showRating() {
        this.$refs.rating.show();
      },
      shareGoods() {
        this.$refs.mask.show();
      },
      ratingSuc(item) {
        this.messages.unshift(item);
        this.totalMesCount++;
        this.$emit('rating', this.code);
      },
      goBuy() {
        this.$router.push('/category/confirm?code=' + this.$route.params.code);
      },
      goUserCenter() {
        this.$router.push('/user/' + this.publisher.userId);
      },
      goChat() {
        this.$router.push('/message/' + this.publisher.userId);
      },
      showImage(pic) {
        wx.previewImage({
          current: pic,
          urls: this.pics
        });
      },
      ...mapMutations({
        setUser: SET_USER_STATE,
        setWatchingUser: SET_WATCHING_USER
      })
    },
    components: {
      Scroll,
      Rating,
      ShowMap,
      FullLoading,
      NoResult,
      ShareMask
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .goods-detail-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color-background;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }

    .scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 1rem;
      width: 100%;
    }

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }

    header {
      position: relative;
      padding: 0.3rem;
      padding-bottom: 0.32rem;
      background: #fff;

      .top {
        display: flex;
        align-items: flex-start;

        .name {
          flex: 1;
          line-height: 1.2;
          font-size: $font-size-large;
        }

        .icon-like {
          width: 0.6rem;
          height: 0.6rem;
          background-repeat: no-repeat;
          background-position: right top;
          background-size: 0.34rem;
          @include bg-image('like');

          &.active {
            @include bg-image('like-act');
          }
        }
      }

      .center {
        margin-top: 0.2rem;
        font-size: 0;

        .unit {
          font-size: $font-size-small;
          color: $color-red;
        }

        .price {
          padding-right: 0.3rem;
          font-size: $font-size-large-xxx;
          color: $color-red;
        }

        .text {
          padding-right: 0.1rem;
          font-size: $font-size-medium-s;
          color: $color-text-l;
        }

        .fr {
          float: right;
          margin-top: 0.2rem;
          padding-right: 0;
        }
      }

      .bottom {
        margin-top: 0.3rem;
        font-size: 0;

        .inner {
          display: inline-block;
          padding: 0 0.08rem;
          height: 0.46rem;
          line-height: 0.46rem;
          border-radius: 0.23rem;
          background-color: #f2f3f6;
          font-size: 0;

          .icon {
            display: inline-block;
            vertical-align: middle;
            width: 0.44rem;
            height: 0.46rem;
            background-repeat: no-repeat;
            background-position: center;
          }

          .icon-addr {
            background-size: 0.2rem;
            @include bg-image('addr');
          }

          .icon-right {
            background-size: 0.14rem;
            @include bg-image('right');
          }

          span {
            display: inline-block;
            vertical-align: middle;
            max-width: 2.4rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: $font-size-small-s;
            color: $color-text-l;
          }
        }
      }

      .status-icon {
        position: absolute;
        right: 0.1rem;
        bottom: 0.1rem;
        width: 1rem;
        height: 1rem;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;

        &.sell {
          @include bg-image('sell');
        }

        &.down {
          @include bg-image('down-goods');
        }
      }
    }

    .description {
      margin-top: 0.2rem;
      padding: 0.4rem 0.3rem 0.1rem;
      background: #fff;

      .text-content {
        line-height: 1.4;
        font-size: $font-size-medium-x;
        max-height: 2.1rem;
        overflow: hidden;
        word-break: break-all;

        &.show {
          margin-bottom: 0.3rem;
          max-height: none;
        }
      }

      .up-down {
        padding-top: 0.3rem;
        padding-bottom: 0.34rem;
        text-align: center;
        font-size: $font-size-small;
        color: $color-text-l;

        .icon {
          display: inline-block;
          width: 0.36rem;
          height: 0.24rem;
          background-size: 0.2rem;
          background-repeat: no-repeat;
          background-position: center 0.06rem;
          @include bg-image('down');

          &.up {
            transform: rotate(180deg);
            background-position: center 0;
          }
        }
      }

      .pic-wrapper {
        font-size: 0;
        .normal-pic {
          img {
            margin-bottom: 0.2rem;
            width: 100%;
          }
        }

        .special-pic {
          .spec-item {
            display: inline-block;
            width: 50%;
            height: 3.45rem;
            padding-bottom: 0.2rem;

            &:nth-child(2n+1) {
              padding-right: 0.1rem;
            }

            &:nth-child(2n) {
              padding-left: 0.1rem;
            }

            .inner {
              width: 100%;
              height: 100%;
              background-position: center;
              background-size: cover;
            }
          }
        }
      }
    }

    .card {
      display: flex;
      align-items: center;
      margin: 0.2rem 0.3rem;
      padding: 0 0.3rem;
      height: 1.8rem;
      background: #fff;

      .img {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .content {
        padding-left: 0.3rem;
        flex: 1;

        .name {
          font-size: $font-size-large-ss;
        }

        .info {
          margin-top: 0.18rem;
          font-size: $font-size-small;
          color: $color-text-l;
        }
      }

      .icon-right {
        display: inline-block;
        width: 0.3rem;
        height: 100%;
        background-position: right center;
        background-size: 0.14rem;
        background-repeat: no-repeat;
        @include bg-image('more');
      }
    }

    .message {
      background: #fff;

      .title {
        padding-top: 0.35rem;
        padding-bottom: 0.02rem;
        padding-left: 0.3rem;
        font-size: $font-size-large-ss;
      }

      .no-result {
        padding: 0.3rem;

        .img {
          height: 2rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 2rem;
          @include bg-image('no-message');
        }

        .text {
          padding: 0.3rem 0;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .button {
          padding-top: 0.06rem;
          padding-bottom: 0.16rem;
          text-align: center;
          font-size: 0;

          button {
            width: 2.1rem;
            line-height: 0.74rem;
            border-radius: 0.1rem;
            font-size: $font-size-medium-x;
            color: #fff;
            background: $primary-color;
          }
        }
      }

      .ratings {
        padding-top: 0.27rem;

        li {
          padding: 0 0.3rem;
          display: flex;
          align-items: center;
          font-size: 0;

          &.mine {
            padding: 0.27rem 0.3rem;
          }

          .img {
            flex: 0 0 0.64rem;
            height: 0.64rem;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }
          .rating{
            margin-left: 0.2rem;
            padding-left: 0.24rem;
            flex: 1;
            height: 0.64rem;
            line-height: 0.64rem;
            font-size: $font-size-medium-s;
            background-size: 100% 100%;
            @include bg-image('rating');
          }

          .button{
            flex: 0 0 1.96rem;
            padding-left: 0.2rem;

            button {
              height: 0.64rem;
              line-height: 0.64rem;
              width: 100%;
              border-radius: 0.1rem;
              color: #fff;
              background: $primary-color;
            }
          }

          &.info {
            align-items: flex-start;
            padding-top: 0.27rem;
            .text {
              padding-bottom: 0.27rem;
              margin-left: 0.3rem;
              flex: 1;
              line-height: 1.2;
              @include border-bottom-1px($color-border);
            }

            .name {
              font-size: $font-size-medium;
              color: #808080;
            }

            .msg {
              padding-top: 0.12rem;
              font-size: $font-size-medium-x;
            }
          }

          &:last-child {
            .text {
              @include border-none();
            }
          }
        }
      }
    }

    .loading-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);

      .loading-content {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translate3d(0, -50%, 0);
      }
    }

    footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0.12rem 0.3rem;
      height: 1rem;
      background: #fff;

      .price {
        display: flex;
        flex-direction: column;

        .top {
          font-size: $font-size-medium-s;

          span {
            font-size: $font-size-medium-x;
            color: $color-red;

            &.unit {
              font-size: $font-size-small;
            }
          }
        }

        .bottom {
          margin-top: 0.06rem;
          font-size: $font-size-small-s;
          color: $color-text-l;
        }
        padding-right: 0.1rem;
      }

      .btn {
        flex: 1;
        margin-left: 0.2rem;
        height: 0.76rem;
        line-height: 0.76rem;
        border-radius: 0.1rem;
        text-align: center;
        font-size: $font-size-medium-xx;
        color: #fff;
        background: $primary-color;

        &.buy {
          background: $color-red;
        }
      }
    }
  }
</style>
