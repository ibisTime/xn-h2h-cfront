<template>
  <div class="sign-wrapper">
  	<div class="jf-wrapper">
        <div class="signRule" @click="showRule">签到规则</div>
        <div class="signIntegral">
          <div class="integralContent">
            <h3>签到成功</h3>
            <h4>356</h4>
            <p>已获积分</p>
          </div>
        </div>
        <div class="signTip">连续签到29天可获得额外奖励</div>
      </div>
      <div class="date-wrapper">  
        <calendar :events="fcEvents"  lang="zh"></calendar>     
      </div>
      <sign-mask ref="mask" :text="text" :isHtml="isHtml"></sign-mask>
  </div>
</template>
<script>
  import calendar from 'base/calendar/calendar';
  import SignMask from 'components/sign-mask/sign-mask';
  import {getPageBizSysConfig} from 'api/general';

  var demoEvents = [
    {
      cssClass: ['family', 'career']
    }
  ];

  export default {
    data () {
      return {
        fcEvents: demoEvents,
        text: ''
      };
    },
    created() {
      this.isAlert = true;
      this.isHtml = true;
    },
    methods: {
      showRule () {
        getPageBizSysConfig(1).then((data) => {
          this.text = `<div>签到规则</div><div>规则内容</div>`;
        }).catch(() => {
          this.text = '暂无';
        });
        this.$refs.mask.show();
      },
      getRules() {
        this.text = `<div>签到规则</div><div>规则内容</div>`;
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

		.full-calendar-body{
				.weeks{
					border: none;
          .week{
            border-right: none;
          }
				}
		}
	}
}  
</style>
