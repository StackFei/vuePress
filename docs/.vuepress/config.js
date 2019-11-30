module.exports = {
  title: "守夜人笔记",
  description: "守夜人笔记", // meta 中的描述文字，意义不大，SEO用
  plugins: ['@vuepress/pwa', {
    serviceWorker: true,
    updatePopup: true
  }],
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    // 增加一个自定义的 favicon(网页标签的图标)
    // 这里的 '/' 指向 docs/.vuepress/public 文件目录
    // 即 docs/.vuepress/public/img/geass-bg.ico
    ["link", { rel: "icon", href: "/img/favicon.ico" }]
  ],
  // base: "/StackFei/", // 这是部署到github相关的配置
  markdown: {
    // lineNumbers: true // 代码块显示行号
  },
  // 顶部导航栏
  themeConfig: {
    sidebarDepth: 5, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: "最后更新时间", // 文档更新时间：每个文件git最后提交的时间,
    smoothScroll: true, //页面滚动效果。
    // 顶部导航栏
    nav: [
      // 单项 text：显示文字，link：指向链接
      // 这里的'/' 指的是 docs文件夹路径
      // [以 '/' 结尾的默认指向该路径下README.md文件]
      { text: "home", link: "/" },
      { text: "求索", link: "/FAQ/" }, // http://localhost:8080/StackFei/FAQ/
      // { text: "仓库", link: "/Store/" },
      { text: "随笔", link: "/Thought/" },
      {
        text: "GitHub",
        items: [
          { text: "GitHub首页", link: "https://github.com/StackFei" },
        ]
      }
    ],
    // 侧边栏菜单( 一个模块对应一个菜单形式 )
    sidebar: {
      // 打开FAQ主页链接时生成下面这个菜单
      "/FAQ/": [
        //多级菜单形式
        ["/FAQ/", "🗂FAQ"],
        {
          // 菜单名
          title: "📔Node",
          // 子菜单
          children: [
            // ['','']=>[路径,标题]
            // 或者写成 '路径',标题自动识别为该地址的文件中的h1标题
            // 不以 '/' 结尾的就是指向.md文件
            ["/FAQ/Node/Koa", "⚽️初级Koa"],
          ]
        },
        {
          // 菜单名
          title: "📕Css",
          // 子菜单
          children: [
            // ['','']=>[路径,标题]
            // 或者写成 '路径',标题自动识别为该地址的文件中的h1标题
            // 不以 '/' 结尾的就是指向.md文件
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
            ["/FAQ/Vue/Communication", "⚔通信方式"]
          ]
        },
        {
          title: "📙花里胡哨",
          children: [
            ["/FAQ/Work/Work1", "🤾‍♂️前端请求的正确打开方式"],
            ["/FAQ/Work/WeChat", "⛹️踩坑React系列小程序"],
            ["/FAQ/Work/AOP", "🏌️‍♂️AOP面向切片编程"],
            ["/FAQ/Work/TSC", "🏋️‍♂️TypeScript"],
          ]
        }
      ],
      // 打开Thought主页链接时生成下面这个菜单
      "/Thought/": [
        ["/Thought/", "🗞"],
      ]
    }
  }
};