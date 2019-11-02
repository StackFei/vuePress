# React写法开发weapp

>  各大小程序编译平台斗的如火如荼，吾独爱 `React` 系列，几乎类`React` 开发写法也给很多不会类`Vue` 写法的人带来了福音

## 前言
本来准备鼓捣原生小程序的，但是语言层次太过繁琐，且文档是傻瓜式的中文文档，就不纳入解析范围。且小编的技术栈正好又是`React`。巧了，也正好有`React`系列的小程序框架，更巧的是，小编公司最近在开发小程序，选用了几款框架`Taro`,`ReMax`，今天就拿出来鼓捣鼓捣。

## 尝鲜凹凸曼Taro
顾名思义，凹凸曼。有京东凹凸实验团队打造完成。引用他们的一句话 "Taro 是一套遵循 React 语法规范的 多端开发 解决方案。" 花里胡哨的，说人话就是用`jsx`语法来开发小程序。不废话，直接瞜一眼。
```
// 初始化 taro init myApp
── myApp
   ├── config   // 配置文件
   ├── node_module // 依赖资源
   ├── src
   |    ├── actions  
   |    ├── pages  
   |    ├── reducers  
   |    ├── store  
   |    └── app.js   
   ├── ...   
   └── package.json 
```
这个结构很眼熟有没有，标准的`Web` 开发搭建目录。当然在初始化项目的时候你也可以配置自己的开发环境，目前支持多种开发语言，多种状态管理机制，以及编译成多套模板。来看一下大致内容。
### 入口文件
```javascript
// app.jsx
import { Provider } from '@tarojs/redux'
import configStore from './store'
const store = configStore()
class App extends Taro.Component {
  config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
  componentDidMount () {}
  componentDidShow () {}
  componentDidHide () {}
  componentDidCatchError () {}
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}
Taro.render(<App />, document.getElementById('app'))
```
又有点熟悉的感觉有没有，除了小程序特有的`config`配置项，以及多出的`componentDidShow`,`componentDidHide`两个钩子，其他的几乎完全和`React`的开发环境一样。甚至还集成了`Redux`,简直就是为`React`技术栈量身打造。

### 数据管理
数据管理是`React`的拿手好戏，当然也是完美的继承过来了，众所周知，类组件的连接数据的方法是`connect`，当然咱们已经鄙弃传统的多状态管理，只拥有一个`Store`。这里他做了更高阶的用法，
直接上了装饰器`@connect`，瞬间感觉学不动了。上演示配置代码。
```javascript
//store
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose
const middlewares = [
  thunkMiddleware
]
if (process.env.NODE_ENV === 'development' && process.env.TARO_ENV !== 'quickapp') {
  middlewares.push(require('redux-logger').createLogger())
}
const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
)
export default function configStore () {
  const store = createStore(rootReducer, enhancer)
  return store
}
//reducer
export default combineReducers({
  counter// 合并所有的reducer
})
//action
import { ADD,MINUS} from '../constants/counter'
export const add = () => {
  return {
    type: ADD
  }
}
export const minus = () => {
  return {
    type: MINUS
  }
}
// 异步的action
export function asyncAdd () {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}
```
### 使用方法一
忽略`store`中的部分配置文件，结构还是比较清晰的，完美的一套数据驱动页面的流程，这里就稍作解释，默认大家已经掌握`redux`流程，全局一个`store`，每次需要修改页面都通过页面的`dispatch`派发一个动作`action`回调给`store`然后涉及到网络请求就异步改变数据，映射到页面。接下来通过官方的计数器来演示操作.
```javascript
import { connect } from "@tarojs/redux";
import { add, minus, asyncAdd } from "../../actions/counter";
@connect(
  ({ counter }) => ({
    counter
  }),
  dispatch => ({
    add() {
      dispatch(add());
    },
    dec() {
      dispatch(minus());
    },
    asyncAdd() {
      dispatch(asyncAdd());
    }
  })
)
class Index extends Component {
  render() {
    return (
      <View className='index'>
        <Button className='dec_btn' onClick={this.props.dec}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <View>
          <Text>{this.props.counter.num}</Text>
        </View>
      </View>
    );
  }
}
export default Index;
```
这种`@connect`装饰器的写法，相信接触过`ES6`语法都得他比较熟悉，其实内部也只是一个高阶函数的写法，通过迭代器来运行。第一个参数接收一个函数，返回需要操作的数据，第二个参数也是接收一个函数，已`dispatch`作为参数，并且通过`dispatch`派发需要执行的动作函数。一气呵成。

### 使用方法二
类组件的写法，代码臃肿繁重是一个不得不接受的事实，所有`hooks`就来拯救强迫症了，`redux`都搬过来了，`hooks`当然也不会例外咯。当然还内置了一套自己封装的钩子，尤其内置了比`redux`更加好用的钩子函数`useSelector`等等等。先了解下基本操作.
```javascript
import Taro, { useState, useEffect } from '@tarojs/taro'
function (){
    const [count, setCount] = useState(0)
    useEffect(() => {
        setTimeout(() => {
            setCount(count + 1)
        })
    })
    return(<View>
        {count}
    </View>)
}
```
这写法，这操作，是`React`没错了，还有更劲爆的，状态数据处理钩子
```javascript
//index
import { useSelector } from '@tarojs/redux'
const persistReducer = useSelector(state => state.persistReducer)

//persistReducer
const initState = {
  areas: {},
}
export default function reducer(state = initState, action) {
  switch (action.type) {
    case `${API_GET_AREAS}_FULFILLED`:
      return {
        ...state,
        areas: action.payload,
      }
    default:
      return state
  }
}

```
只需要配上这两句，一切的问题都搞定，当然你得写好`persistReducer`中的网络请求，然后就可以从中结构出自己需要的数据，简直就是神器。

### 槽点
所谓有利便有弊，接下来罗列开发中遇到的槽点

---
封装组件不接收restProps
```javascript
// 错误写法
function ({...restProps}){
    return(<View {...restProps}>{children}</View>)
}
//正确写法
function ({count,count2,count3}){
     return(<View {count} {count2} {count3}>{children}</View>)
}
```
---
无法接受`jsx`组件作为参数传递
```javascript
// 错误写法
function App(children){
    return(<View>{children}</View>)
}
function ({App}){
     return(<View ><App /></View>)
}
```

无法通过`className`修改样式不接受传参

---

内置`eslint`强校验报错 即使语法没出错
....

---
总之，槽点多到你无法想象。所以就开始迁移到`reMax`了。

## 尝鲜阿里reMax
这款相对而言，就比较柔和，配置文件，写法用法也都和`taro`差不太多，但也有些许不同。比如个别配置文件.
```javascript
// 初始化 taro init myApp
my-app/
┳ package.json
┣ dist/
┣ node_modules/
┣ src/
┗━┓ app.js
  ┣ app.css
  ┣ app.config.js
  ┣ pages/
  ┗━┓ index/
    ┗━┓
      ┣ index.js
      ┣ index.module.css
      ┣ index.config.js
```
### 配置项
没错多了一个配置文件，`*.config.js`,怪文件是配置每个页面的`header`显示的`title`，在`taro`是不需要的，但在`reMax`,必须得跟上，而且是每个页面都得单独配，这也是比价恶心的地方之一，其次他的引入方式与`taro`也有些许不同，分为两套分别引入`wechat`,`alipay`，加上字节跳动。
```javascript
//index.config.js
module.exports = {
  navigationBarTitleText: 'xxx',
}

// 单页面组件引入方式
import { View, Text, Image, ... } from 'remax/wechat'
import { View, Text, Image, ... } from 'remax/alipay'
```

### 数据管理
总体来说，配置项都是那一套`Redux`的那一套流程，更巧的是，居然提供了一套和`taro`一毛一样的`useSelector`，我都怀疑是一家人了，果然好用的大家都在用。

### 槽点
就目前小编的认知，除了分享页面存在一些`BUG`,无法阻止默认事件，其他的还暂未发现。

### 总结
补充说明的是，`taro`,`remax`都拥有小程序原生的api方法，比如路由跳转，各类授权api，以及组件方法。都是可以直接调用的。
```javascript
// remax
import {View, Button, Text, navigateTo, useShareAppMessage, hideShareMenu}  from 'remax/wechat'

import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
const App = () => {
    return(<View onClick={() => Taro.navigateTo({url:"xxxxx"})}>
        跳转
    </View>)
}
```
一个是所有的Api以及组件都是直接结构出来，一个是分开挂载分开去取，总之是换汤不换药。还有很多好用没有罗列出来的功能或者写法以及各种写法上的奇淫技巧就得自己去尝试了，总之但是作为过来人，如果不讲究开发速率还是原生的小程序写法好用，没有那么多编译规则。如果是讲究开发效率，还是觉得`remax`好用一点，当然这只是针对`React`技术栈的人。不然咱为啥会迁以框架，别说了。搬组件去了。