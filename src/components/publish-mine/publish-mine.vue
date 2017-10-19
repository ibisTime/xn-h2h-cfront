<template>
  <transition name="slide">
    <div class="publish-mine-wrapper">
      <div class="top-category border-bottom-1px">
        <div @click="selectItem(0)" class="item" :class="itemCls(0)">
          <div class="inner">我发布的</div>
        </div>
        <div @click="selectItem(1)" class="item" :class="itemCls(1)">
          <div class="inner">已下架宝贝</div>
        </div>
      </div>
      <div class="content">
        <scroll :data="currentList" :hasMore="hasMore">
          <mall-edit-items :data="currentList"
                           @edit="editGoods"
                           @delete="deleteGoods"
                           @up="upGoods"
                           @down="downGoods"></mall-edit-items>
        </scroll>
      </div>
      <full-loading v-show="loadingFlag" :title="loadingText"></full-loading>
      <confirm ref="confirm" :text="confirmText" @confirm="handleConfirm"></confirm>
      <router-view @updateProduct="handleEdit"></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Confirm from 'base/confirm/confirm';
  import FullLoading from 'base/full-loading/full-loading';
  import MallEditItems from 'components/mall-edit-items/mall-edit-items';
  import {setTitle} from 'common/js/util';
  import {getPageMineGoods, deleteGoods, upGoods, downGoods} from 'api/biz';
  import {SET_PUBLISH_GOODS} from 'store/mutation-types';
  import {mapMutations} from 'vuex';

  const IDX2STATUS = [[3], [4, 5]];
  const DELETE = 'DELETE';
  const UP = 'UP';
  const DOWN = 'DOWN';
  const EDIT = 'EDIT';

  export default {
    data() {
      return {
        goodsObj: {},
        currentList: [],
        currentIndex: 0,
        hasMore: true,
        loadingFlag: false,
        loadingText: '',
        confirmText: '',
        currentItem: '',
        currentOperator: ''
      };
    },
    created() {
      this.first = true;
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    methods: {
      shouldGetData() {
        if (this.$route.path === '/user/pub-mine') {
          setTitle('我发布的');
          return this.first;
        }
        return false;
      },
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          this.goodsObj[this.currentIndex] = {
            start: 1,
            limit: 10,
            hasMore: true,
            data: []
          };
          this.getPageGoods();
        }
      },
      getPageGoods() {
        let status = IDX2STATUS[this.currentIndex];
        let item = this.goodsObj[this.currentIndex];
        getPageMineGoods(item.start, item.limit, status).then((data) => {
          item.data = item.data.concat(data.list);
          if (data.list.length < item.limit || data.totalCount <= item.limit) {
            item.hasMore = false;
          }
          this.currentList = item.data;
          this.hasMore = item.hasMore;
          item.start++;
        });
      },
      handleConfirm() {
        if (this.currentOperator === DELETE) {
          this.handleDelete();
        } else if (this.currentOperator === UP) {
          this.handleUPGoods();
        } else if (this.currentOperator === DOWN) {
          this.handleDownGoods();
        }
      },
      editGoods(item) {
        this.currentItem = item;
        this.currentOperator = EDIT;
        this.setPublishGoods(item);
        this.$router.push('/user/pub-mine/publish?code=' + item.code);
      },
      handleEdit(item) {
        if (!this.first) {
          let index = this.currentList.findIndex((product) => {
            return product.code === this.currentItem.code;
          });
          this.currentList.splice(index, 1, item);
        }
      },
      deleteGoods(item) {
        this.currentItem = item;
        this.currentOperator = DELETE;
        this.confirmText = '确定删除该商品吗';
        this.$refs.confirm.show();
      },
      handleDelete() {
        this.loadingText = '删除中...';
        this.loadingFlag = true;
        deleteGoods(this.currentItem.code).then(() => {
          this.loadingFlag = false;
          let index = this.currentList.findIndex((product) => {
            return product.code === this.currentItem.code;
          });
          this.currentList.splice(index, 1);
        }).catch(() => {
          this.loadingFlag = false;
        });
      },
      upGoods(item) {
        this.currentItem = item;
        this.currentOperator = UP;
        this.confirmText = '确定上架该商品吗';
        this.$refs.confirm.show();
      },
      handleUPGoods() {
        this.loadingText = '上架中...';
        this.loadingFlag = true;
        upGoods(this.currentItem.code).then(() => {
          this.loadingFlag = false;
          let index = this.currentList.findIndex((product) => {
            return product.code === this.currentItem.code;
          });
          let item = this.currentList.splice(index, 1);
          if (this.goodsObj[0]) {
            item.status = 3;
            this.goodsObj.data.unshift(item);
          }
        }).catch(() => {
          this.loadingFlag = false;
        });
      },
      downGoods(item) {
        this.currentItem = item;
        this.currentOperator = DOWN;
        this.confirmText = '确定下架该商品吗';
        this.$refs.confirm.show();
      },
      handleDownGoods() {
        this.loadingText = '下架中...';
        this.loadingFlag = true;
        downGoods(this.currentItem.code).then(() => {
          this.loadingFlag = false;
          let index = this.currentList.findIndex((product) => {
            return product.code === this.currentItem.code;
          });
          let item = this.currentList.splice(index, 1);
          if (this.goodsObj[1]) {
            item.status = 4;
            this.goodsObj.data.unshift(item);
          }
        }).catch(() => {
          this.loadingFlag = false;
        });
      },
      selectItem(index) {
        this.currentIndex = index;
        if (!this.goodsObj[index]) {
          this.currentList = [];
          this.goodsObj[index] = {
            start: 1,
            limit: 10,
            hasMore: true,
            data: []
          };
          this.getPageGoods();
        } else {
          this.currentList = this.goodsObj[index].data;
        }
        this.hasMore = this.goodsObj[index].hasMore;
      },
      itemCls(index) {
        return this.currentIndex === index ? 'active' : '';
      },
      ...mapMutations({
        'setPublishGoods': SET_PUBLISH_GOODS
      })
    },
    components: {
      Scroll,
      Confirm,
      FullLoading,
      MallEditItems
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .publish-mine-wrapper {
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
      top: 0.9rem;
      bottom: 0;
      left: 0;
      width: 100%;
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
