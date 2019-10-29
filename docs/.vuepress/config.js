module.exports = {
  title: "白茶清欢无别事,我在等风也等你",
  description: "彭云飞的 Blog 维基百科", // meta 中的描述文字，意义不大，SEO用
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    // 增加一个自定义的 favicon(网页标签的图标)
    // 这里的 '/' 指向 docs/.vuepress/public 文件目录
    // 即 docs/.vuepress/public/img/geass-bg.ico
    ["link", { rel: "icon", href: "/img/geass-bg.ico" }]
  ],
  // base: "/StackFei/", // 这是部署到github相关的配置
  markdown: {
    lineNumbers: true // 代码块显示行号
  },

  // 顶部导航栏
  themeConfig: {
    sidebarDepth: 4, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: "最后更新时间", // 文档更新时间：每个文件git最后提交的时间,
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
            ["/FAQ/Node/Koa", "🍆初级Koa"],
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
            ["/FAQ/React/Hooks", "🍊初级Hooks"],
          ]
        },
        {
          title: "Vue系列",
          children: [
            ["/FAQ/Vue/A002", "#A002_Vue"]
          ]
        }
      ],

      // 打开Thought主页链接时生成下面这个菜单
      "/Thought/": [
        ["/Thought/", "圈内那点事"],
        {
          title: "年终回顾",
          children: [
            ["/Thought/YearReview/2018", "2018年"],
            ["/Thought/YearReview/2019", "2019年"]
          ]
        }
      ],

      // 打开Store主页链接时生成下面这个菜单
      // "/Store/": [
      //   ["", "仓库首页"],
      //   {
      //     title: "应用",
      //     children: [
      //       ["/Store/Apps/DownDoors", "下载门户"],
      //       ["/Store/Apps/OwnTest", "博主测评"]
      //     ]
      //   },
      //   {
      //     title: "电影",
      //     children: [["/Store/Films/", "收藏级电影"]]
      //   },
      //   {
      //     title: "动画",
      //     children: [["/Store/Anime/", "收藏级动画"]]
      //   }
      // ]
    }
  }
};
