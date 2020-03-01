## 长列表优化

> 废话不多说, 主要是涉及长列表优化加载问题传统意义的长列表就是无限制的请求加载数据, 就web端来说, 使劲的往上怼, 当然就会带来一些列问题, 写是一时爽, 重构火葬场, 这句话可不是浪得虚名的, 抛开业务线的臃肿问题, 

### 废话一大堆
- 就手机端来说, 之前负责过的一个ReactNative项目, 涉及到长列表的问题, 基本上加载到200条附近就会出现性能问题, 某些图片, 文字就会加载不出来。

接下来就由此来展开问题, 当然, 虽然做过分页处理, 但其中的加载点, 也只是按批次像后追加, 只是能解决突然间的大批量追加, 虽然其生态有一些列表的库, 但是由于定制化过高, 任未采纳, 折腾许久, 发现了React的一个web端的列表优化库`React-window`, 大致上也对其源码及效果了解过, 所以, 就自定义定制化了一下, 当然也不是定制RN端,只是自己学习当中的笔记.

## 正儿八经的模仿

> 首先要写, 当然是先看用法, 模仿入手, 当然你得对用法熟悉

先确定一个思路, 该库主要是优化当前一共显示的条数, 来减少不必要的性能开销, 既然是滚动问题, 有两中方案, 要么`padding`来撑, 要么`position`来定位, 显然我会选择后者来解决. 计算当前的滚动高度来显示当前应该显示的试图
> 还是比较清晰明了, 主要是一个类`FixedSizeList` , 其余的无非就是`Props`参数问题, `children`问题
```js
import { FixedSizeList as List } from 'react-window';
 
const Row = ({ index, style }) => (
  <div style={style}>Row {index}</div>
);
 
const Example = () => (
  <List
    height={150}
    itemCount={1000}
    itemSize={35}
    width={300}
  >
    {Row}
  </List>
);
``` 

- 首先来解决大致问题, 主类接收参数, 确定总高度, 渲染位置, 渲染传入的children
> （width容器的宽度）  （height需要显示容器的高度） （itemSize每个单独容器的高度） （itemCount需要显示的总数量）
```js
const FixedSizeList = (props：IProps) => {
  const { width, height, itemSize, itemCount } = props;
  const containerStyle = {
    width,
    height,
    position: 'relative',
    overflow: 'auto'
  }
  return <div style={containerStyle}>
    <div style={{ width: '100%', height: itemCount * itemSize }}>
      // children
    </div>
  </div>
}
export { FixedSizeList }
```
- 第二步, 先将首屏需要渲染的条数,渲染出来。 那就涉及到计算问题
> 这一步应该都好连接, (pageSize 需要动态算出首屏可以显示多少条信息,当然是根据你提供的数据来计算) ,（itemStyle默认给每一个小容器都增加一个定位的基本信息, 后续每次增加都可以覆盖掉）, (stopIndex当然你得通过最终加载参数来显示加载的数量, 可别一直滚动一直加载), 剩下的就是返回渲染值了 (children 这里代表的是一个个的函数渲染)
```js
const getData = () => {
  const children = [];
  const pageSize: number = Math.floor(height / itemSize) + 1;
  const itemStyle: ItemStyle = { width: '100%', height: itemSize, position: 'absolute', left: 0, top: 0 }
  const stopIndex: number = pageSize + startIndex
  for (let i = startIndex; i < (stopIndex >= itemCount ? itemCount : stopIndex); i++) {
    let style: ItemStyle = { ...itemStyle, top: i * itemSize }
    children.push(props.children({ index: i, style }))
  }
  return children;

  {getData()}
}
```

- 第三步, 使用
> 先来一点默认参数, 样式来填补一下, 不出意外, 首屏就会出现一个只加载了六条信息的dom元素, 
```js
import { FixedSizeList as List } from './package/reactScroll';

const Row: React.Element = ({ index, style }) => (
  <div key={index} style={{ ...style, textAlign: 'center', backgroundColor: 'red', border: '1px solid black' }}>
    {index + 1}
  </div>)

const App = () => {
  return (
    <List
      height={300}
      itemSize={100}
      itemCount={100}
      width={'100%'}
    >
      {Row}
    </List>
  )
}
ReactDOM.render(<App />, document.getElementById('root'))
```

- 第四步, 添加滚动事件
> 如果想要滚动的时候动态给 添加初始值计算, 必然是需要添加自定义事件, 由于React的fiberDom , 那就通过Ref来获取, 这里的Ref需要添加到最外层的事件监听上, （scrollTop 只需要监听该值的变化,来动态计算滚动的数量以此来改变下次添加的初始值以及结束值）
```js

const [startIndex, setStartIndex] = React.useState(0);
const containerRef: React.MutableRefObject<null> = React.useRef(null);

React.useEffect(() => {
  // @ts-ignore
  containerRef.current.addEventListener('scroll', () => {
    // @ts-ignore
    const scrollTop: number = containerRef.current.scrollTop;
    const currentIndex: number = Math.floor(scrollTop / itemSize);
    setStartIndex(currentIndex)
  });
}, [])
```
---

由于初次写这种, 写的不是很完善, 其实实现类似的效果, 方法有很多种, 也有很多灵活的做法, 主要是看实现思路, 计算方法的问题, 当然我写的也有很多计算臃肿的地方, 都可以根据自己的掌握程度来做修改, 

## 番外
> 由于不是采用脚手架生成的, 用webpack自己搭建的项目, 当然掌握一点肯定是没错的, 就将其简易版配置写出来参考一下, 当然你可能还得下载各种loader来编译.
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  context: process.cwd(),
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, 'node_modules'),
      "@": path.resolve(__dirname, 'src')
    },
    extensions: ['.ts', '.tsx', '.js', '.json', '.less']
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: {
          loader: 'ts-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }]
            ]
          }
        },
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        loader: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(),
  ]
}
```

