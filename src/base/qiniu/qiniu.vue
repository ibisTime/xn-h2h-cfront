<template>
  <div @dragLeave="onDragLeave" @dragOver.prevent="onDragOver" @drop.prevent="onDrop">
    <input class="input-file"
           type="file"
           :multiple="multiple"
           ref="fileInput"
           @click.stop="onClick"
           @change.prevent="onDrop"
           :accept="accept"/>
    <slot></slot>
  </div>
</template>
<script>
  import request from 'superagent-bluebird-promise';
  import {isFunction} from 'common/js/util';

  export default {
    props: {
      accept: {
        type: String,
        default: 'image/*'
      },
      uploadUrl: {
        type: String,
        default: 'http://up-z2.qiniu.com'
      },
      token: {
        type: String,
        default: '',
        required: true
      },
      multiple: {
        type: Boolean,
        default: true
      },
      prefix: {
        type: String,
        default: ''
      },
      maxSize: {
        type: String,
        default: ''
      }
    },
    created() {
      this.isDragActive = false;
    },
    methods: {
      onClick() {
        this.open();
      },
      open() {
        this.$refs.fileInput.value = null;
      },
      onDragLeave() {
        this.isDragActive = false;
      },
      onDragOver(e) {
        e.dataTransfer.dropEffect = 'copy';
        this.isDragActive = true;
      },
      onDrop(e) {
        this.isDragActive = false;
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }

        let maxFiles = this.multiple ? files.length : 1;
        files = Array.prototype.slice.call(files, 0, maxFiles);
        this.$emit('upload', files, e);

        let maxSizeLimit = this._formatMaxSize(this.maxSize || 0);
        for (let i = 0; i < maxFiles; i++) {
          if (maxSizeLimit && files[i].size > maxSizeLimit) {
            console.trace && console.trace(new Error('文件大小错误!'));
            this.$emit('error', {
              coed: 1,
              message: '上传的文件大小超出了限制:' + this.props.maxSize
            });
          } else {
            files[i].preview = URL.createObjectURL(files[i]);
            files[i].request = this.upload(files[i]);
            files[i].uploadPromise = files[i].request.promise();
            files[i].uploadPromise.catch((error) => {
              this.$emit('error', error);
            });
          }
        }
        files = Array.prototype.slice.call(files, 0, maxFiles);
        this.$emit('drop', files, e);
      },
      upload(file) {
        if (!file || file.size === 0) {
          return null;
        }
        let key = file.preview.split('/').pop() + '.' + file.name.split('.').pop();
        if (this.prefix) {
          key = this.prefix + key;
        }
        file.key = key;
        let r = request
          .post(this.uploadUrl)
          .field('key', key)
          .field('token', this.token)
          .field('x:filename', file.name)
          .field('x:size', file.size)
          .attach('file', file, file.name)
          .set('Accept', 'application/json');
        if (isFunction(file.onprogress)) {
          r.on('progress', file.onprogress);
        }
        return r;
      },
      uploadByBase64(base64) {
        base64 = base64.substr(base64.indexOf('base64,') + 7);
        return request.post('http://upload.qiniu.com/putb64/-1')
          .set('Content-Type', 'application/octet-stream')
          .set('Authorization', `UpToken ${this.token}`)
          .send(base64)
          .promise();
      },
      _formatMaxSize(size) {
        size = size.toString().toUpperCase();
        let bsize;
        let m = size.indexOf('M');
        let k = size.indexOf('K');

        if (m > -1) {
          bsize = parseFloat(size.slice(0, m)) * 1024 * 1024;
        } else if (k > -1) {
          bsize = parseFloat(size.slice(0, k)) * 1024;
        } else {
          bsize = parseFloat(size);
        }
        return Math.abs(bsize);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .input-file {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
    z-index: 1;
  }
</style>
