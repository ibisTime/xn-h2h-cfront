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
const Cate = () => import('components/category/category');
// 所有大类
const MajorCategories = () => import('components/major-categories/major-categories');
// 大类商品列表
const CategoryList = () => import('components/category-list/category-list');
// 搜索
const Search = () => import('components/search/search');
// 商品详情
const Detail = () => import('components/detail/detail');

// 发布
const Publish = () => import('components/publish/publish');
// 商品分类
const PublishCategories = () => import('components/publish-categories/publish-categories');
// 交易圈子
const TradeCircle = () => import('components/trade-circle/trade-circle');

// 我的
const User = () => import('components/user/user');

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
              path: 'category',
              component: PublishCategories
            }
          ]
        },
        {
          path: 'trade',
          component: TradeCircle
        },
        {
          path: ':code',
          component: Detail
        }
      ]
    },
    {
      path: '/category',
      component: Cate,
      children: [
        {
          path: 'publish',
          component: Publish,
          children: [
            {
              path: 'category',
              component: PublishCategories
            }
          ]
        },
        {
          path: 'categories',
          component: MajorCategories
        },
        {
          path: 'search',
          component: Search,
          children: [
            {
              path: ':code',
              component: Detail
            }
          ]
        },
        {
          path: 'list',
          component: CategoryList,
          children: [
            {
              path: 'search',
              component: Search,
              children: [
                {
                  path: ':code',
                  component: Detail
                }
              ]
            },
            {
              path: ':code',
              component: Detail
            }
          ]
        },
        {
          path: ':code',
          component: Detail
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
    },
    {
      path: '/user',
      component: User,
      children: [
        {
          path: 'publish',
          component: Publish,
          children: [
            {
              path: 'category',
              component: PublishCategories
            }
          ]
        }
      ]
    }
  ]
});
