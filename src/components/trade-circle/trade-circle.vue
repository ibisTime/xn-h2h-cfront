<template>
  <div class="trades-wrapper" ref="trades">
    <scroll ref="scroll" :hasMore="hasMore" :data="tradeList">
      <ul class="trades-items-wrapper" ref="tradeList">
        <li v-for="item in tradeList" @click="goDetail(item.code)" class="trade-wrapper" >
          <div class="trade-top">
            <div class="head-pic" :style="getImgStyl(item.pic)"></div>
            <div class="person-info">
              <div class="name">{{item.name}}</div>
              <div class="area">
                <span>{{item.city}} </span>|<span> 5小时前来过</span>
              </div>
            </div>
            <div class="clothes">来自{{item.categoryName}}</div>
          </div>
          <div class="photos-wrapper">
            <trade-scroll :data="tradeList"></trade-scroll>
          </div>          
          <div class="trade-bottom">
            <div class="description">{{item.description}}</div>
            <div class="goods-price">￥<span>{{item.price | formatAmount}}</span></div>
            <ul class="operate-icon">
              <li class="want">111</li>
              <li class="message">111</li>
              <!-- <li class="more"></li> -->
            </ul>
          </div>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
    <!-- <div v-show="!tradeList && !hasMore" class="no-result-wrapper">
      <no-result title="抱歉，暂无订单"></no-result>
    </div>   -->  
  </div>
</template>

<script type="text/ecmascript-6">
  import TradeScroll from 'components/trade-scroll/trade-scroll';
  import Scroll from 'base/scroll/scroll';
  import {getPageGoods} from 'api/biz';
  import {formatImg} from 'common/js/util';
  import {getDictList} from 'api/general';
  import {commonMixin} from 'common/js/mixin';

  const LIMIT = 20;

  export default {
    mixins: [commonMixin],
    data() {
      return {
        hasMore: true,
        start: 1,
        isPublish: 1,
        tradeList: []
      };
    },
    created() {
      this.getInitData();
    },
    methods: {
      getInitData() {
        this.getTradeCircle();
      },
      getTradeCircle () {
        getPageGoods({
          start: this.start,
          limit: LIMIT,
          isPublish: this.isPublish
        }).then((data) => {
          this.hasMore = false;
          data.list.forEach((item, index) => {
            this.tradeList.push(item);
          });
        });
      },
      getImgStyl(pic) {
        return {
          backgroundImage: `url(${formatImg(pic)})`
        };
      },
      getMallTypeDict() {
        return getDictList('mall_type');
      },
      goDetail(code) {
        this.$router.push(this.$route.path + '/' + code);
      }
    },
    components: {
      Scroll,
      TradeScroll
      // Slider
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";
  .trades-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #F5F5F5;
    .trades-items-wrapper{
      position: relative;
      width: 100%;
    .trade-wrapper{
      border-top: 1px solid #eee;
      background: #fff;
      width: 100%;
      font-size: $font-size-medium-x;

      .trade-top{
        display: flex;
        height: 1.5rem;

        .head-pic{
          width: 0.9rem;
          height: 0.9rem;
          margin: 0.3rem 0.24rem 0.2rem 0.3rem;
          background-size: 100% 100%;
          border-radius: 50%;
        }
        
        .person-info{
          flex: 2;
          padding-top: 0.45rem;
          width: 2.5rem;
          .name{
            color: #484848;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;            
          }

          .area{
            margin-top: 0.1rem;
            color: #999899;
            font-size: $font-size-small;            
          }
        }

        .clothes{ 
          // width:0.38rem;
          margin:0 0.3rem;
          line-height: 1.5rem;
          color: #48b0fb;         
        }
      } 
      .photos-wrapper{
        margin-left: 0.3rem;
      }      

      // .slider-wrapper {
      //   position: relative;
      //   height: 2.24rem;
      //   margin-left: 0.3rem;
      //   overflow: hidden;

      //   .slider, .pic-slider {
      //     display: inline-block;
      //     height: 2.24rem;
      //     width: 2.24rem;
      //   }

      //   a {
      //     display: inline-block;
      //     height: 2.24rem;
      //     width: 2.24rem;
      //     display: inline-block;
      //     background-repeat: no-repeat;
      //     background-position: center;
      //     background-size: cover;
      //   }
      // }      
    
      .trade-bottom{
        margin:0.2rem 0.3rem 0;
        color: #484848;

        .description{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .goods-price{
          margin: 0.3rem 0;
          display: inline-block;
          width: 30%;
          color: #ff5000;
          font-size: $font-size-small;
          span{
            font-size: $font-size-large-xx;
          }
        }

        .operate-icon{
          display: inline-block;
          float: right;
          li{
            float: left;
            width: 1.3rem;
            height: 0.45rem;
            line-height: 0.45rem;  
            background-size: 0.3rem;           
            background-repeat: no-repeat;
            background-position: 0 50%;
            margin-top: 0.3rem;
            padding-left: 0.4rem;
            font-size: $font-size-small;
            color: #999899;
            &:last-child{
              width: 0.8rem;
            }          
          }
          .want{
            @include bg-image('want');
          }
          .message{
            @include bg-image('message');
          }          
          .more{
            @include bg-image('more');
          }          
        }

      }

    }     
    }
  }
</style>
