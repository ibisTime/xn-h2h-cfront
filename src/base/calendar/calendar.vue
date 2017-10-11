<template>
  <div id="calendar">
    <!-- 年份 月份 -->
    <div class="month">
        <ul>
            <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
            <!-- <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li> -->
            <li class="year-month">
                <span class="choose-year">{{ currentYear }} 年</span>
                <span class="choose-month">{{ currentMonth}} 月</span>
            </li>
            <!-- <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li> -->
        </ul>
    </div>
    <div class="weekPannel">
      <ul class="weekdays">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
      <!-- 日期 -->
      <div class="dayPanel">
        <ul class="days">
        <!-- 核心 v-for循环 每一次循环用<li>标签创建一天 -->
        <li  v-for="dayobject in days">
          <!--本月-->
          <!--如果不是本月  改变类名加灰色-->
          <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
          <!--如果是本月  还需要判断是不是这一天-->
          <span v-else>
        <!--今天  同年同月同日-->
            <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active"><i>{{ dayobject.day.getDate() }}</i></span>
            <span v-else>{{ dayobject.day.getDate() }}</span>
          </span>
        </li>
      </ul>         
      </div>     
    </div>
    <!-- 星期 -->
    
</div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      currentDay: 1,
      currentMonth: 1,
      currentYear: 1970,
      currentWeek: 1,
      days: [],
      dayobject: {},
      now: '',
      time: '',
      str: '',
      d: ''
    };
  },
  created: function() {  // 在vue初始化时调用
    this.initData(null);
  },
  methods: {
    initData: function(cur) {
      if (cur) {
        this.time = new Date(cur);
      } else {
        this.now = new Date();
        this.d = new Date(this.formatDate(this.now.getFullYear(), this.now.getMonth(), 1));
        this.d.setDate(35);
        this.time = new Date(this.formatDate(this.d.getFullYear(), this.d.getMonth() + 1, 1));
        // console.log(time);
      }
      this.currentDay = this.time.getDate();
      this.currentYear = this.time.getFullYear();
      this.currentMonth = this.time.getMonth() + 1;
      this.currentWeek = this.time.getDay(); // 1...6,0
      if (this.currentWeek === 0) {
        this.currentWeek = 7;
      }
      this.str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay);
      this.days.length = 0;

      for (let i = 0; i <= 34; i++) {
        this.d = new Date(this.str);
        this.d.setDate(this.d.getDate() + i);
        this.dayobject.day = this.d;
        this.days.push({
          day: this.dayobject.day
        });
      }
    },
    // 返回 类似 2016-01-02 格式的字符串
    formatDate: function(year, month, day) {
      var y = year;
      var m = month;
      if(m < 10) m = '0' + m;
      var d = day;
      if(d < 10) d = '0' + d;
      return y + '-' + m + '-' + d;
    }
  }
};
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  #calendar{
    margin: 0.3rem;
    text-align: center;
    font-size: $font-size-medium;
  
    .weekPannel{
      padding: 0.28rem;
      .weekdays{  
      width: 100%;
      height: 0.42rem;
      line-height: 0.42rem;
      padding: 0 0.26rem;
      background-color: #F2F2F2;
      border-radius: 0.21rem;
        li{
          float: left;
          margin-right: 0.64rem;
          &:last-child{
            margin-right: 0;
          }
        }
      }
      .dayPanel{
        margin-top: 0.3rem;
        .days{
          width: 100%;
          height: 5rem;
          li{
            float: left;
            width: 0.7rem;
            height: 1rem;
            padding: 0.4rem;
            margin-right: 0.1rem;
            span{
              text-align: center;
            }        
            i{
              position: relative;
              top: 0.2rem;
              left: -0.05rem;
              text-align: center;
              font-style:normal;
              padding: 0.2rem;
              width: 2rem;
              height: 2rem;
              border: 0.02rem solid #48b0fb;
              border-radius: 50%;              
            }
            .other-month{
              color: #CED1C6;
            }
            .active{
              position: relative;
              top:-0.36rem;;
              left: -0.4rem;
              display: inline-block;
              height: 1rem;
              width: 1rem;
              margin: 0.1rem;
              background-repeat: no-repeat;
              background-position: 0.6rem 0;
              background-size: 0.3rem;             
              @include bg-image('tick');
            }
          }          
        }                     
      }    
    }
  }
</style>
