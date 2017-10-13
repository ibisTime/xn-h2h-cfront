import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 首页
const Home = () => import('components/home/home');
// 分享
const Recommend = () => import('components/recommend/recommend');
// 推荐历史
const Children = () => import('components/children/children');
// 签到
const Sign = () => import('components/sign/sign');
// 交易圈子
const TradeCircle = () => import('components/trade-circle/trade-circle');

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

// 消息
const Message = () => import('components/message/message');
// 聊天
const Chat = () => import('components/message-chat/message-chat');

// 我的
const User = () => import('components/user/user');
// 设置
const Setting = () => import('components/setting/setting');
// 关于我们
const Aboutus = () => import('components/aboutus/aboutus');
// 修改昵称
const Nickname = () => import('components/nickname/nickname');
// 绑定手机号
const BindMobile = () => import('components/bind-mobile/bind-mobile');
// 修改手机号
const ChangeMobile = () => import('components/change-mobile/change-mobile');
// 设置交易密码
const TradePwd = () => import('components/trade-pwd/trade-pwd');
// 设置生日
const SetBirthday = () => import('components/set-birthday/set-birthday');
// 银行卡列表
const BankCard = () => import('components/bankcard/bankcard');
// 新增、修改银行卡
const BankCardAddEdit = () => import('components/bankcard-addedit/bankcard-addedit');
// 地址列表
const AddressList = () => import('components/address-list/address-list');
// 新增修改地址
const AddressAddEdit = () => import('components/address-add-edit/address-add-edit');
// 系统消息
const Notice = () => import('components/notice/notice');
// 账户
const Account = () => import('components/account/account');
// 账户流水
const CnyFlow = () => import('components/cny-flow/cny-flow');
// 积分流水
const JfFlow = () => import('components/jf-flow/jf-flow');
// 充值
const Recharge = () => import('components/recharge/recharge');
// 提现
const Withdraw = () => import('components/withdraw/withdraw');

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
        },
        {
          path: 'setting',
          component: Setting,
          children: [
            {
              path: 'aboutus',
              component: Aboutus
            },
            {
              path: 'nickname',
              component: Nickname
            },
            {
              path: 'bind-mobile',
              component: BindMobile
            },
            {
              path: 'change-mobile',
              component: ChangeMobile
            },
            {
              path: 'set-tradepwd',
              component: TradePwd,
              children: [
                {
                  path: 'bind-mobile',
                  component: BindMobile
                }
              ]
            },
            {
              path: 'set-birthday',
              component: SetBirthday
            },
            {
              path: 'bankcard',
              component: BankCard,
              children: [
                {
                  path: 'add',
                  component: BankCardAddEdit
                },
                {
                  path: ':id',
                  component: BankCardAddEdit
                }
              ]
            },
            {
              path: 'address',
              component: AddressList,
              children: [
                {
                  path: 'add',
                  component: AddressAddEdit
                },
                {
                  path: ':id',
                  component: AddressAddEdit
                }
              ]
            },
            {
              path: 'notice',
              component: Notice
            }
          ]
        },
        {
          path: 'account',
          component: Account,
          children: [
            {
              path: 'cny-flow',
              component: CnyFlow
            },
            {
              path: 'recharge',
              component: Recharge
            },
            {
              path: 'withdraw',
              component: Withdraw,
              children: [
                {
                  path: 'add',
                  component: BankCardAddEdit
                }
              ]
            },
            {
              path: 'set-tradepwd',
              component: TradePwd,
              children: [
                {
                  path: 'bind-mobile',
                  component: BindMobile
                }
              ]
            }
          ]
        },
        {
          path: 'jf-flow',
          component: JfFlow
        }
      ]
    },
    {
      path: '/message',
      component: Message,
      children: [
        {
          path: ':id',
          component: Chat
        }
      ]
    }
  ]
});
