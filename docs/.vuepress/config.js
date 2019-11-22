module.exports = {
  title: "守夜人笔记",
  description: "彭云飞的 Blog 维基百科", // meta 中的描述文字，意义不大，SEO用
  // plugins: ['@vuepress/back-to-top', '@vuepress/medium-zoom'],
  plugins: [
    ['@vuepress/back-to-top', true],
    ['@vuepress/medium-zoom', {
      selector: 'img',
      // See: https://github.com/francoischalifour/medium-zoom#options
      options: {
        margin: 16
      }
    }],
    // see: https://vssue.js.org/guide/vuepress.html#usage
    ['@vssue/vuepress-plugin-vssue', {
      // set `platform` rather than `api`
      platform: 'github',
      // all other options of Vssue are allowed
      owner: 'realpdai',
      repo: 'tech-arch-doc-comments',
      clientId: 'xxxxxxxxxxx',
      clientSecret: 'xxxxxxxxxxxxxxxxxxxxxx',
    }],
    // see: https://vuepress.github.io/zh/plugins/copyright/#%E5%AE%89%E8%A3%85
    ['copyright', {
      noCopy: false, // 允许复制内容
      minLength: 100, // 如果长度超过 100 个字符
      authorName: "https://www.pdai.tech",
      // clipboardComponent: "请注明文章出处, [Java 全栈知识体系](https://www.pdai.tech)"
    }],
    // see: https://github.com/ekoeryanto/vuepress-plugin-sitemap
    ['sitemap', {
      hostname: 'https://www.pdai.tech'
    }],
    // see: https://github.com/IOriens/vuepress-plugin-baidu-autopush
    ['vuepress-plugin-baidu-autopush', {

    }],
    // see: https://github.com/znicholasbrown/vuepress-plugin-code-copy
    [['vuepress-plugin-code-copy', true]]
  ],
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    // 增加一个自定义的 favicon(网页标签的图标)
    // 这里的 '/' 指向 docs/.vuepress/public 文件目录
    // 即 docs/.vuepress/public/img/geass-bg.ico
    ["link", { rel: "icon", href: "/img/geass-bg.ico" }]
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
        ["/FAQ/", "FAQ"],
        {
          // 菜单名
          title: "Node系列",
          // 子菜单
          children: [
            // ['','']=>[路径,标题]
            // 或者写成 '路径',标题自动识别为该地址的文件中的h1标题
            // 不以 '/' 结尾的就是指向.md文件
            ["/FAQ/Node/Koa", "🍊初级Koa"],
          ]
        },
        {
          // 菜单名
          title: "Css系列",
          // 子菜单
          children: [
            // ['','']=>[路径,标题]
            // 或者写成 '路径',标题自动识别为该地址的文件中的h1标题
            // 不以 '/' 结尾的就是指向.md文件
            ["/FAQ/Css/css", "🍌Css"],
          ]
        },
        {
          title: "React系列",
          children: [
            ["/FAQ/React/VirtualDom", "🌰VirtualDom"],
            ["/FAQ/React/react-redux", "🍎react-redux"],
            ["/FAQ/React/Hooks1", "🍊初级Hooks"],
            ["/FAQ/React/Hooks2", "🍉中级Hooks"],
            ["/FAQ/React/Hooks3", "🍐高级Hooks"],
          ]
        },
        {
          title: "Vue系列",
          children: [
            ["/FAQ/Vue/Cli", "🔨vue-cli"]
          ]
        },
        {
          title: "工作系列",
          children: [
            ["/FAQ/Work/Work1", "👷前端请求的正确打开方式"],
            ["/FAQ/Work/WeChat", "🤡踩坑React系列小程序"],
            ["/FAQ/Work/AOP", "🗡AOP面向切片编程"],
            ["/FAQ/Work/TSC", "🛬TypeScript"],
          ]
        }
      ],

      // 打开Thought主页链接时生成下面这个菜单
      "/Thought/": [
        ["/Thought/", "🚀"],
      ]
    }
  }
};