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
    // toc: { includeLevel: [2, 3] },  // MarkDown 文档中，用 [[toc]] 标签建立目录时，收集哪几级标题
    extractHeaders: ['h2', 'h3'],   // MarkDown 文档中，对于哪几级标题建立搜索索引
  },
  // 顶部导航栏
  themeConfig: {
    sidebarDepth: 1, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    // lastUpdated: "最后更新时间", // 文档更新时间：每个文件git最后提交的时间,
    smoothScroll: true, //页面滚动效果。
    editLinks: true, // 启用快速编辑的链接，显示在文章末尾的左下角
    // 自定义编辑链接的文本。默认是 "Edit this page"
    editLinkText: '帮助我们改进页面内容！',
    // 顶部导航栏
    nav: navConf,
    sidebar: {
      "/FAQ/": [
        //多级菜单形式
        ["/FAQ/", "📚JS手残"],
        {
          title: "花里胡哨必备点",
          collapsable: false,
          children: [
            ["/FAQ/ES/clone", "🚙浅析克隆"],
            ["/FAQ/ES/promise", "🚗promise"],
            ["/FAQ/ES/react-window", "🚕长列表"],
            ["/FAQ/ES/simple-webpack", "🚌webpack配置篇"],
            ["/FAQ/ES/defineProperty", "🏎defineProperty"],
          ]
        },
        {
          title: "React中的一些小心得",
          collapsable: false,
          children: [
            ["/FAQ/React/VirtualDom", "🌰简单的虚拟Dom"],
            ["/FAQ/React/react-router", "🍑router"],
            ["/FAQ/React/context", "🍇上下文"],
            ["/FAQ/React/react-redux", "🍎redux的通讯方式"],
            ["/FAQ/React/react-redux-middleware", "🍍简易中间件"],
            ["/FAQ/React/Hooks", "🍊Hooks"],
          ]
        },
        {
          title: "Vue的一些小笔记",
          collapsable: false,
          children: [
            ["/FAQ/Vue/Cli", "🔨花里胡哨的cli"],
            ["/FAQ/Vue/observer", "🔧乞丐版本MvvM"],
            ["/FAQ/Vue/Communication", "🛠️记一次通信方式"]
          ]
        },
        {
          title: "日常杂玩",
          collapsable: false,
          children: [
            ["/FAQ/Work/TSC", "🏋️‍♂️TypeScript"],
            ["/FAQ/Work/cicd", "🚴持续集成部署（ci/cd）"],
            ["/FAQ/Work/AOP", "🏌️‍♂️AOP面向切片编程"],
            ["/FAQ/Work/WeChat", "⛹️踩坑React系列小程序"],
            ["/FAQ/Work/Work1", "🤾‍♂️前端请求的正确打开方式"],
          ]
        },
        {
          title: "乱写系列",
          collapsable: false,
          children: [
            ["/FAQ/Node/require", "🏀require基操"],
            ["/FAQ/Node/Koa", "⚽️初级Koa"],
          ]
        },
      ],
      "/Line/": [
        ["/Line/", "✒️"],
      ]
    }
  }
};