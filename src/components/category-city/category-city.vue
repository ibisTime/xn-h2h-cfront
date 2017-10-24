<template>
  <transition name="city-fade">
    <div v-show="showFlag" class="city-picker-wrapper" @click="hide">
      <div class="position-wrapper border-top-1px border-bottom-1px" @click.stop>
        <div class="left" @click="selectPos">
          <div class="top">当前位置</div>
          <div class="text">{{position}}</div>
        </div>
        <div class="right" @click="refresh">刷新</div>
      </div>
      <div class="content" @click.stop>
        <div class="inner">
          <div class="province item">
            <scroll ref="provScroll" :pullUpLoad="pullUpLoad" :data="provList">
              <ul>
                <li v-for="(prov,index) in provList"
                    ref="prov"
                    :class="provCls(index)"
                    @click="provSelect(index)">{{prov.text}}</li>
              </ul>
            </scroll>
          </div>
          <div class="city item" :class="rightWrapCls">
            <scroll ref="cityScroll" :pullUpLoad="pullUpLoad" :data="cityList">
              <li v-for="(city,index) in cityList"
                  ref="city"
                  :class="cityCls(index)"
                  @click="citySelect(index)">{{city.text}}</li>
            </scroll>
          </div>
          <div class="area item" :class="rightWrapCls">
            <scroll ref="areaScroll" :pullUpLoad="pullUpLoad" :data="areaList">
              <li v-for="(area,index) in areaList"
                  ref="area"
                  :class="areaCls(index)"
                  @click="areaSelect(index)">{{area.text}}</li>
            </scroll>
          </div>
        </div>
      </div>
      <toast :text="text" ref="toast"></toast>
    </div>
  </transition>
</template>
<script>
  import cityData from 'common/js/city';
  import {getLocation} from 'common/js/location';
  import Scroll from 'base/scroll/scroll';
  import Toast from 'base/toast/toast';
  import {mapMutations, mapGetters} from 'vuex';
  import {SET_LOCATION, SET_IS_LOCA_ERR} from 'store/mutation-types';

  export default {
    props: {
      outProvIndex: {
        type: Number,
        default: 0
      },
      outCityIndex: {
        type: Number,
        default: 0
      },
      outAreaIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        showFlag: false,
        provList: [],
        cityList: [],
        areaList: [],
        provIndex: 0,
        cityIndex: 0,
        areaIndex: 0,
        text: ''
      };
    },
    computed: {
      rightWrapCls() {
        return this.provIndex === 0 ? 'flex0' : '';
      },
      position() {
        if (this.location) {
          let address = this.location.addressComponent;
          return address.city + ' ' + address.area;
        } else if (this.isLocaErr) {
          return '定位失败';
        }
        return '定位中...';
      },
      ...mapGetters([
        'location',
        'isLocaErr'
      ])
    },
    created() {
      this.pullUpLoad = null;
      this.initScroll();
    },
    methods: {
      initScroll() {
        if (!this.provList.length) {
          this._creatList(cityData, this.provList);
        }
        if (this.outProvIndex) {
          this.areaList = [];
          this.cityList = [];
          setTimeout(() => {
            this.$refs.provScroll.scrollToElement(this.$refs.prov[this.outProvIndex], 200, false, true);
          }, 20);
          this.provIndex = this.outProvIndex;
          this.cityIndex = this.outCityIndex;
          this.areaIndex = this.outAreaIndex;
          if (this.outProvIndex !== 0) {
            this._creatList(cityData[this.outProvIndex].sub, this.cityList);
            this._creatList(cityData[this.outProvIndex].sub[this.outCityIndex].sub, this.areaList);
            setTimeout(() => {
              this.$refs.cityScroll.scrollToElement(this.$refs.city[this.outCityIndex], 200, false, true);
              this.$refs.areaScroll.scrollToElement(this.$refs.area[this.outAreaIndex], 200, false, true);
            }, 40);
          } else {
            this.areaList = this.cityList = [];
          }
        }
      },
      _creatList(obj, list) {
        obj.forEach((item, index) => {
          list.push({
            text: item.name,
            value: index
          });
        });
      },
      provSelect(index, flag) {
        this.provIndex = index;
        if (!flag) {
          this.$refs.provScroll.scrollToElement(this.$refs.prov[index], 200, false, true);
        }
        let _cityList = cityData[index];
        this.cityIndex = 0;
        this.areaIndex = 0;
        this.cityList = [];
        this.areaList = [];
        if (_cityList.hasOwnProperty('sub')) {
          this.cityIndex = 0;
          this.areaIndex = -1;
          this._creatList(_cityList.sub, this.cityList);
          let _areaList = cityData[index].sub[0];
          if (_areaList.hasOwnProperty('sub')) {
            this._creatList(_areaList.sub, this.areaList);
          }
        } else {
          this.hide();
          this.$emit('cityChose', '', '', '', this.provIndex, this.cityIndex, this.areaIndex);
        }
      },
      citySelect(index, flag) {
        this.cityIndex = index;
        if (!flag) {
          this.$refs.cityScroll.scrollToElement(this.$refs.city[index], 200, false, true);
        }
        this.areaIndex = -1;
        this.areaList = [];
        if (cityData[this.provIndex].sub[index].hasOwnProperty('sub')) {
          var _areaList = cityData[this.provIndex].sub[index];
          this._creatList(_areaList.sub, this.areaList);
        }
      },
      areaSelect(index, flag) {
        this.areaIndex = index;
        if (!flag) {
          this.$refs.areaScroll.scrollToElement(this.$refs.area[index], 200, false, true);
        }
        this.hide();
        let prov = this.provList[this.provIndex].text;
        let city = '';
        let area = '';
        if (this.provIndex === 0) {
          prov = '';
        } else {
          city = this.cityList[this.cityIndex].text;
          area = this.areaList[this.areaIndex].text;
        }
        area = area === '全部' ? '' : area;
        this.$emit('cityChose', prov, city, area, this.provIndex, this.cityIndex, this.areaIndex);
      },
      selectPos() {
        if (this.location) {
          let addressComponent = this.location.addressComponent;
          let {province, city, area} = addressComponent;
          let index = this.provList.findIndex((item) => {
            return item.text === province;
          });
          if (~index) {
            this.provSelect(index, true);
            index = this.cityList.findIndex((item) => {
              return item.text === city;
            });
            if (~index) {
              this.citySelect(index, true);
              index = this.areaList.findIndex((item) => {
                return item.text === area;
              });
              if (~index) {
                this.areaSelect(index, true);
              } else {
                this.areaIndex = this.areaList.length - 1;
                this.$emit('cityChose', province, city, '', this.provIndex, this.cityIndex, this.areaIndex);
              }
            } else {
              this.text = '查找失败，请手动选择当前所在区域';
              this.$refs.toast.show();
            }
          } else {
            this.text = '查找失败，请手动选择当前所在区域';
            this.$refs.toast.show();
          }
        } else if (this.isLocaErr) {
          this.text = '定位失败';
          this.$refs.toast.show();
        } else {
          this.text = '定位中...';
          this.$refs.toast.show();
        }
      },
      hide() {
        this.showFlag = false;
        this.$emit('hide');
      },
      show() {
        this.showFlag = true;
        setTimeout(() => {
          this.$refs.provScroll.refresh();
          this.$refs.cityScroll.refresh();
          this.$refs.areaScroll.refresh();
        }, 400);
      },
      provCls(index) {
        return this.provIndex === index ? 'active' : '';
      },
      cityCls(index) {
        return this.cityIndex === index ? 'active' : '';
      },
      areaCls(index) {
        return this.areaIndex === index ? 'active' : '';
      },
      refresh() {
        this.setLocaErr(false);
        this.setLocation(null);
        getLocation().then((result) => {
          this.setLocation(result);
        }).catch(() => {
          this.setLocaErr(true);
          this.text = '定位失败';
          this.$refs.toast.show();
        });
      },
      ...mapMutations({
        setLocation: SET_LOCATION,
        setLocaErr: SET_IS_LOCA_ERR
      })
    },
    components: {
      Scroll,
      Toast
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .city-picker-wrapper {
    position: absolute;
    top: 1.68rem;
    left: 0;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.6);

    &.city-fade-enter-active {
      animation: city-fadein 0.3s;
      .content {
        animation: city-slide 0.3s;
      }
    }

    .position-wrapper {
      display: flex;
      height: 1.36rem;
      background: #fff;
      @include border-top-1px($color-border);
      @include border-bottom-1px($color-border);

      .left {
        flex: 1;
        padding: 0 0.3rem;

        &.flex1 {
          flex: 1;
        }

        .top {
          padding-left: 0.34rem;
          padding-top: 0.33rem;
          font-size: $font-size-small-s;
          color: $color-text-l;
          background-position: 0.08rem 0.33rem;
          background-repeat: no-repeat;
          background-size: 0.18rem;
          @include bg-image('addr');
        }

        .text {
          padding-top: 0.24rem;
          font-size: $font-size-medium-s;
        }
      }

      .right {
        padding-left: 0.4rem;
        line-height: 1.36rem;
        width: 1.4rem;
        flex: 0 0 1.4rem;
        font-size: $font-size-medium-s;
        color: $primary-color;
        background-position: left center;
        background-repeat: no-repeat;
        background-size: 0.28rem;
        @include bg-image('refresh');
      }
    }

    .content {
      position: absolute;
      top: 1.36rem;
      left: 0;
      width: 100%;
      height: 7.2rem;
      background: #fff;

      .inner {
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-size: $font-size-medium-s;

        li {
          height: 0.8rem;
          line-height: 0.8rem;
          padding-left: 0.3rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: $color-text-l;

          &.active {
            color: $color-text;
          }
        }

        .province {
          li{
            padding-left: 0.3rem;

            &.active {
              background: #fff;
            }
          }
        }

        .item {
          flex: 1;
          overflow: hidden;
          height: 100%;

          &.flex0 {
            flex: 0;
          }
        }

        .province {
          background: $color-background;
        }
      }
    }
  }
  @keyframes city-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes city-slide {
    0% {
      transform: translate3d(0, -100%, 0);
    }
    50% {
      ransform: translate3d(0, -50%, 0);
    }
    100% {
      ransform: translate3d(0, 0, 0);
    }
  }
</style>
