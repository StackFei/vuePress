---
title: 最简单的react系列组件react-router
date: 2019-12-01
tags:
- React
---

> 日常记笔记, 不过这一节到是没什么难点, 比较任何框架, 库最简单的莫过于路由跳转, 尤其`SPA`, 大多都是模仿浏览器原生API套壳实现, 这一节可以说是最简单的`react`系列

## 路由历史规范
在写之前有必要先了解一下路由的历史,前端其实在以往是没有路由跳转的规范的, 在还没有前端的时候, 跳转都是通过后端来控制, 和现在的服务器渲染没多大差别, 但是用户体验不太好, 没切换一个页面都需要重新请求服务器, 服务器会消耗不必要的资源, 由此便开启了大前端时代, 主要是通过浏览器来控制, 分为两种模式, `hash`,`history`

### hash
`hash`路由, 顾名思义, 就在是浏览器地址后跟上hash值`#/`, 需要注意的是, 该方法不是浏览器的规范法则, 于是乎兼容性好到爆, 所有框架基本上初始都是`hash`模式, 但是莫名在后面拼上`#`, 缺点就是不好看, 这家伙
长这样`host/index.html#/xxx`.先来尝试一下
```html
<a href="#/A">A</a>
<a href="#/b">B</a>
```
用法到是不是很那, 就是在挑转路径之前拼接上`#`, 这种事无感刷新的, 页面不会刷新, 但是浏览器会记录你的操作记录, 我们来尝试一下模仿该操作.
 - **模仿`hash`**

由于默认可能回事根路径, 或者可能是其他路径, 所有需要默认给他加上一个, 只需要在监听路由中做你想做的操作即可.
```js
<script>
    window.location.href = window.location.href.slice(1) || '/'
    window.addEventListener('hashchange',()=>{
        ....
    })
</script>
```

### history
`history` 一听就跟专业的样子, 字面意思就是历史记录的意思, 这是浏览器提供的`Api`, 所以可以直接使用, 并且也不会在地址添加一些其他东西, `history`默认暴露一个调用属性`pushState`, 用于向储存站中添加临时路径, 缺点也很明显, 首先浏览器无法监听手动前进后退其次， 一刷新就崩了, 其原因都是因为存储的是临时地址路径, 先来看看使用
```html
<a>A</a>
<a>B</a>
<script>
    window.history.pushState('/')
</script>
```
首先确认`pushState`的参数是一个`options`, 第一个是`data`类型, 第二个`title`是该路径的标题, 第三个`url`才是路径, 其实前两个基本上没啥用, 所以直接传入路径即可

 - **模仿`history`**
```html
<a onClick="push('/A')">A</a>
<a onClick="push('/B')">B</a>
<script>
    function push(path){
        history.pushState({},null,path)
    }
</script>
```
看似完美, 以及能够达到想要的结果, 但是完美前面提到过浏览器前进后退, 不识别这东西, 浏览器又提供了专门监听手动前进后退的`Api`, 再来试试
```html
<script>
    function push(path){
        history.pushState({},null,path)
    }
    window.addEventListener('popstate',()=>{
        ...
    })
</script>
```
到此为止, 前端路由的方式基本上就搞定了, 主要是要有这两个概念, 才好在后面的`react-router`实操


## 还原router细节
由于路由的例子过于特殊, 我们直接看完整的例子使用, 然后回过头再来还原, 
```js
import { HashRouter as Router, route, Link } from 'react-router-dom'
ReactDOM.render(
    <Router>
        <Route path="/" exact/>
        <Route path="/user"/>
        <Route path="/profile"/>
    </Route>
,document.getElementById('root'))
```
默认可以使用`HashRouter`, 也可以使用`HistoryRouter`, 用法和`react-redux`相似, 最外层需要包裹一个组件传递上下文, 那看来实现思路也是差不多, 注意**如果这里使用到了`react-redux`他的优先级是最外层最高的**, 下面我们来尝试一一还原

 以下就是react中的router中带有的属性.
| 名称                          | 作用               | 说明          | 
| -------                        | ---------         | ------         | 
|**<Badge text="history"/>**    |跳转历史记录          |        🚀     |
|**<Badge text="location"/>**    | 路径相关的  |        🚀        |
|**<Badge text="match"/>**      |  跳转正确路径后的所有参数    |        🚀    

### HashRouter/Router <Badge text="需要提供上述的三个属性" />
既然分析和`react-redux`的思路一样, 一个父组件提供属性, 子组件获取消费, 那么我们就尝试用相同的思路来实现, 既然涉及到状态共享必然会使用到上下文`context`, 先来创建上下文 
```js
export default React.createContext()
```
 - 创建上下文, 并且将上下文抛到下级
```js
import MyContext = './context'
class HashRouter extends React.Component{
    render(){
        let value = {}
        return (<MyContext.Provider value={value}>
            this.props.children
        </MyContext.Provider>)
    }
}
```
 - 创建属性, 开启监控属性值的变化, 并且传到下级

我们需要自己创建上述提到的几个对象属性, 并且初始化的时候还需要监听浏览器的`hash`操作, 可能还要容错没有路径或者重定向到首页的路径, 老规矩获取浏览器默认路径来操作.
```js
import { Provider } from './context'
class HashRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: {
        pathname: window.location.hash.slice(1) || "/"
      }
    }
  }
  componentDidMount() {
    //默认hash没有值 跳转到 /
    window.location.hash = window.location.hash || "/";
    // 监听hash值变化 重新设置状态
    window.addEventListener("hashchange", () => {
      this.setState({
        location: {
          // 先把原始的值保存一下 避免存在多值的情况
          ...this.state.location,
          pathname: window.location.hash.slice(1) || "/"
        }
      })
    })
  }
  render() {
    let value = {
      location: this.state.location,
      history: {
        push(to) {
          window.location.hash = to;
        }
      }
    }
    return (<Provider value={value}>
      {this.props.children}
    </Provider>);
  }
}
```

### Route <Badge text="获取路径渲染组件" />
引用到了上下文, 那子组件便可以直接通过上下文消费, 通过静态方法直接绑定
```js
import pathToRegExp from 'path-to-regexp'
import { Consumer } from './context'
class Route extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <Consumer>
      {(state) => {
        console.log(state)
        console.log(this.props)
        //path 是route中传递的
        let { path, component: Component, exact = false } = this.props;
        //pathname是location中的
        let pathname = state.location.pathname
        // 根据path实现一个正则 通过正则匹配
        let keys = [];
        let reg = pathToRegExp(path, keys, { end: exact })
        keys = keys.map(item => item.name) //模糊匹配的参数 [id]
        let result = pathname.match(reg)
        let [url, ...values] = result || [];// [1,2 ]
        let props = { //props传递到子元素中使用
          location: state.location,
          history: state.history,
          match: {
            params: keys.reduce((obj, current, idx) => {
              obj[current] = values[idx];
              return obj;
            }, {})
          }
        }
        if (result) {
          return <Component {...props}></Component>
        }
        return null
      }}
    </Consumer>;
  }
}
```

### Link <Badge text="渲染组件" />
```js
import { Consumer } from './context'
class Link extends Component {
    render() {
        return (<Consumer>
            {state => {
                return <a onClick={() => {
                    state.history.push(this.props.to)
                }}>{this.props.children}</a>
            }}
        </Consumer>)
    }
}
```

### Switch <Badge text="拦截重复查找路径组件" />
```js
import pathToRegExp from 'path-to-regexp'
import { Consumer } from './context'
class Switch extends Component {
    render() {
        return <Consumer>
            {state => {
                let pathname = state.location.pathname;
                let children = this.props.children;
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    //Redirect 可能没有path属性      
                    let path = child.props.path || "";
                    let reg = pathToRegExp(path, [], { end: false })
                    //Switch匹配成功  
                    if (reg.test(pathname)) {
                        return child //把匹配到的组件返回即可
                    }
                }
                return null;
            }}
        </Consumer>
    }
}
```

### Redirect <Badge text="重定向渲染组件" />
```js
import { Consumer } from './context'
class Redirect extends Component {
    render() {
        return <Consumer>
            {state => {
                //重定向就是匹配不到后直接跳转到redirect中的to的路径的
                state.history.push(this.props.to);
                return null
            }}
        </Consumer>
    }
}
```

由于是跳转幅度比较大, 暂时没找到办法串起来写出来, 所以就将源码全都贴出来.

**地址：<https://github.com/StackFei/ReactRouter>**