<template>
  <div class="sign-wrapper">
  	<div class="jf-wrapper">
        <div class="signRule" @click="showRule">签到规则</div>
        <div class="signIntegral">
          <div class="integralContent">
            <h3>{{mark}}</h3>
            <h4>{{jfOwn}}</h4>
            <p>{{jfText}}</p>
          </div>
        </div>
        <div class="signTip">连续签到29天可获得额外奖励</div>
      </div>
      <div class="date-wrapper">  
        <calendar lang="zh" :dates="signDateList"></calendar>     
      </div>
      <sign-mask ref="mask" :text="text" :isHtml="isHtml"></sign-mask>
  </div>
</template>
<script>
  import calendar from 'base/calendar/calendar';
  import SignMask from 'components/sign-mask/sign-mask';
  import {getUserSystemConfig} from 'api/general';
  import {sign, signNum} from 'api/user';
  import {getAccount} from 'api/account';
  import {formatAmount, formatDate} from 'common/js/util';

  // var activeClass = [
  //   {
  //     cssClass: ['active']
  //   }
  // ];
  const LIMIT = 30;

  export default {
    data () {
      return {
        activeClass: '',
        text: '',
        mark: '',
        jfOwn: '',
        jfText: '',
        start: 1,
        signDateList: []
      };
    },
    created() {
      this.isHtml = true;
      this.getInitData();
    },
    methods: {
      getInitData() {
        this.signIn();
        this.getJF();
        this.getSignDate();
      },
      signIn () {
        sign().then((data) => {
          if (data.todaySign === true) {
            this.mark = '签到成功';
          }
        }).catch(() => {
          this.mark = '签到失败';
        });
      },
      getJF () {
        getAccount().then((data) => {
          this.jfOwn = Math.floor(formatAmount(data[1].amount));
          this.jfText = '已获积分';
        });
      },
      getSignDate () {
        signNum(this.start, LIMIT).then((data) => {
          data.list.forEach((item, index) => {
            this.signDateList.push(formatDate(item.signDatetime, 'yyyy-MM-dd'));
          });
        });
      },
      showRule () {
        getUserSystemConfig('cardsTradition').then((data) => {
          this.text = data.cvalue;
        }).catch(() => {
          this.text = '暂无';
        });
        this.$refs.mask.show();
      }
    },
    components: {
      calendar,
      SignMask
    }
  };
</script>
<style lang="scss" scoped>
@import "~common/scss/mixin";
@import "~common/scss/variable";

.sign-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;

	.jf-wrapper{
		width: 100%;
    height: 4.2rem;		
		background-size: 100% 100%;
  	@include bg-image('background');
  	color: #fff;
  	font-size: $font-size-medium;

  	.signRule{
  		position: absolute;
  		top: 0.4rem;
  		right: 0.3rem; 
  	}

  	.signIntegral{
  		position: absolute;
  		top: 0.4rem;
  		left: 37%;
  		width: 2.2rem;
  		height: 2.2rem;
  		border-radius: 50%;
  		background: #65BDFC;

  		.integralContent{
			position: absolute;
    		top: 0.12rem;
    		left: 0.12rem;
    		width: 1.96rem;
    		height: 1.96rem;
    		border-radius: 50%;
    		background: #fff;
			color: #48b0fb;
			text-align: center;
			h3{
				margin-top: 0.5rem;
				font-size: $font-size-medium;
			}				
			h4{
				margin-top: 0.11rem;
				font-size: $font-size-medium-x;
			}
			p{
				margin-top: 0.11rem;
				font-size: $font-size-medium-s;
			}					    		    				
  		}
  	}

  	.signTip{
		position: absolute;
		top: 3.6rem;
  	bottom: 0.32rem;
  	text-align: center;
  	width: 100%;
  	}		
	}

  .operate-btn{
    border-top: none;
  }

	.date-wrapper{
		border: none;

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
</style>
