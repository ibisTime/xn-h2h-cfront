<template>
  <div class="list-wrapper" >
    <scroll :data="list" :hasMore="hasMore">
      <div v-for="item in list" class="list-item" @click ="goChat(item.userId)" >
        <div class="headPic">
          <img :src="item.icon"/>
        </div>
        <div class="content">
          <div class="top">{{item.fromAccountNick}}<div class="time">{{getDate(item.time)}}</div></div>
          <span v-html="item.text"></span>
        </div>
        <div class="badge-wrapper"><badge v-show="item.unRead" :text="item.unRead"></badge></div>
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
  import Badge from 'base/badge/badge';
  import {mapMutations, mapGetters} from 'vuex';
  import {SET_CHAT_LIST, SET_CHAT_USERID} from 'store/mutation-types';
  import {getUserId, formatChatDate, setTitle} from 'common/js/util';
  import {getProfilePortrait} from 'common/js/message';

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
      this.setTitle();
    },
    updated() {
      this.setTitle();
    },
    computed: {
      list() {
        let mine = getUserId();
        let chatData = this.chatData[mine];
        getProfilePortrait(mine);
        if (chatData) {
          return chatData.users.map((userId) => {
            let list = chatData[userId].list;
            let msg = list[list.length - 1];
            let nickname = '';
            if (mine !== msg.fromAccount) {
              nickname = msg.fromAccountNick;
            } else if (this.userMap[userId]) {
              nickname = this.userMap[userId].nickname;
            } else {
              nickname = userId;
            }
            return {
              userId,
              text: this.getContent(msg),
              icon: msg.photo,
              fromAccountNick: nickname,
              unRead: chatData[userId].unRead === 0 ? '' : chatData[userId].unRead + '',
              time: msg.time
            };
          });
        }
        return [];
      },
      ...mapGetters([
        'chatData',
        'userMap'
      ])
    },
    methods: {
      setTitle() {
        if (this.$route.path === '/message') {
          setTitle('消息');
        }
      },
      getContent(item) {
        let html = '';
        item.elems.forEach((msg) => {
          if(msg.type === 'TIMTextElem') {
            html += `<i>${msg.content.text}</i>`;
          } else if (msg.type === 'TIMFaceElem') {
            if (webim.Emotions[msg.content.index] === undefined) {
              html += `<img src="${webim.Emotions[0][1]}"/>`;
            } else {
              html += `<img src="${webim.Emotions[msg.content.index][1]}"/>`;
            }
          } else if (msg.type === 'TIMImageElem') {
            html += '[图片]';
          }
        });
        return html;
      },
      goChat(id) {
        this.$router.push(this.$route.path + '/' + id);
      },
      getDate(timestamp) {
        return formatChatDate(timestamp * 1000);
      },
      ...mapMutations({
        setCurChatList: SET_CHAT_LIST,
        setCurChatUserId: SET_CHAT_USERID
      })
    },
    components: {
      Scroll,
      Badge
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .list-wrapper {
     width: 100%;

    .list-item{
      position: relative;
      display: flex;
      align-items: flex-start;
      padding: 0.16rem 0.3rem;
      height: 1.36rem;
      background: #fff;

      .headPic{
        width: 1rem;
        height: 1rem;
        flex: 0 0 1rem;
        border-radius: 50%;
        overflow: hidden;
        font-size: 0;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .badge-wrapper {
        position: absolute;
        top: 0.1rem;
        left: 1rem;
        font-size: 0;
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 0.2rem;
        height: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: $font-size-large-ss;

        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        span {
          display: block;
          padding-top: 0.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: $font-size-medium-x;
          color: #999;

          img {
            width: 0.32rem;
            vertical-align: bottom;
          }
        }
      }

      .time {
        white-space: nowrap;
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
