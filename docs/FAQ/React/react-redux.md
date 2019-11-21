# 简单的理解react-redux全家桶

>根据自己的学习理解来剖析`react`全家桶的使用以及实现道理


## 前言
以下文章是属于茶后甜点, 完全属于自己学习路线上的产物, 是需要有一定的使用基础, 本文分为两个阶段, ***未使用`redux`的上古时代, 演变到`redux` 的使用、高阶使用以及实现, `react-redux`的使用以及实现***. 本文尽量通过通俗易懂的白话文来叙述, 尽量做到与源码相近.

## redux
### 上古时代
在没有框架化的开发阶段, 数据请求问题一直是一个饱受争议的话题, 数据都是分散开来管理, 每个页面/组件 负责自己的状态, 互不干扰, 并且状态都得不到持久化的保存, 通信都是一大难题. 后来闭包的使用使得这一现象好转, 保存变量的经典操作也成为后来`redux`的设计思想之一. 虽然会造成一定的性能问题, 但是两兵相交, 退而求其次. 以下便是常见的数据问题之一.
```javascript
//状态树
let appState = {
    title: { color: 'red', text: '标题' },
    content: { color: 'yellow', text: '内容' }
}

function renderApp(appState) {
    renderTitle(appState)
    renderContent(appState)
}

function renderTitle(appState) {
    let title = document.getElementById('title');
    title.style.color = appState.title.color;
    title.innerHTML = appState.title.text;
}

function renderContent(appState) {
    let content = document.getElementById('content')
    content.style.color = appState.content.color;
    content.innerHTML = appState.content.text;
}
// appState.title.color = 'green' yes
// appState= null                 no
renderApp(appState)
```
### 演变 (规范修改操作)
修改状态是可以的, 但是直接给状态赋值为`null`,`undefined`就会出现数据丢失, 虽然可以在渲染时操作`!!${data}`可以换的一线生机, 但是这属于是拆东桥补西墙, 不是解决方案, 方案在于解决状态不被随意改变. 那就让每次改变数据都得识别其改变的类型, 那就需要用函数来标识规范改变的动作. 只需要在上述中追加如下.
```javascript
function dispatch(action){
    switch(action.type){
        case COLOR :
            appState.title.color = action.payload
        break;
        case TEXT :
            appState.title.text = action.payload
        break;
        ...
        default:
            break;
    }
}

// 使用
setTimeout(()=>{
    dispatch({type:'COLOR',payload:'green'})
    renderApp(appState)
},1000)
```
简要说明, 直接调用函数传入一个`create object`类型的数据`action`, 传入需要修改的动作类型`type`以及数据`payload`. 还是比较清晰的, 这样就能避免违规操作, 不符合操作类型的直接过滤掉. 
### 演变 (规范数据源)
以上能解决操作问题的规范性, 但是还是可以直接修改数据源, 在渲染前后直接操作数据源, 也是重大BUG. 解决方案之一, 变量私有化, 将数据丢到函数体内部, 在外面就无法直接修改, 在做简单的修改.

















经典的数据管理状态容器, 以其单向数据流的思想提供可靠稳定唯一的数据源`state`, 且只接受派发动作的管理操作`action`, 以及监管状态动作的派发操作`dispatch`.统称为容器状态的`store`. 重中之重在于, 其思想不限制与任何框架任何思想的束缚, 可应用与任何场景, 接下来就开始剖析其内部原理.
```
── redux
   ├── createStore   // 创建派发操作
   ├── combineReducer // 合并操作动作
   ├── bindActionCreators   // 合并派发动作 
   └── index   // 入口
```
明确需求：通过`element`创建一个dom节点，修改数据调用`patch`来记录修改的数据,以此修改界面，但这样频繁的修改很耗性能，`diff`排上用场了，用最小的遍历角度优化修改补丁包，当然这是乞丐版的。源码可不止这样草率。


