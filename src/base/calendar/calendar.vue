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
        <li v-for="dayobject in days">
          <span v-if="isGray(dayobject)">
            <span v-if="dayobject.sign" class="other-month active">{{ dayobject.day.getDate() }}<i></i></span>
            <span v-else class="other-month">{{ dayobject.day.getDate() }}</span>
          </span>
          <span v-else>
            <span v-if="dayobject.sign" class="active">{{ dayobject.day.getDate() }}<i></i></span>
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
    props: {
      dates: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        currentDay: 1,
        currentMonth: 1,
        currentYear: 1970,
        days: []
      };
    },
    created: function() {  // 在vue初始化时调用
      this.initData();
    },
    methods: {
      initData: function() {
        let currentWeek = 1;
        this.d = new Date();
        let day = this.d.getDate();
        this.d.setDate(1);
        this.currentDay = this.d.getDate();
        this.currentYear = this.d.getFullYear();
        this.currentMonth = this.d.getMonth() + 1;
        currentWeek = this.d.getDay(); // 1...6,0
        if (currentWeek === 0) {
          currentWeek = 7;
        }
        this.str = this.d.getTime();

        for (let i = currentWeek; i > 0; i--) {
          let d = new Date(this.str);
          d.setDate(d.getDate() - i);
          this.days.push({
            day: d
          });
        }
        for (let i = 0; i <= 41 - currentWeek; i++) {
          let d = new Date(this.str);
          d.setDate(d.getDate() + i);
          this.days.push({
            day: d,
            sign: false
          });
        }
        this.currentIndex = day + currentWeek - 1;
      },
      isGray(dayobject) {
        return dayobject.day.getMonth() + 1 !== this.currentMonth;
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
    },
    watch: {
      dates(newVal) {
        for (let i = 0; i <= this.currentIndex && i < this.days.length; i++) {
          let day = this.days[i].day;
          let str = this.formatDate(day.getFullYear(), day.getMonth() + 1, day.getDate());
          for (let j = 0; j < newVal.length; j++) {
            if (newVal[j] === str) {
              this.days.splice(i, 1, {
                day,
                sign: true
              });
              break;
            }
          }
        }
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
            width: 0.9rem;
            height: 0.9rem;
            line-height: 0.5rem;
            padding: 0.2rem;
            span{
              display: inline-block;
              width: 100%;
              height: 100%;
              text-align: center;
            }
            i{
              position: absolute;
              top: 0;
              left: 0.5rem;
              display: inline-block;
              width: 0.3rem;
              height: 0.3rem;
              text-align: center;
              font-style:normal;
              background-repeat: no-repeat;
              background-size: 0.3rem;
              @include bg-image('tick');
            }
            .other-month{
              color: #CED1C6;
            }
            .active{
              position: relative;
              top:-0.3rem;;
              left: -0.3rem;
              display: inline-block;
              width: 0.7rem;
              height: 0.7rem;
              margin: 0.2rem;
              padding: 0.1rem;
              border: 0.02rem solid #48b0fb;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
</style>
