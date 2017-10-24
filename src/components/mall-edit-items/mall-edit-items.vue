<template>
  <ul class="mall-edit-items-wrapper">
    <li v-for="item in data" @click="goDetail(item.code)">
      <div class="inner border-bottom-1px">
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
        <div class="status-sell" v-show="item.status==='4'"></div>
      </div>
      <div class="bottom">
        <label v-if="item.status==='6'">系统强制下架</label>
        <span class="btn cancel" v-show="showDelete(item)" @click.stop="deleteGoods(item)">删除</span>
        <span class="btn" v-show="showEdit(item)" @click.stop="edit(item)">编辑</span>
        <span class="btn" v-show="showUp(item)" @click.stop="upGoods(item)">上架</span>
        <span class="btn cancel" v-show="showDown(item)" @click.stop="downGoods(item)">下架</span>
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
      edit(item) {
        this.$emit('edit', item);
      },
      deleteGoods(item) {
        this.$emit('delete', item);
      },
      upGoods(item) {
        this.$emit('up', item);
      },
      downGoods(item) {
        this.$emit('down', item);
      },
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
      showEdit(item) {
        return item.status === '5';
      },
      showDelete(item) {
        return item.status === '4' || item.status === '6' || item.status === '5';
      },
      showUp(item) {
        return item.status === '5';
      },
      showDown(item) {
        return item.status === '3';
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

  .mall-edit-items-wrapper {
    li {
      margin-bottom: 0.2rem;
      background: #fff;

      .inner {
        display: flex;
        padding: 0.3rem;
        @include border-bottom-1px($color-border);

        .status-sell {
          position: absolute;
          right: 0.1rem;
          bottom: 0.1rem;
          width: 1rem;
          height: 1rem;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          @include bg-image('sell');
        }
      }

      &:last-child {
        .inner {
          @include border-none();
        }
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

      .bottom {
        height: 1rem;
        line-height: 1rem;
        padding: 0 0.3rem;
        font-size: 0;

        label {
          font-size: $font-size-medium-s;
          color: $color-red;
        }

        .btn {
          display: inline-block;
          height: 0.6rem;
          line-height: 0.6rem;
          margin-left: 0.2rem;
          margin-top: 0.2rem;
          padding: 0 0.3rem;
          float: right;
          border: 1px solid $primary-color;
          border-radius: 0.06rem;
          font-size: $font-size-medium;
          color: $primary-color;

          &.cancel {
            border: 1px solid #ccc;
            color: #ccc;
          }
        }
      }
    }
  }
</style>
