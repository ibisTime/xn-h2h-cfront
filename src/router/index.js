import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 首页
const Home = () => import('components/home/home');
// 通知
const Notice = () => import('components/notice/notice');
// 分享
const Recommend = () => import('components/recommend/recommend');
// 推荐历史
const Children = () => import('components/children/children');
// 签到
const Sign = () => import('components/sign/sign');

// 分类
const Cate = () => import('components/cate/cate');

// 发布
const Publish = () => import('components/publish/publish');
// 商品分类
const PublishCates = () => import('components/publish-cates/publish-cates');
// 交易圈子
const TradeCircle = () => import('components/trade-circle/trade-circle');

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: 'recommend',
          component: Recommend,
          children: [
            {
              path: 'history',
              component: Children
            }
          ]
        },
        {
          path: 'sign',
          component: Sign
        },
        {
          path: 'publish',
          component: Publish,
          children: [
            {
              path: 'cate',
              component: PublishCates
            }
          ]
        },
        {
          path: 'trade',
          component: TradeCircle
        }
      ]
    },
    {
      path: '/cate',
      component: Cate,
      children: [
        {
          path: 'publish',
          component: Publish,
          children: [
            {
              path: 'cate',
              component: PublishCates
            }
          ]
        }
      ]
    },
    {
      path: '/publish',
      component: Publish
    },
    {
      path: '/notice',
      component: Notice
    }
  ]
});
