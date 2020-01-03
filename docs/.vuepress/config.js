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
  // 顶部导航栏
  themeConfig: {
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
          title: "📔",
          // 子菜单
          children: [
            ["/FAQ/Node/require", "🏀require基操"],
            ["/FAQ/Node/Koa", "⚽️初级Koa"],
          ]
        },
        {
          title: "📕",
          children: [
            ["/FAQ/ES/promise", "🚗promise"],
          ]
        },
        {
          title: "📘",
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
          title: "📗",
          children: [
            ["/FAQ/Vue/Cli", "🔨vue-cli"],
            ["/FAQ/Vue/observer", "🔧MvvM"],
            ["/FAQ/Vue/Communication", "🛠️通信方式"]
          ]
        },
        {
          title: '📒',
          children: [
            ["/FAQ/webpack/webpack", "☘初始webpack"],
          ]
        },
        {
          title: "📙",
          children: [
            ["/FAQ/Work/TSC", "🏋️‍♂️TypeScript"],
            ["/FAQ/Work/cicd", "🚴持续集成部署（ci/cd）"],
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