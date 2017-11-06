<template>
  <div class="order-confirm-wrapper">
    <scroll :pullUpLoad="pullUpLoad">
      <div class="address-wrapper">
        <div class="content">
          <div v-if="!currentAddr" @click="goAdd" class="no-result-wrapper">
            <div class="addr"></div>
            <div class="message">还没有收货地址<div class="button"><i class="add-icon"></i>添加</div></div>
          </div>
          <div v-else class="address" @click="goAddrList">
            <div class="left-icon"></div>
            <div class="inner">
              <div class="top">收货人：{{currentAddr.addressee}}<div class="tel">{{currentAddr.mobile}}</div></div>
              <div class="bottom twoline-ellipsis">收货地址：{{currentAddr.province}} {{currentAddr.city}} {{currentAddr.district}} {{currentAddr.detailAddress}}</div>
            </div>
            <div class="right-icon"></div>
          </div>
        </div>
      </div>
      <div class="goods" @click="goDetail">
        <div class="img">
          <img v-lazy="imgSrc">
          <div v-if="isDiscount()" class="discount">{{discount}}折</div>
        </div>
        <div class="content">
          <div class="top">
            <div class="title twoline-ellipsis">{{name}}</div>
            <div class="text twoline-ellipsis">{{desc}}</div>
          </div>
          <div class="bottom">
            <span class="unit">¥</span><span class="sell">{{sellPrice}}</span>
            <span class="ori">¥{{oriPrice}}</span>
          </div>
        </div>
      </div>
      <div class="psfs border-top-1px">配送方式<div>快递<span>¥{{yunfei}}</span></div></div>
      <div class="infos">
        <div class="area border-bottom-1px">
          <div class="title">买家嘱咐：</div>
          <div class="textarea"><textarea rows="2" v-model="applyNote" placeholder="有什么要对卖家说的"></textarea></div>
        </div>
        <div class="price-info">
          <div class="item">商品总额<span>¥{{goodsPrice}}</span></div>
          <div class="item">运费<span>¥{{yunfei}}</span></div>
        </div>
      </div>
    </scroll>
    <footer>
      <div class="price">总计:<span class="unit">¥</span><span>{{totalPrice}}</span></div>
      <div class="button">
        <button @click="applyOrder">确认购买</button>
      </div>
    </footer>
    <full-loading v-show="loadingFlag" ref="full-loading" :title="title"></full-loading>
    <toast ref="toast" :text="text"></toast>
    <router-view></router-view>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_ADDRESS_LIST, SET_CURRENT_ADDR} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import {getAddressList} from 'api/user';
  import {getGoodsDetail, applyOrder} from 'api/biz';
  import {formatImg, formatAmount, isUnDefined} from 'common/js/util';

  export default {
    data() {
      return {
        applyNote: '',
        detail: null,
        loadingFlag: true,
        title: '正在载入...',
        text: ''
      };
    },
    computed: {
      imgSrc() {
        return formatImg(this.detail && this.detail.pic);
      },
      name() {
        return this.detail && this.detail.name || '';
      },
      desc() {
        return this.detail && this.detail.description || '';
      },
      sellPrice() {
        return formatAmount(this.detail && this.detail.price || 0);
      },
      oriPrice() {
        return formatAmount(this.detail && this.detail.originalPrice || 0);
      },
      goodsPrice() {
        if (this.detail) {
          let discount = this.detail.discount;
          discount = isUnDefined(discount) ? 10 : +discount * 10;
          let price = this.detail.price;
          let result = discount * price / 10;
          return formatAmount(result);
        }
        return '0.00';
      },
      yunfei() {
        if (this.detail) {
          // let discount = this.detail.discount;
          // discount = isUnDefined(discount) ? 10 : +discount * 10;
          let yunfei = this.detail.yunfei;
          this.detail.activityType === '2' ? yunfei = 0 : yunfei;
          let result = yunfei;
          return formatAmount(result);
        }
        return '0.00';
      },
      totalPrice() {
        if (this.detail) {
          let p1 = +this.detail.price;
          let p2 = +this.detail.yunfei;
          let discount = this.detail.discount;
          discount = isUnDefined(discount) ? 10 : +discount * 10;
          this.detail.activityType === '2' ? p2 = 0 : p2;
          let result = (p1 * discount / 10) + p2;
          return formatAmount(result);
        }
        return 0.00;
      },
      discount() {
        if (this.detail) {
          return +this.detail.discount * 10;
        }
        return 10;
      },
      ...mapGetters([
        'addressList',
        'currentAddr'
      ])
    },
    created() {
      this.pullUpLoad = null;
      this.first = true;
      this.setCurAddr(null);
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    methods: {
      shouldGetData() {
        if (this.$route.path === '/category/confirm') {
          return this.first;
        }
        return false;
      },
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          Promise.all([
            this.getDetail(),
            this.getAddressList()
          ]).then(() => {
            this.loadingFlag = false;
          }).catch(() => {
            this.loadingFlag = false;
          });
        }
      },
      getDetail() {
        return getGoodsDetail(this.$route.query.code).then((data) => {
          this.detail = data;
        }).catch(() => {});
      },
      goAdd() {
        this.$router.push('/category/confirm/add');
      },
      goAddrList() {
        this.$router.push('/category/confirm/address');
      },
      getAddressList() {
        if (!this.currentAddr) {
          if (!this.addressList.length) {
            return getAddressList().then((data) => {
              this.setAddressList(data);
              if (data.length) {
                let i = 0;
                for (; i < data.length; i++) {
                  if (data[i].isDefault === '1') {
                    this.setCurAddr(data[i]);
                    break;
                  }
                }
                if (i === data.length) {
                  this.setCurAddr(data[0]);
                }
              }
            });
          }
          this.setCurAddr(this.addressList[0]);
          return Promise.resolve([]);
        }
        return Promise.resolve([]);
      },
      isDiscount() {
        if (this.detail) {
          let discount = this.detail.discount;
          discount = isUnDefined(discount) ? 1 : discount;
          if (discount !== 1) {
            return true;
          }
          return false;
        }
        return false;
      },
      applyOrder() {
        if (!this.currentAddr) {
          this.text = '未选择地址';
          this.$refs.toast.show();
          return;
        }
        this.loadingFlag = true;
        this.title = '下单中...';
        let { province, city, district, detailAddress, mobile: reMobile, addressee: receiver } = this.currentAddr;
        if (province === city) {
          province = '';
        }
        let reAddress = province + city + district + detailAddress;
        applyOrder(this.$route.query.code, this.applyNote, reAddress, reMobile, receiver).then((data) => {
          this.loadingFlag = false;
          this.text = '下单成功';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.replace('/category/confirm/pay?code=' + data.code);
          }, 1000);
        }).catch(() => {
          this.loadingFlag = false;
        });
      },
      goDetail() {
        this.$router.push('/category/confirm/' + this.$route.query.code);
      },
      ...mapMutations({
        setAddressList: SET_ADDRESS_LIST,
        setCurAddr: SET_CURRENT_ADDR
      })
    },
    components: {
      Scroll,
      Toast,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .order-confirm-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color-background;

    .address-wrapper {
      height: 1.8rem;
      background: #fff;

      .content {
        height: 100%;
        background-position: left bottom;
        background-repeat: repeat-x;
        background-size: auto 0.04rem;
        @include bg-image('line');
      }

      .no-result-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;

        .addr {
          height: 0.7rem;
          width: 0.7rem;
          background-position: center;
          background-repeat: no-repeat;
          background-size: 0.7rem 0.7rem;
          @include bg-image('addr');
        }

        .message {
          margin-top: 0.2rem;
          display: flex;
          align-items: center;
          font-size: $font-size-medium-s;

          .button {
            margin-left: 0.32rem;
            width: 1.16rem;
            padding-left: 0.2rem;
            height: 0.42rem;
            line-height: 0.4rem;
            border: 1px dashed $primary-color;
            border-radius: 0.06rem;
            text-align: center;
            font-size: $font-size-small-s;
            color: $primary-color;
            background-size: 0.24rem;
            @include bg-image('add');
            background-repeat: no-repeat;
            background-position: 0.14rem center;
          }
        }
      }

      .address {
        display: flex;
        align-items: center;
        padding: 0.3rem;
        height: 100%;

        .left-icon {
          height: 100%;
          width: 0.24rem;
          flex: 0 0 0.24rem;
          background-repeat: no-repeat;
          background-position: left center;
          background-size: 0.24rem;
          @include bg-image('location')
        }
        .inner {
          padding-left: 0.34rem;
          padding-right: 0.42rem;
          flex: 1;

          .top {
            font-size: $font-size-medium;

            .tel {
              float: right;
            }
          }
          .bottom {
            padding-top: 0.24rem;
            line-height: 1.2;
            font-size: $font-size-small;
          }
        }
        .right-icon {
          height: 100%;
          width: 0.16rem;
          flex: 0 0 0.16rem;
          background-repeat: no-repeat;
          background-position: right center;
          background-size: 0.16rem;
          @include bg-image('more')
        }
      }
    }

    .goods {
      display: flex;
      padding: 0.2rem 0.3rem;
      margin-top: 0.2rem;
      background: #fff;

      .img {
        position: relative;
        width: 1.8rem;
        height: 1.8rem;
        flex: 0 0 1.8rem;
        font-size: 0;

        img {
          width: 100%;
          height: 100%;
        }

        .discount {
          position: absolute;
          top: 0;
          left: 0;
          padding-top: 0.1rem;
          width: 0.66rem;
          height: 0.54rem;
          text-align: center;
          font-size: $font-size-small-s;
          color: #fff;
          background-size: 0.66rem 0.54rem;
          @include bg-image('discount');
        }
      }

      .content {
        padding: 0.06rem 0.2rem;
        padding-right: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .top {
          font-size: $font-size-medium-s;
          .title {
            line-height: 1.2;
          }

          .text {
            padding-top: 0.1rem;
            line-height: 1.2;
            color: $color-text-l;
          }
        }

        .bottom {
          font-size: 0;

          span {
            font-size: $font-size-small;
          }

          .unit {
            color: $color-red;
          }

          .sell {
            color: $color-red;
            font-size: $font-size-medium-x;
          }

          .ori {
            padding-left: 0.36rem;
            text-decoration: line-through;
            color: $color-text-l;
          }
        }
      }
    }

    .psfs {
      padding: 0 0.3rem;
      height: 0.9rem;
      line-height: 0.9rem;
      @include border-top-1px($color-border);
      font-size: $font-size-medium;
      background-color: #fff;

      div {
        float: right;

        span {
          padding-left: 0.32rem;
        }
      }
    }

    .infos {
      margin-top: 0.2rem;
      background-color: #fff;

      .area {
        display: flex;
        align-items: flex-start;
        padding: 0.3rem;
        height: 1.36rem;
        @include border-bottom-1px($color-border);
        font-size: $font-size-medium;

        .textarea {
          flex: 1;
          height: 100%;
          line-height: 1.2;

          textarea {
            width: 100%;
          }
        }
      }

      .price-info {
        padding: 0.1rem 0.3rem;
        font-size: $font-size-medium;

        .item {
          padding: 0.2rem 0;

          span {
            float: right;
            color: $color-red;
          }
        }
      }
    }

    footer {
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0 0.3rem;
      width: 100%;
      height: 1rem;
      border-top: 1px solid $color-border;
      font-size: 0;
      background: #fff;

      .price {
        flex: 1;
        white-space: nowrap;
        font-size: $font-size-medium-s;

        span {
          color: $color-red;
          font-size: $font-size-medium-x;
        }

        .unit {
          padding-left: 0.28rem;
        }
      }

      .button {
        width: 2.2rem;
        height: 0.76rem;
        line-height: 0.76rem;

        button {
          width: 100%;
          height: 100%;
          border-radius: 0.1rem;
          background: $primary-color;
          font-size: $font-size-medium-xx;
          color: #fff;
        }
      }
    }
  }
</style>
