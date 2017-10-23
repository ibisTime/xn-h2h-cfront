<template>
  <div class="user-wrapper">
    <div class="top-wrapper">
      <div class="personal">
        <div @click="goCenter" class="head-bg">
          <img :src="user && user.photo"/>
        </div>
        <div class="person-info">
          <div class="name">{{userName}}</div>
          <div class="info">
            <router-link tag="span" to="/user/relation" class="title">关注：{{totalFollowNum}} </router-link><span class="split">|</span><router-link to="/user/relation?type=1" tag="span" class="title"> 粉丝：{{totalFansNum}}</router-link>
          </div>
        </div>
      </div>
      <div class="money-info">
        <router-link to="/user/account" tag="div" class="remained">余额:<span>{{cnyAmount}}</span></router-link>
        <router-link to="/user/jf-flow" tag="div" class="integral">积分:<span>{{jfAmount}}</span></router-link>
      </div>
    </div>
    <div class="my-order">
      <router-link to="/user/order" tag="div" class="order-title">
        <p>我的订单</p>
        <p class="more-g">查看更多<span></span></p>
      </router-link>
      <div class="order-content">
        <ul>
          <router-link tag="li" to="/user/order?index=1" class="item-payment"><div class="icon"></div><p>待付款</p></router-link>
          <router-link tag="li" to="/user/order?index=2" class="item-sendGoods"><div class="icon"></div><p>待发货</p></router-link>
          <router-link tag="li" to="/user/order?index=3" class="item-delivery"><div class="icon"></div><p>待收货</p></router-link>
          <router-link tag="li" to="/user/order?index=4" class="item-haveGoods"><div class="icon"></div><p>待评价</p></router-link>
          <router-link tag="li" to="/user/order?index=5" class="item-evaluation"><div class="icon"></div><p>已完成</p></router-link>
        </ul>
      </div>
    </div>
    <div class="rests">
      <ul>
        <router-link tag="li" to="/user/pub-mine" class="item-posted">我发布的</router-link>
        <router-link tag="li" to="/user/sell-order" class="item-sell">我卖出的</router-link>
        <router-link tag="li" to="/user/activity" class="item-enrollment">活动报名</router-link>
        <router-link tag="li" to="/user/collection" class="item-want">我想要的</router-link>
        <router-link tag="li" to="/user/history" class="item-fotoPlace">我的足迹</router-link>
        <router-link tag="li" to="/user/coupon" class="item-coupons">优惠券</router-link>
      </ul>
    </div>
    <full-loading v-show="loadingFlag"></full-loading>
    <m-footer @goPublish="goPublish"></m-footer>
    <router-view></router-view>
  </div>
</template>
<script>
  import MFooter from 'components/m-footer/m-footer';
  import {SET_USER_STATE, SET_CNY_ACCOUNT, SET_JF_ACCOUNT} from 'store/mutation-types';
  import {getUser} from 'api/user';
  import {getAccount} from 'api/account';
  import {setTitle, formatAmount} from 'common/js/util';
  import {commonMixin} from 'common/js/mixin';
  import FullLoading from 'base/full-loading/full-loading';
  import {mapGetters, mapMutations} from 'vuex';

  export default {
    mixins: [commonMixin],
    data () {
      return {
        loadingFlag: true
      };
    },
    created() {
      this.first = true;
      this._getUser();
    },
    computed: {
      userName() {
        return this.user && this.user.nickname || '';
      },
      cnyAmount() {
        return formatAmount(this.cnyAccount && this.cnyAccount.amount || 0);
      },
      jfAmount() {
        return formatAmount(this.jfAccount && this.jfAccount.amount || 0);
      },
      totalFollowNum() {
        return this.user && this.user.totalFollowNum || 0;
      },
      totalFansNum() {
        return this.user && this.user.totalFansNum || 0;
      },
      ...mapGetters([
        'user',
        'cnyAccount',
        'jfAccount'
      ])
    },
    methods: {
      _getUser() {
        if (this.shouldGetData()) {
          this.first = false;
          Promise.all([
            getUser(),
            getAccount()
          ]).then(([userData, accountData]) => {
            this.loadingFlag = false;
            accountData.forEach((item) => {
              if (item.currency === 'CNY') {
                this.setCnyAccount(item);
              } else if (item.currency === 'JF') {
                this.setJFAccount(item);
              }
            });
            this.setUser(userData);
          }).catch(() => {
            this.loadingFlag = false;
          });
        }
      },
      shouldGetData() {
        if (this.$route.path === '/user') {
          setTitle('我的');
          return this.first;
        }
        return false;
      },
      goCenter() {
        this.$router.push('/user/' + this.user.userId);
      },
      goPublish() {
        this.$router.push('/user/publish');
      },
      ...mapMutations({
        setCnyAccount: SET_CNY_ACCOUNT,
        setJFAccount: SET_JF_ACCOUNT,
        setUser: SET_USER_STATE
      })
    },
    updated() {
      this._getUser();
    },
    components: {
      MFooter,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .user-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 1rem;

    .top-wrapper {
      width: 100%;
      background-size: 100% 100%;
      @include bg-image('background');
      color: #fff;
      font-size: $font-size-medium-x;

      .personal {
        display: flex;
        padding: 0.64rem 0.3rem;
        align-items: center;
        width:100%;

        .head-bg {
          width: 1.32rem;
          height: 1.32rem;
          border: 0.04rem solid #fff;
          border-radius: 50%;
          overflow: hidden;
          background: #fff;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .person-info {
          flex: 1;
          padding-left: 0.3rem;

          .name {
            padding-top: 0.24rem;
            font-size: $font-size-large-s;
          }

          .info {
            font-size: $font-size-medium;

            .title {
              padding: 0.24rem 0.2rem;
              display: inline-block;

              &:first-child {
                padding-left: 0;
              }
            }
          }
        }
      }

      .money-info{
        width: 100%;
        height: 1rem;
        padding: 0.2rem;
        background: #fff;
        line-height: 1rem;
        text-align: center;
        color: #666;

        div{
          float: left;
          display: inline-block;
          width: 50%;
          height: 0.6rem;
          line-height: 0.6rem;

          span{
            padding-left: 0.2rem;
            font-size: $font-size-large-s;
            color: #49b1fb;
          }
        }

        .remained{
          border-right: 1px solid #eee;
        }
      }

    }

    .my-order{
      margin-top: 0.2rem;
      width: 100%;
      height: 2.7rem;
      background: #fff;

      .order-title{
        width: 100%;
        height: 0.9rem;
        @include border-bottom-1px(#eee);

        p{
          display: inline-block;
          float: left;
          width: 75%;
          height: 0.9rem;
          padding: 0 0.3rem;
          line-height: 0.9rem;
          font-size: $font-size-medium-x;
        }

        .more-g{
          float: right;
          width: 25%;
          font-size: $font-size-small;
          color: #999;

          span{
            display: inline-block;
            width: 0.2rem;
            height: 0.2rem;
            margin-left: 0.1rem;
            @include bg-image('moreG');
            background-size: 50% 100%;
            background-repeat: no-repeat;
            background-position: center;
          }
        }
      }

      .order-content{
        width: 100%;
        height: 1.8rem;

        ul{
          display: flex;
          align-items: center;
          width: 100%;
          height: 1.8rem;

          li{
            flex: 1;
            text-align: center;
            display: inline-block;
            font-size: 0;

            .icon {
              height: 0.4rem;
              width: 0.4rem;
              display: inline-block;
              margin-bottom: 0.36rem;
              background-repeat: no-repeat;
              background-position: center;
              background-size: 0.4rem;
            }

            p {
              font-size: $font-size-small;
            }
          }
          .item-payment .icon {
            @include bg-image('payment');
          }
          .item-sendGoods .icon {
            @include bg-image('sendGoods');
          }
          .item-delivery .icon {
            @include bg-image('delivery');
          }
          .item-haveGoods .icon {
            @include bg-image('haveGoods');
          }
          .item-evaluation .icon {
            @include bg-image('evaluation');
          }
        }

      }
    }

    .rests{
      width: 100%;
      height:3.8rem;
      margin-top: 0.2rem;
      background: #fff;
      font-size: 0;
      li{
        padding-top: 1.2rem;
        width: 2.5rem;
        height: 1.9rem;
        display: inline-block;
        text-align: center;
        font-size: $font-size-small;
        color:#666;
        @include border-bottom-1px(#eee);
        @include border-right-1px(#eee);
        background-repeat: no-repeat;
        background-position: 50% 34%;;
        background-size: 0.4rem;
      }
      .item-posted{
        @include bg-image('posted');
      }
      .item-sell{
        @include bg-image('sell');
      }
      .item-enrollment{
        @include bg-image('enrollment');
      }
      .item-want{
        @include bg-image('want');
      }
      .item-fotoPlace{
        @include bg-image('fotoPlace');
      }
      .item-coupons{
        @include bg-image('coupons');
      }
    }

  }

</style>
