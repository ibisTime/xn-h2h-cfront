<template>
  <div class="recommend-wrapper">
    <div class="scroll-wrapper">
      <scroll ref="scroll" :pullUpLoad="pullUpLoad" > 
        <div class="h-content">     
        <div class="history" @click="goHistory">推荐历史</div>
        <div class="empty"></div>
        <div class="main-content">
          <button @click="showTJ">点击邀请好友</button>
          <div v-show="content">
              <div class="title">活动规则</div>
              <div class="info"  ref="content">{{content}}</div>               
            </div>
        </div>
        </div>
      </scroll>    
    </div>      
    <go-home></go-home>
    <share-mask ref="mask"></share-mask>
    <router-view></router-view>
  </div>
</template>
<script>
  import MHeader from 'components/m-header/m-header';
  import GoHome from 'components/go-home/go-home';
  import ShareMask from 'components/share-mask/share-mask';
  import Scroll from 'base/scroll/scroll';
  import {mapMutations, mapGetters} from 'vuex';
  import {initShare} from 'common/js/weixin';
  import {setTitle, getShareImg} from 'common/js/util';
  import {getPageInviteActivity} from 'api/biz';
  import {SET_USER_STATE} from 'store/mutation-types';
  import {getUser} from 'api/user';

  export default {
    data() {
      return {
        content: '',
        code: ''
      };
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    created() {
      this.first = true;
      this.isWxConfiging = false;
      this.wxData = null;
      this.pullUpLoad = null;
      this.initData();
    },
    updated() {
      this.initData();
    },
    methods: {
      initData() {
        if (this.$route.path === '/home/recommend') {
          setTitle('我的推荐');
          if (this.first) {
            this.first = false;
            this.getUser();
            getPageInviteActivity(1, 1).then((data) => {
              if (data.list.length) {
                this.content = data.list[0].description;
                this.code = data.list[0].code;
                this.initShare();
                setTimeout(() => {
                  this.$refs.scroll.refresh();
                }, 20);
              }
            });
          } else {
            // 当前页面,并且微信sdk未初始化
            if(!this.isWxConfiging && !this.wxData) {
              this.initShare();
            }
          }
        } else {
          this.isWxConfiging = false;
          this.wxData = null;
        }
      },
      initShare() {
        this.isWxConfiging = true;
        initShare({
          title: '我淘网',
          desc: '二手买卖',
          link: location.href + '?activityCode=' + this.code,
          imgUrl: getShareImg()
        }, (data) => {
          this.isWxConfiging = false;
          this.wxData = data;
        }, () => {
          this.isWxConfiging = false;
          this.wxData = null;
        });
      },
      getUser() {
        if (!this.user) {
          getUser().then((data) => {
            this.setUser(data);
          }).catch(() => {});
        }
      },
      showTJ() {
        this.$refs.mask.show();
      },
      goHistory() {
        this.$router.push('/home/recommend/history');
      },
      ...mapMutations({
        setUser: SET_USER_STATE
      })
    },
    components: {
      MHeader,
      GoHome,
      ShareMask,
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .recommend-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: $primary-color;
    .history {
      right: 0;
      top: 0;
      width: 100%;
      padding: 0.3rem;
      text-align: right;
      font-size: $font-size-medium-xx;
      color: #fff;
    }
    
    .empty {
      height: 5.4rem;
    }

    .main-content {
      text-align: center;
      font-size: 0;
      height: 100%;
      width: 100%;

      button {
        width: 5.74rem;
        line-height: 0.96rem;
        border: 1px solid #383737;
        border-radius: 0.45rem;
        text-align: center;
        font-size: $font-size-large-s;
        color: #fff;
        background-color: $second-color;
      }

      .title {
        margin-top: 0.7rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 2.2rem;
        @include bg-image('title');
        font-size: $font-size-medium-xx;

        &.h-content {
          background-size: contain;
        }
      }

      .info {
        margin: 0.48rem 0.3rem;
        padding: 0.28rem 0.36rem;
        box-shadow: 0.1rem 0.1rem 0 rgba(0, 0, 0, 0.2);
        line-height: 0.4rem;
        font-size: $font-size-small;
        text-align: left;
        background-color: #fff;
        white-space: pre-line;
      }
    }

    .content {
      height: 100%;
      width: 100%;
    }

    .scroll-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .h-content{
        width: 100%;
        height: 100%; 
        background-size: 100%;
        background-repeat: no-repeat;  
        @include bg-image('bg');
      }  
    } 
  }
</style>
