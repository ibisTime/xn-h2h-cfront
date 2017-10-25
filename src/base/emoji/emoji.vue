<template>
  <div class="emoji"  v-show="showFlag">
    <scroll ref="scroll" :pullUpLoad="pullUpLoad">
      <ul class="emoji-container" @click.stop>
        <li style="padding: 0">
          <a
            href="javascript:;"
            v-for="(emoji, index) in emojiData"
            :key="index" @click="selectItem(emoji[0])">
             <img :src="emoji[1]">
          </a>
        </li>
      </ul>
    </scroll>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';

export default {
  name: 'emoji',
  data () {
    return {
      showFlag: false,
      emojiData: webim.Emotions,
      activeIndex: 0
    };
  },
  created() {
    this.pullUpLoad = null;
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    changeActive (index) {
      this.activeIndex = index;
    },
    selectItem (emoji) {
      this.$emit('select', emoji);
    }
  },
  components: {
    Scroll
  }
};
</script>

<style lang='scss' scoped>
@import './emoji.scss';
.emoji {
  position: relative;
  left: 0.4rem;
  width: 90%;
  bottom: 0.6rem;
  background: #fff;
  z-index: 10;
  padding: 10px;
  border: 1px solid #eee;
  .scroll-content{
    height: 2.8rem;
  }
  .emoji-controller {
    height: 0.72rem;
    overflow: hidden;
    margin-bottom: 0;
    li {
      float: left;
      width: 1.2rem;
      font-size: 0.24rem;
      line-height: 0.72rem;
      cursor: pointer;
      text-align: center;
      position: relative;
      &.active::after{
        content: '';
        width: 100%;
        height: 1px;
        background: #0689dd;
        left: 0;
        bottom: 4px;
        position: absolute;
      }
    }
  }
  .emoji-container {
    /*height: 2.8rem;*/
    width: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    position: relative;
    li {
      width: 100%;
      font-size: 0;
      padding: 0.1rem;
      /*margin-left: 0.15rem;*/
      a {
        float: left;
        overflow: hidden;
        height: 0.7rem;
        transition: all ease-out .2s;
        border-radius: 4px;
        padding: 0.1rem;
        &:hover {
          background-color: #d8d8d8;
          border-color: #d8d8d8;
        }
        span {
          width: 0.54rem;
          height: 0.5rem;
          display: inline-block;
          border: 1px solid transparent;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
