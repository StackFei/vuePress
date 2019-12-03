const pluginConf = require('../../config/pluginConf.js');
const navConf = require('../../config/navConf');

module.exports = {
  title: "守夜人笔记",
  description: "守夜人笔记", // meta 中的描述文字，意义不大，SEO用
  plugins: pluginConf,
  head: [
    ["link", { rel: "icon", href: "/img/favicon.ico" }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  // base: "/StackFei/", // 这是部署到github相关的配置
  markdown: {
    // lineNumbers: true // 代码块显示行号
  },
  theme: 'reco',
  // 顶部导航栏
  themeConfig: {
    huawei: false,
    // 备案号
    // record: '京ICP备17067634号-1',
    // 项目开始时间, 只填写年份
    startYear: '2017',
    author: '彭雲飝',
    // type: 'blog',
    // 密钥
    // keyPage: {
    //   keys: ['123456'],
    //   color: '#42b983', // 登录页动画球的颜色
    //   lineColor: '#42b983' // 登录页动画线的颜色
    // },
    sidebarDepth: 1, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: "最后更新时间", // 文档更新时间：每个文件git最后提交的时间,
    smoothScroll: true, //页面滚动效果。
    // 顶部导航栏
    nav: navConf,
    sidebar: {
      "/FAQ/": [
        //多级菜单形式
        ["/FAQ/", "📚FAQ"],
        {
          // 菜单名
          title: "📔Node",
          // 子菜单
          children: [
            ["/FAQ/Node/Koa", "⚽️初级Koa"],
          ]
        },
        {
          title: "📕Css",
          children: [
            ["/FAQ/Css/css", "🚗Css"],
          ]
        },
        {
          title: "📘React",
          children: [
            ["/FAQ/React/VirtualDom", "🌰VirtualDom"],
            ["/FAQ/React/react-router", "🍑react-router"],
            ["/FAQ/React/context", "🍇context"],
            ["/FAQ/React/react-redux", "🍎react-redux"],
            ["/FAQ/React/react-redux-middleware", "🍍react-redux-middleware"],
            ["/FAQ/React/Hooks", "🍊Hooks"],
          ]
        },
        {
          title: "📗Vue",
          children: [
            ["/FAQ/Vue/Cli", "🔨vue-cli"],
            ["/FAQ/Vue/observer", "🔧MvvM"],
            ["/FAQ/Vue/Communication", "🛠️通信方式"]
          ]
        },
        {
          title: '📒Webpack',
          children: [
            ["/FAQ/webpack/webpack", "☘初始webpack"],
          ]
        },
        {
          title: "📙花里胡哨",
          children: [
            ["/FAQ/Work/TSC", "🏋️‍♂️TypeScript"],
            ["/FAQ/Work/AOP", "🏌️‍♂️AOP面向切片编程"],
            ["/FAQ/Work/WeChat", "⛹️踩坑React系列小程序"],
            ["/FAQ/Work/Work1", "🤾‍♂️前端请求的正确打开方式"],
          ]
        },
      ],
      "/Thought/": [
        ["/Thought/", "✒️"],
      ]
    }
  }
};