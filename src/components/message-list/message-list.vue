<template>
  <div class="list-wrapper" >
    <scroll :data="list" :hasMore="hasMore">
      <div v-for="item in list" class="list-item" @click ="goChat(item.userId)" >
        <div class="headPic"><img :src="item.icon"/></div>
        <div class="content">
          <p>{{item.fromAccountNick}}</p>
          <span v-html="item.text"></span>
        </div>
        <div class="time">下午4:40</div>
      </div>
    </scroll>
    <div v-show="!list.length && !hasMore" class="no-result">
      <div class="no-result-icon"></div>
      <p class="no-result-text">{{title}}</p>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import {mapMutations, mapGetters} from 'vuex';
  import {SET_CHAT_LIST, SET_CHAT_USERID} from 'store/mutation-types';
  import {getUserId} from 'common/js/util';

  export default {
    data () {
      return {
        title: '暂无结果',
        start: 1,
        limit: 20
      };
    },
    created() {
      this.hasMore = false;
    },
    computed: {
      list() {
        let chatData = this.chatData[getUserId()];
        if (chatData) {
          return chatData.users.map((userId) => {
            let msg = chatData[userId][chatData[userId].length - 1];
            return {
              userId,
              text: this.getContent(msg),
              icon: msg.icon,
              fromAccountNick: msg.fromAccountNick
            };
          });
        }
        return [];
      },
      ...mapGetters([
        'chatData'
      ])
    },
    methods: {
      getContent(item) {
        let html = '';
        item.elems.forEach((msg) => {
          if(msg.type === 'TIMTextElem') {
            html += `<i>${msg.content.text}</i>`;
          } else if (msg.type === 'TIMFaceElem') {
            html += `<img src="${webim.Emotions[msg.content.index][1]}"/>`;
          } else if (msg.type === 'TIMImageElem') {
            html += '[图片]';
          }
        });
        return html;
      },
      goChat(id) {
        this.$router.push(this.$route.path + '/' + id);
      },
      ...mapMutations({
        setCurChatList: SET_CHAT_LIST,
        setCurChatUserId: SET_CHAT_USERID
      })
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
@import "~common/scss/mixin";
@import "~common/scss/variable";

.list-wrapper {
   width: 100%;

  .list-item{
    display: flex;
    width: 100%;
    height: 1.36rem;
    background: #fff;

    .headPic{
      margin:  0.16rem 0.2rem 0.16rem 0.3rem;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .content{
      flex: 2;
      margin: 0.3rem 0;
      font-size: $font-size-large-ss;
      span{
        display: block;
        margin-top: 0.2rem;
        font-size: $font-size-medium;
        color: #999;
      }
    }

    .time{
      margin-right: 0.3rem;
      margin-top: 0.3rem;
      font-size: $font-size-small;
      color: #999;
    }
  }

  .no-result {
    text-align: center;
    margin-top: 1.4rem;

    .no-result-icon {
      width: 1.72rem;
      height: 1.8rem;
      margin: 0 auto;
      @include bg-image('noResult');
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
    .no-result-text {
      margin-top: 0.2rem;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }

}
</style>
