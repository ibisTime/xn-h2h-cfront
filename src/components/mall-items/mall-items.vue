<template>
  <ul class="mall-items-wrapper">
    <li v-for="item in data" @click="goDetail(item.code)" class="border-bottom-1px">
      <div class="img-wrap">
        <img v-lazy="formatImg(item.pic)"/>
        <div class="discount" v-if="isDiscount(item)">{{getDiscount(item)}}折</div>
      </div>
      <div class="info">
        <h2 class="twoline-ellipsis">{{item.name}}</h2>
        <div class="label">
          <label>来自{{item.typeName}}</label>
          <label v-if="item.isNew==='1'">全新</label>
        </div>
        <div class="price">
          <label>¥</label>{{item.price | formatAmount}}<span>原价：¥{{item.originalPrice | formatAmount}}</span>
        </div>
        <div class="addr">{{item.city}} | {{item.area}}</div>
      </div>
    </li>
  </ul>
</template>
<script>
  import {commonMixin} from 'common/js/mixin';
  import {formatImg, isUnDefined} from 'common/js/util';

  export default {
    mixins: [commonMixin],
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      isDiscount(item) {
        let discount = item.discount;
        discount = isUnDefined(discount) ? 1 : discount;
        if (discount !== 1) {
          return true;
        }
        return false;
      },
      getDiscount(item) {
        return +item.discount * 10;
      },
      formatImg(pic) {
        return formatImg(pic);
      },
      goDetail(code) {
        this.$router.push(this.$route.path + '/' + code);
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .mall-items-wrapper {
    background: #fff;

    li {
      display: flex;
      padding: 0.3rem;
      @include border-bottom-1px($color-border);

      &:last-child {
        @include border-none();
      }

      .img-wrap {
        position: relative;
        width: 2.4rem;
        flex: 0 0 2.4rem;
        height: 2.4rem;
        overflow: hidden;
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

      .info {
        display: flex;
        padding: 0.1rem 0 0.1rem 0.2rem;
        flex-direction: column;
        justify-content: space-between;

        h2 {
          line-height: 1.3;
          font-size: $font-size-medium;
        }

        .label {
          margin-top: 0.18rem;
          font-size: 0;

          label {
            display: inline-block;
            vertical-align: top;
            padding: 0.08rem 0.12rem;
            border-radius: 3px;
            font-size: 0.22rem;

            &+label {
              margin-left: 0.2rem;
            }

            &:nth-child(2n + 1) {
              color: $primary-color;
              border: 1px solid $primary-color;
            }

            &:nth-child(2n) {
              color: $second-color;
              border: 1px solid $second-color;
            }
          }
        }

        .price {
          margin-top: 0.22rem;
          font-size: $font-size-large-ss;

          label {
            font-size: $font-size-small-s;
          }

          span {
            padding-left: 0.35rem;
            font-size: $font-size-small-s;
            color: $color-text-l;
          }
        }

        .addr {
          margin-top: 0.18rem;
          padding-left: 0.28rem;
          font-size: $font-size-small-s;
          color: $color-text-l;
          background-repeat: no-repeat;
          background-position: left center;
          background-size: 0.2rem;
          @include bg-image('addr');
        }
      }
    }
  }
</style>
