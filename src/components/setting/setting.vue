<template>
  <transition name="slide">
    <div class="user-wrapper">
      <scroll :pullUpLoad="pullUpLoad" class="user-content">
        <div>
          <div class="setting-wrapper">
            <div class="setting-item border-bottom-1px">
              <h2>头像</h2>
              <img :src="getAvatar()"/>
              <qiniu
                ref="qiniu"
                style="visibility: hidden;position: absolute;"
                :token="token"
                :uploadUrl="uploadUrl"></qiniu>
              <input class="input-file"
                     type="file"
                     :multiple="multiple"
                     ref="fileInput"
                     @change="fileChange"
                     accept="image/*"/>
              <i class="arrow"></i>
            </div>
            <div class="setting-item border-bottom-1px" @click="goNick">
              <h2>昵称</h2>
              <span v-if="user && user.nickname">{{user.nickname}}</span>
              <span v-else>设置昵称</span>
              <i class="arrow"></i>
            </div>
            <div class="setting-item border-bottom-1px" @click="goMobile">
              <h2>手机号</h2>
              <span v-if="user && user.mobile">{{user.mobile}}</span>
              <span v-else>绑定手机号</span>
              <i class="arrow"></i>
            </div>
            <div @click="goTrade" class="setting-item border-bottom-1px">
              <h2>支付密码</h2>
              <span v-if="user && user.tradepwdFlag">修改密码</span>
              <span v-else>设置密码</span>
              <i class="arrow"></i>
            </div>
            <div @click="goBirthday" class="setting-item border-bottom-1px">
              <h2>生日</h2>
              <span v-if="user && user.birthday">{{getBirthday()}}</span>
              <span v-else>设置生日</span>
              <i class="arrow"></i>
            </div>
            <div @click="goGender" class="setting-item border-bottom-1px">
              <h2>性别</h2>
              <span v-if="user && user.gender">{{getGender()}}</span>
              <span v-else>设置性别</span>
              <i class="arrow"></i>
            </div>
            <div @click="goIntroduce" class="setting-item border-bottom-1px">
              <h2>个人简介</h2>
              <span v-if="user && user.introduce">{{user.introduce}}</span>
              <i class="arrow"></i>
            </div>
            <div @click="goAddress" class="setting-item border-bottom-1px">
              <h2>收货地址</h2>
              <i class="arrow"></i>
            </div>
            <div @click="goBankCard" class="setting-item border-bottom-1px">
              <h2>我的银行卡</h2>
              <i class="arrow"></i>
            </div>
            <div @click="goAboutus" class="setting-item border-bottom-1px">
              <h2>关于我们</h2>
              <i class="arrow"></i>
            </div>
            <div class="set-btns">
              <button @click="logout">退出登录</button>
            </div>
          </div>
        </div>
      </scroll>
      <toast :text="text" ref="toast"></toast>
      <full-loading v-show="loadingFlag"></full-loading>
      <clip-img @choseImage="updateImg"
                @cancel="handleCancel"
                ref="clipImg"
                :imgType="imgType"
                :imgUrl="imgUrl"></clip-img>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import EXIF from 'exif-js';
  import {SET_USER_STATE, SET_USER_AVATAR} from 'store/mutation-types';
  import Qiniu from 'base/qiniu/qiniu';
  import Scroll from 'base/scroll/scroll';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import ClipImg from 'base/clip-img/clip-img';
  import {getUser, changeAvatar} from 'api/user';
  import {getAppId, getQiniuToken} from 'api/general';
  import {setTitle, clearUser, formatImg, getImgData, formatDate} from 'common/js/util';
  import {commonMixin} from 'common/js/mixin';

  const genderList = {
    '1': '男',
    '0': '女'
  };

  export default {
    mixins: [commonMixin],
    data() {
      return {
        loadingFlag: true,
        title: '',
        text: '',
        token: '',
        imgType: '',
        imgUrl: '',
        imgKey: '',
        preview: ''
      };
    },
    created() {
      this.pullUpLoad = null;
      this.multiple = false;
      this.uploadUrl = 'http://up-z0.qiniu.com';
      if (this.shouldGetData()) {
        this._getUser();
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    updated() {
      if (this.shouldGetData()) {
        this._getUser();
      }
    },
    methods: {
      shouldGetData() {
        if (/\/user\/[^/]+\/setting$/.test(this.$route.path)) {
          setTitle('设置');
          return !this.token;
        }
        return false;
      },
      _getUser() {
        Promise.all([
          this.getUser(),
          this.getQiniuToken()
        ]).then(() => {
          this.loadingFlag = false;
        }).catch(() => {});
      },
      getUser() {
        if (this.user) {
          return Promise.resolve(this.user);
        }
        return getUser().then((data) => {
          this.setUser(data);
        });
      },
      getGender() {
        return this.user && this.user.gender && genderList[this.user.gender] || '';
      },
      getBirthday() {
        return this.user && formatDate(this.user.birthday, 'yyyy年M月d日');
      },
      getQiniuToken() {
        return getQiniuToken().then((data) => {
          this.token = data.uploadToken;
        });
      },
      /**
       * 从相册中选择图片
       * */
      fileChange(e) {
        this.title = '上传中...';
        this.loadingFlag = true;
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        files = Array.prototype.slice.call(files, 0, 1);
        let self = this;
        let file = files[0];
        let orientation;
        EXIF.getData(file, function() {
          orientation = EXIF.getTag(this, 'Orientation');
        });
        let reader = new FileReader();
        reader.onload = function(e) {
          getImgData(file.type, this.result, orientation, function(data) {
            let _url = URL.createObjectURL(file);
            let key = _url.split('/').pop() + '.' + file.name.split('.').pop();
            self.imgType = file.type;
            self.imgUrl = data;
            self.imgKey = key;
            self.$refs.clipImg.show();
            self.$refs.fileInput.value = null;
          });
        };
        reader.readAsDataURL(file);
      },
      /**
       * 处理图片上传错误事件
       * @param error 错误信息
       */
      onUploadError(error) {
        this.text = error.body && error.body.error || '图片上传出错';
        this.$refs.toast.show();
      },
      updateImg(base64) {
        this.preview = base64;
        this.$refs.qiniu.uploadByBase64(base64, this.imgKey).then(() => {
          this.editAvatar();
        }).catch((err) => {
          this.preview = '';
          self.onUploadError(err);
        });
      },
      handleCancel() {
        this.loadingFlag = false;
      },
      editAvatar() {
        changeAvatar(this.imgKey).then(() => {
          this.loadingFlag = false;
          this.setAvatar(this.imgKey);
        }).catch(() => {
          this.preview = '';
          this.loadingFlag = false;
        });
      },
      goTrade() {
        this.$router.push(this.$route.path + '/set-tradepwd');
      },
      goNick() {
        this.$router.push(this.$route.path + '/nickname');
      },
      goBirthday() {
        this.$router.push(this.$route.path + '/set-birthday');
      },
      goGender() {
        this.$router.push(this.$route.path + '/gender');
      },
      goIntroduce() {
        this.$router.push(this.$route.path + '/introduce');
      },
      goAddress() {
        this.$router.push(this.$route.path + '/address');
      },
      goBankCard() {
        this.$router.push(this.$route.path + '/bankcard');
      },
      goAboutus() {
        this.$router.push(this.$route.path + '/aboutus');
      },
      goMobile() {
        if (this.user && this.user.mobile) {
          this.$router.push(this.$route.path + '/change-mobile');
        } else {
          this.$router.push(this.$route.path + '/bind-mobile');
        }
      },
      logout() {
        clearUser();
        this._reloadPage();
      },
      getAvatar() {
        if (!this.user) {
          return require('./avatar@2x.png');
        }
        return formatImg(this.preview || this.user.photo);
      },
      _reloadPage() {
        getAppId().then((data) => {
          let appId = data.cvalue;
          let redirectUri = encodeURIComponent(`${location.origin}?#/home`);
          let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
          let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
          setTimeout(() => {
            location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
          }, 100);
        });
      },
      ...mapMutations({
        setUser: SET_USER_STATE,
        setAvatar: SET_USER_AVATAR
      })
    },
    components: {
      Scroll,
      Qiniu,
      Toast,
      FullLoading,
      ClipImg
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .user-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 101;

    .user-content{
      position: relative;
      height: 100%;
      overflow: hidden;

      .setting-wrapper {
        .setting-item {
          position: relative;
          height: 1.16rem;
          line-height: 1.16rem;
          padding-left: 0.3rem;
          @include border-bottom-1px($color-border);

          h2 {
            font-size: $font-size-medium-x;
          }

          .arrow {
            position: absolute;
            right: 0;
            top: 0;
            width: 0.8rem;
            height: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 0.2rem;
            @include bg-image('more');
          }

          img {
            position: absolute;
            right: 0.8rem;
            width: 0.92rem;
            height: 0.92rem;
            top: 0.12rem;
            border-radius: 50%;
          }

          span {
            position: absolute;
            right: 0.8rem;
            left: 2rem;
            top: 50%;
            transform: translate(0, -50%);
            overflow: hidden;
            white-space: nowrap;
            text-align: right;
            text-overflow: ellipsis;
            font-size: $font-size-medium-x;
            color: $color-text-l;
          }

          .input-file {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }
      }
    }
    .set-btns {
      /*position: absolute;*/
      /*bottom: 0;*/
      /*left: 0;*/
      /*width: 100%;*/
      padding: 0.24rem 0.36rem;
      font-size: 0;

      button {
        width: 100%;
        border-radius: 0.16rem;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: $font-size-medium;
        color: #fff;
        background-color: $color-cancel-background;
      }
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
