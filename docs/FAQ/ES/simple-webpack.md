# webpack基础配置篇

>不会配置webpack的前端不是一个好前端, 都已经学到这, 就不必多介绍webpack是啥, 主要就是记录一下基本的配置项.

**准备环境**
  - webpack
  - webpack-cli
  - webpack-dev-server
  - babel/core
  - @babel/preset-env
  - @babel-loader

## 基础运行
首先以上的包, 是运行`webpack`的基础环境配置, 接下来编写对应的配置文件, 首先名字基本是固定的, 模式是固定的, 参数是固定的, 见缝插针就对了,
```js
// webpack.config.js
const path = require('path');
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname,'src/index.js'),
  output: {
    path.resolve(__dirname,'dist')
    filename: 'bundle.js'
  }
}
```
再回到`package.json`配置一下运行命令
```json
"scripts": {
  "build": "webpack", // 打包命令环境
  "dev": "webpack-dev-server" // 开发运行环境
},
```

不出意外的话, 运行`npx webpack` 在对应的目录便会产生`dist/bundle.js`, 如果有需要看到报错信息, 可以在另外配置`devtool:'source-map'`, 如果出错便会在对应的位置显示,

在html中引入对应的`js`文件, 运行即可, 当然默认打开的端口`http://localhost:8080`

## html资源
每次打包只会生成对应的`js`文件, 每次还需要手动引入到`html`中, 繁琐. 在以往可能会使用以下插件
```shell
npm install copy-webpack-plugin --save-dev
```
将`js`文件拷贝到指定的文件中, 现在为了方便基本上使用`html-webpack-plugin`,会更加方便一点, 配置好对应的参数即可,
```shell
npm install html-webpack-plugin --save-dev
```
对应的便需要简历`html`模板文件`public/index.html`,以及稍微的修改一下配置文件
```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
...
plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname,'public/index.html'),// 资源所在地
      path: path.resolve(__dirname,'dist'),// 对应的目的地
    })
]
```
以上的基本配置, 每次执行完打包或者运行便会自己将`js`文件引入, 并且运行到浏览器

## css资源
由于`webpack`默认只对`js`脚本执行编译, 如果你写的文件中包含`css`, 默认是无法识别的, 所以你需要配置对应的插件/loader
```shell
npm install css-loader style-loader --save-dev
```
以上两loader可以帮你解决`css`编译问题
```js
// webpack.config.js
...
module: {
  rules: [
    {
      test: /\.css$/,
      use: {
        loader: ['style-loader', 'css-loader'] //创建css连接插入到资源, copycss文件到资源连接中
      }
    }
 ]
}
```
以上只能能把你识别`css`文件, 无法做到很好的抽离
```shell
npm install mini-css-extract-plugin --save-dev
```
简单的一步即可将`css`文件做对应的压缩, 只需要稍微修改一下配置文件
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
{
  test: /\.css$/,
  // use: ['style-loader','css-loader']
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
},
```
当然我们有时候也不止只用到`css`可能会用到对应的`css`预处理器,`less`,`sass`等, 其实原理大多相同, 只是需要安装对应的插件解析即可, 最后依旧是编译成`css`插入到资源文件中, 由于使用到了对应的高级语法, 需要多装几个插件解析,
```shell
npm install less-loader less postcss-loader autoprefixer --save-dev
```
新建对应的的`postcss.config.js`
```js
module.exports = {
    plugins:[require('autoprefixer')]
}
```
并且修改对应的配置文件
```js
{
  test: /\.less$/,
  use: ['css-loader', 'postcss-loader', 'less-loader']
}
```
做到这个地方剩下的基本上就是优化问题, `css`文件过多也是一个问题, 尤其是在线上环境, 虽然`mode:'production'`会做到一定的压缩, 但是不会做到很完美的压缩,接下来手动压缩文件
```shell
npm install optimize-css-assets-webpack-plugin --save-dev
npm install MiniCssExtractPlugin --save-dev
```
两种方式, 稍微的修改文件
```js
//webpack.config.js
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
...
module: {
  rules: [
    {
      test: /\.less$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
    }
  ]
}
plugins: [
  new OptimizeCssPlugin()
],
```
简单的几步就搞定

## js语法
由于`ECMAScript`更新过快, 致使各种高新的语法, 被广泛用于程序设计中, 蛋疼的是各种浏览器的识别无法达到最新的语法, 但是开发人员有需要用最新的语法, 所以对应的高阶语法转低阶语法的插件就应运而生,简而言之, 编写一下代码, `webpack`就无法编译
```js
class A {

}
import './login.js'
```
所以我们需要配置一下插件识别编译
```shell
npm install @babel/plugin-proposal-decorators --save-dev
npm install @babel/plugin-proposal-class-properties --save-dev
```
```js
// webpack.config.js
{
  test: /\.js$/,
  use: {
      loader: 'babel-loader',
      options: {
          presets: [
              '@babel/preset-env'
          ],
          plugins: [
              ['@babel/plugin-proposal-decorators', { 'legacy': true }],
              ['@babel/plugin-proposal-class-properties', { 'loose': true }]
          ]
      }
  },
  include: path.resolve(__dirname, 'src'), //只查找该目录下的文件
  exclude: /node_modules/                  // 忽略该目录下的文件
},
```
既然提到了`import`的语法, 那按需加载, 也是需要单独配置的
```shell
npm install @babel/plugin-syntax-dynamic-import --save-dev
``` 
```js
plugins: [
  ['@babel/plugin-proposal-decorators', { 'legacy': true }],
  ['@babel/plugin-proposal-class-properties', { 'loose': true }],
  [
      "@babel/plugin-transform-runtime",
      {
          "corejs": 3
      }
  ],
  "@babel/plugin-syntax-dynamic-import"
]
```

## 热更新
每次编译或者修改配置文件, 如果你是`mac`可能会好一点不需要重启, 如果电脑性能稍微弱上那么一丢丢, 每次修改一点可能都需要重启,所以`webpack`为我们提供了热跟新操作, 基本上都是自带的模块所以不需要依赖外部模块
```js
//webpack.config.js
const webpack = require('webpack');
module.exports = {
    //....
    devServer: {
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin() //热更新插件
    ]
}
```
但是需要记住, 热更新只是按照模块来更新, 提供对应的方法监控你修改的对应的模块
```js
if(module && module.hot) {
    module.hot.accept()
}
```

## 多页打包
往往我们写的都是`spa`页面, 所以一般都会打包出一个`html`文件, 但是有时候也有特殊需求, 需要产出多个文件, 最常见的便是登录页需要单独的拎出来, 对应的`js`也需要单独的引入, 你考虑的这些`webpack`都给你考虑到了, 配置文件修改即可
```js
//webpack.config.js
entry: {
    index: './src/index.js',
    login: './src/login.js'
},
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:6].js'
},
//...
plugins: [
    new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html' //打包后的文件名
    }),
    new HtmlWebpackPlugin({
        template: './public/login.html',
        filename: 'login.html' //打包后的文件名
    }),
]
```
看似很简单嘛, 这里的`filename: '[name].[hash:6].js'`由于打出的是不同的`js`文件, 所以用变量名来命名不会覆盖冲突, 对应的`hash`也是做到避免缓存的问题, 打完包以为没问题了, 一打开对应的`html`文件, 发现他两都是相互引入对方的`js`文件, 这就是没必要的加载, 我没用到对应的文件却给他打包进去,再补上对应的配置文件解决
```js
new HtmlWebpackPlugin({
    ...
    chunks: ['index']
}),
new HtmlWebpackPlugin({
    ...
    chunks: ['login']
}),
```
以上文件便解决了,当然如果单个`html`文件还有对应多个模块, 只需要将`entry`改成数组即可
```js
entry: {
    index: [
      './src/index1.js',
      './src/index2.js'
    ],
    login: './src/login.js'
},

new HtmlWebpackPlugin({
    ...
    chunks: ['index1','index2']
}),
```

## resolve
- alias
举例说明, 我在某个页面需要用到另外一个组件, 一般写法`./../../`, 很抱歉, 默认不提供这种`@`直接定位到对应的文件夹, 所以需要自己配
```js
resolve: {
  alias: {
    'ant': 'ant/dist/ant.css'
  }
}
```

- extensions
查找文件后缀, 开发`vue`, `jsx`, `tsx`, 等各种语法的后缀都不同, 所以配备对应的后缀至关重要, 他会按从左到右的优先级别以此查找
```js
extensions:['.js','.css','.json'], //扩展名以此向后找
```

- modules
如果你开发了一款插件或者库, 但是有没有传到`npm`下载下来, 只是在本地存着, 但是你又想用以下语法引入
```js
import s from 's'
```
默认他是直接到`mode_module`中查找对应的模块, 所以我们需要改变一下配置
```js
modules: [path.resolve(__dirname,'package'),path.resolve('node_nodules')],
```

以上便是`webpack`的基础配置