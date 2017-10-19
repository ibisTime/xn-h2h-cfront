<template>
  <div class="photo-scroll-wrapper" ref="scrollWrapper">
    <div class="scroll-wrapper" ref="photoGroup">
      <div class="item item-photo" :class="photoCls" ref="fileItem">
        <div class="inner">
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
      </div>
      <div class="item" v-for="(photo,index) in photos" ref="photoItem" @click="choseItem(index)">
        <div class="inner" :style="getBg(photo)">
          <i @click.stop="deletePhoto(index)" class="close-icon"></i>
          <loading v-if="!photo.ok" title="" class="photo-loading"></loading>
          <div v-if="index===0" class="title">主图</div>
        </div>
      </div>
    </div>
    <toast ref="toast" :text="text"></toast>
    <photo-edit ref="photoEdit"
                :url="curUrl"
                :imgKey="curKey"
                :type="curType"
                @beMain="beMainPhoto"
                @updateImg="updateImg"
                @deleteImg="deleteImg"></photo-edit>
  </div>
</template>
<script>
  import BScroll from 'better-scroll';
  import EXIF from 'exif-js';
  import Qiniu from 'base/qiniu/qiniu';
  import Toast from 'base/toast/toast';
  import Loading from 'base/loading/loading';
  import {getImgData, formatImg} from 'common/js/util';
  import PhotoEdit from 'components/photo-edit/photo-edit';

  const MAX_LENGTH = 12;

  export default {
    props: {
      photos: {
        type: Array,
        default: []
      },
      token: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        currentItem: null,
        text: ''
      };
    },
    created() {
      this.multiple = true;
      this.uploadUrl = 'http://up-z0.qiniu.com';
    },
    mounted() {
      this.$nextTick(() => {
        this._initScroll();
      });
    },
    computed: {
      photoCls() {
        return this.photos.length ? '' : 'no-photo';
      },
      curUrl() {
        return this.currentItem ? this.currentItem.preview : '';
      },
      curKey() {
        return this.currentItem ? this.currentItem.key : '';
      },
      curType() {
        return this.currentItem ? this.currentItem.type : '';
      }
    },
    methods: {
      _setScrollWidth() {
        let width = 0;
        let cates = this.$refs.photoItem;
        for(let i = 0; i < this.photos.length; i++) {
          width += cates[i].clientWidth;
        }
        width += this.$refs.fileItem.clientWidth;
        this.$refs.photoGroup.style.width = width + 1 + 'px';
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
      /**
       * 选中要操作的图片
       * */
      choseItem(index) {
        let item = this.photos[index];
        if (!item.ok) {
          this.text = '图片还未上传完成';
          this.$refs.toast.show();
          return;
        }
        this.currentItem = item;
        this.$refs.photoEdit.show();
      },
      /**
       * 设置为封面
       * */
      beMainPhoto(key) {
        let index = this.photos.findIndex((photo) => {
          return photo.key === key;
        });
        let item = this.photos[index];
        this.photos.splice(index, 1);
        this.photos.unshift(item);
      },
      /**
       * 更新裁剪后的图片
       * */
      updateImg(base64, key) {
        let index = this.photos.findIndex((photo) => {
          return photo.key === key;
        });
        let item = this.photos[index];
        item.ok = false;
        item.preview = base64;
        this.photos.splice(index, 1, item);
        this.currentItem = item;
        this.uploadPhoto(base64, key).then(() => {
          // 再次获取当前图片的位置，防止在上传过程中有其它图片被删除，导致下标改变
          index = this.photos.findIndex((photo) => {
            return photo.key === key;
          });
          item = this.photos[index];
          item.ok = true;
          this.photos.splice(index, 1, item);
          this.currentItem = item;
        });
      },
      /**
       * 在弹出的图片操作页面中删除图片
       * */
      deleteImg(key) {
        let index = this.photos.findIndex((photo) => {
          return photo.key === key;
        });
        this.deletePhoto(index);
      },
      /**
       * 从相册中选择图片
       * */
      fileChange(e) {
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        if (this.photos.length + files.length > MAX_LENGTH) {
          this.text = '图片最多上传12张';
          this.$refs.toast.show();
          files = Array.prototype.slice.call(files, 0, MAX_LENGTH);
        }
        let self = this;
        let len = files.length;
        for (let i = 0; i < files.length; i++) {
          (function (i) {
            let file = files[i];
            let orientation;

            EXIF.getData(file, function() {
              orientation = EXIF.getTag(this, 'Orientation');
            });
            let reader = new FileReader();
            reader.onload = function(e) {
              getImgData(file.type, this.result, orientation, function(data) {
                let _url = URL.createObjectURL(file);
                let item = {
                  preview: data,
                  ok: false,
                  type: file.type,
                  key: _url.split('/').pop() + '.' + file.name.split('.').pop()
                };
                self.photos.push(item);
                self.uploadPhoto(data, item.key).then(() => {
                  item = {
                    ...item,
                    ok: true
                  };
                  self.updatePhotos(item);
                }).catch((err) => {
                  self.onUploadError(err);
                });
                if (i + 1 === len) {
                  self.$refs.fileInput.value = null;
                }
              });
            };
            reader.readAsDataURL(file);
          })(i);
        }
      },
      /**
       * 图片上传完成后更新photos
       * */
      updatePhotos(item) {
        for (let i = 0; i < this.photos.length; i++) {
          if (this.photos[i].key === item.key) {
            this.photos.splice(i, 1, item);
            break;
          }
        }
      },
      deletePhoto(index) {
        this.photos.splice(index, 1);
      },
      uploadPhoto(base64, key) {
        return this.$refs.qiniu.uploadByBase64(base64, key);
      },
      /**
       * 处理图片上传错误事件
       * @param error 错误信息
       */
      onUploadError(error) {
        this.text = error.body && error.body.error || `${error.message}:10M` || '图片上传出错';
        this.$refs.toast.show();
      },
      getBg(photo) {
        let url = photo.preview || formatImg(photo.key);
        return {
          backgroundImage: `url(${url})`
        };
      }
    },
    watch: {
      photos(newPhotos) {
        if (newPhotos.length) {
          setTimeout(() => {
            this._setScrollWidth();
          }, 20);
        } else {
          this.$refs.photoGroup.style.width = '100%';
        }
      }
    },
    components: {
      Qiniu,
      Toast,
      Loading,
      PhotoEdit
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .photo-scroll-wrapper {
    height: 2.14rem;
    padding: 0.3rem 0;
    overflow: hidden;
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
        width: 1.75rem;
        padding-left: 0.2rem;

        .inner {
          position: relative;
          width: 100%;
          height: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;

          .photo-loading {
            position: absolute;
            top: 50%;
            margin-top: -0.24rem;
          }
        }

        &.item:last-child {
          width: 2.05rem;
          padding-right: 0.3rem;
        }

        &.item-photo {
          width: 1.85rem;
          padding-left: 0.3rem;

          .inner {
            background-color: #f3f4f8;
          }

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

            .inner {
              background: #fff;
            }

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
          background-size: contain;
          background-position: center;
          @include bg-image('delete');
        }

        .title {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0.4rem;
          line-height: 0.4rem;
          font-size: 0.22rem;
          background-color: rgba(72, 176, 251, 0.6);
        }
      }
    }
  }
</style>
