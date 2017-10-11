<template>
  <ul class="mall-items-wrapper">
    <li class="border-bottom-1px">
      <div class="img-wrap">
        <img src="./demo@2x.png"/>
      </div>
      <div class="info">
        <h2>标题标题标题标题标题标题标题标题标题标题标题标题标题标题</h2>
        <div class="label">
          <label>来自电脑</label>
          <label>全新</label>
        </div>
        <div class="price">
          <label>¥</label>39.00<span>原价：¥49</span>
        </div>
        <div class="addr">杭州 | 萧山</div>
      </div>
    </li>
    <li class="border-bottom-1px">
      <div class="img-wrap">
        <img src="./demo@2x.png"/>
      </div>
      <div class="info">
        <h2>标题标题标题标题标题标题标题标题标题标题标题标题标题标题</h2>
        <div class="label">
          <label>来自电脑</label>
          <label>全新</label>
        </div>
        <div class="price">
          <label>¥</label>39.00<span>原价：¥49</span>
        </div>
        <div class="addr">杭州 | 萧山</div>
      </div>
    </li>
  </ul>
</template>
<script>
  export default {
    props: {
      list: {
        type: Array,
        default: () => []
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
      @include border-bottom-1px(#eee);

      &:last-child {
        @include border-none();
      }

      .img-wrap {
        width: 2.4rem;
        flex: 0 0 2.4rem;
        height: 2.4rem;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .info {
        padding: 0.1rem 0 0.1rem 0.2rem;

        h2 {
          line-height: 1.2;
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

            &:nth-child(2n) {
              color: $primary-color;
              border: 1px solid $primary-color;
            }

            &:nth-child(2n + 1) {
              color: $second-color;
              border: 1px solid $second-color;
            }
          }
        }

        .price {
          margin-top: 0.22rem;
          font-size: $font-size-large-s;

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
