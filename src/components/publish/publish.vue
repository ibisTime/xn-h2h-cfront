<template>
  <transition name="slide-up">
    <div class="publish-wrapper">
      <m-header :border="border" title="发布" actText="取消" :showBack="showBack" @action="close"></m-header>
      <div class="main">
        <div class="photos-wrapper">
          <photo-scroll @updatePhotos="updatePhotos" :token="token" :photos="photos"></photo-scroll>
        </div>
        <div class="split"></div>
        <div class="desc-wrapper">
          <div class="title">
            <input type="text" v-model="name" placeholder="商品名称">
          </div>
          <div class="desc">
            <textarea rows="4" placeholder="在这里写下宝贝的广告语吧" v-model="description"></textarea>
          </div>
          <div class="addr">
            <span>{{addrText}}</span>
            <div @click.stop="choseNew" class="new" :class="newCls">全新宝贝</div>
          </div>
        </div>
        <div class="split"></div>
        <div class="infos">
          <div class="info-item border-bottom-1px" @click="goCate">分类<div class="label icon-right">{{categoryText}}</div></div>
          <div class="info-item border-bottom-1px" @click="showPrice">价格
            <div class="label" :class="sellCls">{{sellText}}</div>
          </div>
          <div v-show="isPublish" class="info-item">同步到圈子<div class="label">
            <switch-option class="option" :value="isPublish" @update:value="updatePublish"></switch-option>
          </div></div>
        </div>
        <div class="bottom-btn">
          <button @click="publish">发布</button>
        </div>
      </div>
      <price-mask ref="priceMask" @confirm="updatePrice"></price-mask>
      <toast ref="toast" :text="text"></toast>
      <full-loading v-show="loadingFlag" :title="loadingText"></full-loading>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex';
  import {SET_PUBLISH_CATEGORY, SET_PUBLISH_GOODS} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import SwitchOption from 'base/switch-option/switch-option';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import MHeader from 'components/m-header/m-header';
  import PhotoScroll from 'components/photo-scroll/photo-scroll';
  import PriceMask from 'components/price-mask/price-mask';
  import {isUnDefined, formatImg} from 'common/js/util';
  import {publish, getGoodsDetail, editGoods} from 'api/biz';
  import {getQiniuToken} from 'api/general';

  export default {
    data() {
      return {
        photos: [],
        name: '',
        description: '',
        isNew: false,
        sellPrice: '',
        oriPrice: '',
        freight: '',
        isFree: false,
        isPublish: true,
        text: '',
        loadingFlag: true,
        loadingText: '正在载入...',
        token: ''
      };
    },
    created() {
      this.activityCode = this.$route.query.act || '';
      this.code = this.$route.query.code || '';
      this.showBack = false;
      this.border = true;
      /act/.test(this.$route.path) ? this.isPublish = false : this.isPublish = true;
      if (this.code) {
        this.getData();
      } else {
        this.getQiniuToken().then(() => {
          this.loadingFlag = false;
        }).catch(() => {
          this.loadingFlag = false;
        });
        this.setCategory(null);
      }
    },
    computed: {
      newCls() {
        return this.isNew ? 'active' : '';
      },
      sellCls() {
        return isUnDefined(this.sellPrice) ? '' : 'text';
      },
      sellText() {
        return isUnDefined(this.sellPrice) ? '开个价' : this.sellPrice;
      },
      categoryText() {
        return this.publishCategory ? this.publishCategory.name : '选择分类';
      },
      addrText() {
        if (this.location) {
          let address = this.location.addressComponent;
          return address.city + ' ' + address.area;
        } else if (this.isLocaErr) {
          return '定位失败';
        }
        return '定位中...';
      },
      ...mapGetters([
        'publishCategory',
        'publishGoods',
        'location',
        'isLocaErr'
      ])
    },
    methods: {
      getData() {
        if (!this.publishGoods) {
          Promise.all([
            this.getGoodsDetail(),
            this.getQiniuToken()
          ]).then(() => {
            this.loadingFlag = false;
          }).catch(() => {
            this.loadingFlag = false;
          });
        } else {
          this.getQiniuToken().then(() => {
            this.loadingFlag = false;
          }).catch(() => {
            this.loadingFlag = false;
          });
          this.initData();
        }
      },
      initData() {
        this.setCategory({
          parentCode: this.publishGoods.category,
          code: this.publishGoods.type,
          name: this.publishGoods.typeName
        });
        this.photos = this.publishGoods.pic.split('||').map((key) => {
          return {
            key,
            ok: true,
            preview: formatImg(key),
            type: this.getImgType(key)
          };
        });
        this.name = this.publishGoods.name;
        this.description = this.publishGoods.description;
        this.isNew = this.publishGoods.isNew === '1';
        this.sellPrice = +this.publishGoods.price / 1000;
        this.oriPrice = +this.publishGoods.originalPrice / 1000;
        this.freight = +this.publishGoods.yunfei / 1000;
        this.isFree = this.publishGoods.yunfei === 0;
        if (/act/.test(this.$route.path)) {
          this.isPublish = this.publishGoods.isPublish === 0;
        } else {
          this.isPublish = this.publishGoods.isPublish === 1;
        }
        setTimeout(() => {
          this.$refs.priceMask.updateData(this.sellPrice, this.isFree, this.freight, this.oriPrice);
        }, 20);
      },
      getQiniuToken() {
        return getQiniuToken().then((data) => {
          this.token = data.uploadToken;
        });
      },
      getGoodsDetail() {
        return getGoodsDetail(this.code).then((data) => {
          this.setPublishGoods(data);
          this.initData();
        });
      },
      choseNew() {
        this.isNew = !this.isNew;
      },
      goCate() {
        this.$router.push(this.$route.path + '/category');
      },
      showPrice() {
        this.$refs.priceMask.show();
      },
      updatePhotos(photos) {
        this.photos = photos;
      },
      updatePrice(sellPrice, oriPrice, freight, isFree) {
        this.sellPrice = sellPrice;
        this.oriPrice = oriPrice;
        this.freight = freight;
        this.isFree = isFree;
      },
      updatePublish(val) {
        this.isPublish = val;
      },
      valid() {
        let err = true;
        if (!this.photos.length) {
          this.text = '照片未上传';
        } else if (isUnDefined(this.name)) {
          this.text = '商品名称不能为空';
        } else if (isUnDefined(this.description)) {
          this.text = '商品简介不能为空';
        } else if (this.isLocaErr) {
          this.text = '定位失败';
        } else if (!this.publishCategory) {
          this.text = '商品分类不能为空';
        } else if (isUnDefined(this.sellPrice)) {
          this.text = '商品价格不能为空';
        } else {
          err = false;
        }
        err && this.$refs.toast.show();
        return !err;
      },
      prepareParams() {
        let pic = this.photos.map(item => item.key).join('||');
        let {province, city, area} = this.location.addressComponent;
        let {lat: latitude, lng: longitude} = this.location.position;
        return {
          province,
          city,
          area,
          latitude,
          longitude,
          pic,
          description: this.description,
          isNew: this.isNew ? 1 : 0,
          isPublish: this.isPublish ? 1 : 0,
          name: this.name,
          originalPrice: this.oriPrice * 1000,
          price: this.sellPrice * 1000,
          yunfei: this.freight * 1000,
          type: this.publishCategory.code
        };
      },
      publish() {
        if (this.valid()) {
          let param = this.prepareParams();
          if (!this.code) {
            this.loadingText = '发布中...';
            this.loadingFlag = true;
            param.activityCode = this.activityCode;
            publish(param).then(() => {
              this.loadingFlag = false;
              this.text = '发布成功';
              this.$refs.toast.show();
              if (/act/.test(this.$route.path)) {
                setTimeout(() => {
                  this.$router.push('/category/list?act=1');
                }, 1000);
              } else {
                setTimeout(() => {
                  this.$router.push('/category');
                }, 1000);
              }
            }).catch(() => {
              this.loadingFlag = false;
            });
          } else {
            this.loadingText = '修改中...';
            this.loadingFlag = true;
            editGoods(this.code, param).then(() => {
              this.loadingFlag = false;
              this.text = '修改成功';
              this.$refs.toast.show();
              let item = this.publishGoods;
              this.$emit('updateProduct', {
                ...item,
                ...param
              });
              setTimeout(() => {
                this.$router.back();
              }, 1000);
            }).catch(() => {
              this.loadingFlag = false;
            });
          }
        }
      },
      close() {
        this.$router.back();
      },
      getImgType(key) {
        let type = 'image/png';
        let idx = key.lastIndexOf('.');
        if (~idx) {
          let str = key.substr(idx + 1);
          switch (str) {
            case 'jpg':
              type = 'image/jpeg';
              break;
            case 'png':
              type = 'image/png';
              break;
            case 'jpeg':
              type = 'image/jpeg';
              break;
            case 'gif':
              type = 'image/gif';
              break;
            default:
              type = 'image/png';
          }
        }
        return type;
      },
      ...mapMutations({
        setCategory: SET_PUBLISH_CATEGORY,
        setPublishGoods: SET_PUBLISH_GOODS
      })
    },
    components: {
      MHeader,
      Scroll,
      FullLoading,
      Toast,
      PriceMask,
      PhotoScroll,
      SwitchOption
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .publish-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: #fff;

    .main {
      position: absolute;
      top: 0.88rem;
      left: 0;
      width: 100%;
      bottom: 0;
      background-color: $color-background;

      .split {
        height: 0.2rem;
      }

      .desc-wrapper {
        padding: 0.45rem 0.3rem 0;
        background-color: #fff;

        .title {
          font-size: $font-size-large-s;

          input {
            width: 100%;
          }
        }

        .desc {
          padding-top: 0.32rem;
          font-size: $font-size-medium-x;

          textarea {
            width: 100%;
            line-height: 1.1;
          }
        }

        .addr {
          display: flex;
          padding: 0.2rem 0 0.2rem 0.3rem;
          background-repeat: no-repeat;
          background-position: left center;
          background-size: 0.22rem;
          @include bg-image('addr');
          font-size: $font-size-medium-x;

          span {
            flex: 1;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .new {
            padding-left: 0.4rem;
            font-size: $font-size-medium;
            background-repeat: no-repeat;
            background-position: left center;
            background-size: 0.3rem;
            @include bg-image('chose');

            &.active {
              @include bg-image('chose-act');
            }
          }
        }
      }

      .infos {
        background-color: #fff;

        .info-item {
          height: 1rem;
          line-height: 1rem;
          font-size: $font-size-medium-x;
          padding: 0 0.3rem;

          &.border-bottom-1px {
            @include border-bottom-1px($color-border);
          }

          .label {
            float: right;
            color: $color-text-l;

            &.icon-right {
              padding-right: 0.3rem;
              background-repeat: no-repeat;
              background-size: 0.14rem;
              background-position: right center;
              @include bg-image('more');
            }

            .option {
              margin-top: 0.19rem;
            }

            &.text {
              color: $color-text;
            }
          }
        }
      }

      .bottom-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1.2rem;
        padding: 0.15rem 0.3rem;
        font-size: 0;
        background-color: #fff;

        button {
          width: 100%;
          height: 0.9rem;
          border-radius: 0.1rem;
          text-align: center;
          font-size: $font-size-large-s;
          color: #fff;
          background-color: $primary-color;
        }
      }
    }

    &.slide-up-enter-active, &.slide-up-leave-active {
      transition: all 0.3s;
    }
    &.slide-up-enter, &.slide-up-leave-to {
      transform: translate3d(0, 100%, 0);
    }
  }
</style>
