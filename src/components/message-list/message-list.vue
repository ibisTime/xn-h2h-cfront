<template>           
  <div class="list-wrapper" >
    <scroll>
      <div class="list-item" @click ="goChat('111')" >
        <div class="headPic">
        </div>
        <div class="content">
          <p>某某某</p>
          <span>hello</span>
        </div>
        <div class="time">下午4:40</div>      
      </div>
    </scroll>
    <div v-show="!messageList.length && !hasMore" class="no-result">
      <div class="no-result-icon"></div>
      <p class="no-result-text">{{title}}</p>
    </div>  
    <router-view></router-view>    
  </div>   
</template>
<script>
  import Scroll from 'base/scroll/scroll';

  export default {
    data () {
      return {
        messageList: 0,
        hasMore: true,
        title: '暂无结果'
      };
    },
    created() {},
    methods: {
      goChat(id) {
        this.$router.push(this.$route.path + '/' + id);
      }
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
   margin-top: 0.2rem;
   
  .list-item{
    display: flex;
    width: 100%;
    height: 1.36rem;
    background: #fff;    
    .headPic{
      margin:  0.16rem 0.2rem 0.16rem 0.3rem;
      width: 1rem;
      height: 1rem;
      @include bg-image('headf');
      background-size: 100%;
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
