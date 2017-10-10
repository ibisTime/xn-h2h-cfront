<template>
  <div class="photo-scroll-wrapper" ref="scrollWrapper">
    <div class="scroll-wrapper" ref="photoGroup">
      <div class="item item-photo" :class="photoCls" ref="fileItem">
        <qiniu
          ref="qiniu"
          style="visibility: hidden;position: absolute;"
          :token="token"
          :uploadUrl="uploadUrl"></qiniu>
        <div class="photo-icon">
          <input class="input-file"
                 type="file"
                 :multiple="multiple"
                 ref="fileInput"
                 @change="fileChange"
                 accept="image/*"/>
          <div class="text">添加照片</div>
        </div>
      </div>
      <div class="item" v-for="(photo,index) in photos" ref="photoItem" @click="choseItem(index)">
        <i @click.stop="deletePhoto(index)" class="close-icon"></i>
        <div v-if="photo.title" class="title">主图</div>
      </div>
    </div>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
  import BScroll from 'better-scroll';
  import EXIF from 'exif-js';
  import Qiniu from 'base/qiniu/qiniu';
  import Toast from 'base/toast/toast';
  import {getQiniuToken} from 'api/general';
  import {getImgData} from 'common/js/util';

  export default {
    props: {
      photos: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        token: '',
        currentItem: null,
        text: ''
      };
    },
    created() {
      this.multiple = false;
      this.uploadUrl = 'http://up-z0.qiniu.com';
      this.getQiniuToken();
    },
    computed: {
      photoCls() {
        return this.photos.length ? '' : 'no-photo';
      }
    },
    methods: {
      getQiniuToken() {
        return getQiniuToken().then((data) => {
          this.token = data.uploadToken;
        });
      },
      _setScrollWidth() {
        let width = 0;
        let cates = this.$refs.cate;
        for(let i = 0; i < this.categorys.length; i++) {
          width += cates[i].clientWidth;
        }
        this.$refs.categoryGroup.style.width = width + 1 + 'px';
        if (this.scroll) {
          setTimeout(() => {
            this.scroll.refresh();
          }, 20);
        }
      },
      _initScroll() {
        this.scroll = new BScroll(this.$refs.scrollWrapper, {
          scrollX: true,
          scrollY: false,
          click: true
        });
      },
      fileChange(e) {
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        files = Array.prototype.slice.call(files, 0, 1);
        let file = files[0];
        let orientation;
        let self = this;
        EXIF.getData(file, function() {
          orientation = EXIF.getTag(this, 'Orientation');
        });
        let reader = new FileReader();
        reader.onload = function(e) {
          getImgData(file.type, this.result, orientation, function(data) {
            let item = {
              preview: data,
              ok: false,
              type: file.type
            };
            self.currentItem = item;
            self.photos.push(item);
//            self.$refs.clipAvatar.show();
            self.$refs.fileInput.value = null;
          });
        };
        reader.readAsDataURL(file);
      },
      uploadPhoto(base64) {
        this.currentItem.preview = base64;
        this.$refs.qiniu.uploadByBase64(base64).then((data) => {
          console.log(data.body.key);
        }).catch((err) => {
          this.onUploadError(err);
        });
      },
      /**
       * 处理图片上传错误事件
       * @param error 错误信息
       */
      onUploadError(error) {
        this.text = error.body && error.body.error || `${error.message}:10M` || '图片上传出错';
        this.$refs.toast.show();
      }
    },
    watch: {
      photos() {
        setTimeout(() => {
          this._setScrollWidth();
        }, 20);
      }
    },
    components: {
      Qiniu,
      Toast
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .photo-scroll-wrapper {
    height: 2.14rem;
    padding: 0.3rem;
    background-color: #fff;

    .scroll-wrapper {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      color: #fff;
      background: #fff;

      .item {
        position: relative;
        float: left;
        text-align: center;
        height: 1.55rem;
        width: 1.56rem;

        &+item {
          margin-left: 0.2rem;
        }

        &.item-photo {
          background-color: #f3f4f8;

          .photo-icon {
            height: 1.55rem;
            background-repeat: no-repeat;
            background-size: 0.66rem;
            background-position: 50% 0.3rem;
            @include bg-image('photo');
            font-size: 0;

            .text {
              padding-top: 1.1rem;
              font-size: $font-size-small-s;
              color: $color-text;
            }

            .input-file {
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              opacity: 0;
            }
          }

          &.no-photo {
            width: 100%;
            background-color: #fff;

            .photo-icon {
              background-repeat: no-repeat;
              background-size: 0.9rem;
              background-position: 50% 0.12rem;
              @include bg-image('photo');
              font-size: 0;

              .text {
                padding-top: 1.14rem;
                font-size: $font-size-medium;
                color: #484848;
              }
            }
          }
        }

        .close-icon {
          position: absolute;
          top: 0;
          right: 0;
          width: 0.4rem;
          height: 0.4rem;
          background-repeat: no-repeat;
          background-size: 0.22rem;
          background-position: center;
          @include bg-image('delete');
        }

        .title {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0.4rem;
          font-size: 0.22rem;
          background-color: rgba(0, 0, 255, 0.6);
        }
      }
    }
  }
</style>
