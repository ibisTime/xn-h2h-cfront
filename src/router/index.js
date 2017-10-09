import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 首页
const Home = () => import('components/home/home');
// 通知
const Notice = () => import('components/notice/notice');
// 分享
const Recommend = () => import('components/recommend/recommend');
// 签到
const Sign = () => import('components/sign/sign');

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
          component: Recommend
        },
        {
          path: 'sign',
          component: Sign
        }
      ]
    },
    {
      path: '/notice',
      component: Notice
    }
  ]
});
