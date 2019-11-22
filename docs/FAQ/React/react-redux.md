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
简要说明, 直接调用函数传入一个`create object`类型的数据`action`, 传入需要修改的动作类型`type`以及数据`payload`. 还是比较清晰的, 这样就能避免违规操作, 不符合操作类型的直接过滤掉. 需要注意的是派发完成动作后需要重复`render`渲染视图层.
### 演变 (规范数据源)
以上能解决操作问题的规范性, 但是还是可以直接修改数据源, 在渲染前后直接操作数据源, 也是重大BUG. 解决方案之一, 变量私有化, 创建一个函数将数据丢到函数体内部, 在外面就无法直接修改, 再做简单的修改.
```javascript
function createStore(){
    let state = {
        title: { color: 'red', text: '标题' },
        content: { color: 'yellow', text: '内容' }
    }
    function getState(){
        return state
    }
    return {getState}
}
```
这样就将状态数据藏起来了, 外界就无法访问修改该属性, 乍一看是没多大毛病了, 但是细想我还要执行修改操作啊, 这样分散的话, 就不好切片编程了, 又变成了一坨烂泥, 然后就稍作修改, 将操作状态的动作合并到`createStore`中, 统一管理状态以及动作.
```javascript
function createStore(){
    let state = {
        title: { color: 'red', text: '标题' },
        content: { color: 'yellow', text: '内容' }
    }
    function getState(){
        return state
    }
    function dispatch(action){
        switch(action.type){
            case COLOR :
                state.title.color = action.payload
            break;
            case TEXT :
                state.title.text = action.payload
            break;
            ...
            default:
                break;
        }
    }
    return {getState, dispatch}
}
```
### 演变 (规范动作)
上述操作, 貌似以及解决了绝大多数问题, 所以现在到了规范写法的时候, 目前是所有的逻辑操作, 都糅杂在`createStore`中, 这样会导致此函数越来越大, 越来越难管理. 细想, 既然所有的派发动作都是一致的参数流程, 那何不将其抽离到外部, 然后在拼接起来, 哪里需要用到母函数就直接引入, 岂不乐哉.
```javascript
function createStore(reducer) {
    let state = {
        title: { color: 'red', text: '标题' },
        content: { color: 'yellow', text: '内容' }
    }
    function getState() {
        return state;
    }
    function dispatch(action) {
        state = reducer(state, action)
    }
    return { getState, dispatch }
}
function reducer(state, action) {
    switch (action.type) {
        case UPDATE_TITLE_COLOR:
            return { ...state, title: { ...state.title, color: action.payload } }
        case UPDATE_TITLE_TEXT:
            return { ...state, title: { ...state.title, text: action.payload } }
            break;
        case UPDATE_CONTENT_COLOR:
            return { ...state, title: { ...state.content, color: action.payload } }
        case UPDATE_CONTENT_TEXT:
            return { ...state, title: { ...state.content, text: action.payload } }
        default:
            return state;
    }
}

const store = createStore(reducer)
```
现在就只存在一个仓库和一些动作操作的流程, 操作状态只管接受状态还有动作, 创建仓库只管派发验证动作, 各司其职, 基本上就有了`redux`的雏形, 接下里就属于`redux`的完善流程.
### 基本redux <Badge text="redux雏形" type="warn"/> 
可以看出`redux`的核心就是`createStore`这个仓库管理员, 那么一切的操作都是以其为核心来开展, 下面需要完善几个点, ***①`state`状态是不能写死在仓库中***,***②每次派发完动作都需要手动再次渲染才能刷新视图***
##### 状态问题一步到位
```javascript
let state = { 🚀
    title: { color: 'red', text: '标题' },
    content: { color: 'yellow', text: '内容' }
}
function reducer(state = state,action){}
function createStore(reducer) {
    let state; 🚀
    function getState() {
        return state;
    }
    function dispatch(action) {
        state = reducer(state, action)
    }
    dispatch({type:"@@MY_REDUX_INIT"}) 🚀
    return { getState, dispatch }
}
```
🚀 的地方属于基操, 将状态抽离到外部, 第一次运行`createStore`找不到`state`就会默认是`undefined`, 但是我让其在内部先执行一次`dispatch`先拍发一次, 我随意传入一个`type`的动作, 到`reducer`无法验证动作的类型, 那就默认返回初始值咯. ***划重点,初次派发的类型一定得是没有定义的***
##### 动作问题由浅入深
每次派发玩动作, 虽然你状态的确改变了, 但是视图不知道啊, 他不知道状态以及发生了改变, 着实头疼, 不会让我派发一次手动执行一次渲染动作, 这也不切实际. 在以往都是使用观察者默认, 现在的话发布订阅可能会更加容易理解, 属于观察者的优化版, 先明确一下思路, 每次派发完动作我都希望`render`能自己知道发生了改变, 既然不知道状态, 那就将状态存储起来对比差异, 其实内容也不是很那难, 接下来实践.
```javascript
function createStore(reducer) {
    let state,listener = []
    function getState() {
        return state;
    }
    function dispatch(action) {
        state = reducer(state, action)
        listener.forEach(fn => fn())
    }
    function subscribe (lister){
        listener.push(lister)
        return function(){
            listener = listener.filter(item => item !== lister)
        }
    }
    dispatch({type:"@@MY_REDUX_INIT"}) 
    return { getState, dispatch, subscribe }
}
```
思路还是比较清晰的, 直接创建一个订阅的函数`subscribe`, 没次订阅都将其存放到一个局部变量`listener`中, 并且返回一个取消订阅的函数, 与之前存放订阅的数组作对比, 返回是取消订阅之后的队列, 派发动作`dispatch`时, 顺便依次执行订阅, 这样将发布订阅与派发动作融为一体, 也算是较为讨巧的写法.
***
经典的数据管理状态容器, 以其单向数据流的思想提供可靠稳定唯一的数据源`state`, 且只接受派发动作的管理操作`action`, 以及监管状态动作的派发操作`dispatch`.统称为容器状态的`store`. 重中之重在于, 其思想不限制与任何框架任何思想的束缚, 可应用与任何场景, 接下来就开始剖析其内部原理.
```javascript
── redux
   ├── createStore   // 创建派发操作
   ├── combineReducer // 合并操作动作
   ├── bindActionCreators   // 合并派发动作 
   └── index   // 入口
```
### redux组件1  <Badge text="bindActionCreator"/>
顾明思议, 合并所有的派发动作, 在往常没有合并的时候我们的写法是这样的.
```javascript
onClick = {() => {store.dispatch({type:'xxxx'})}}
...一毛一样的操作
```
我们期望是直接执行某个方法, 就自动给我派发动作, 并且我还可以直接同时传入多个动作派发.思路都是派发, 就和不同的类型在做比较, 需要注意传参的细节, 派发动作传入的参数是不一致的, 直接`nest`展开即可, 看实现思路.
```javascript
function bindActionCreator(actionCreator, dispatch){
    return function(...args){
        dispatch(actionCreator(...args))
    }
}
export default bindActionCreators(actionCreators, dispatch){
    if(typeof actionCreators === 'function'){
        return bindActionCreator(actionCreator, dispatch)
    }
    let arrBindActionCreator = {};
    for(let key in actionCreators){
        arrBindActionCreator[key] = bindActionCreator(actionCreator[key], dispatch)
    }
    return arrBindActionCreator
}
```
### redux组件2  <Badge text="combineReducer"/>
与合并派发一样, 这是合并所有的动作, 老规矩 没有合并之前, 一个逻辑页面一个`reducer`, 页面一多, 就会出现到处都是`reducer`的现状, 如下.
```javascript
function reducer1(){
    //加减逻辑
}
function reducer2(){
    //加减逻辑
}
...一毛一样的操作
```
我们期望的是只需要一个根`reducer`, 其他的都是按需引入的, 最好是一个对象直接取即可, 思路与上相同
```javascript
export default combineReducer(reducers){
    return function(state={}, action){
        let nextState = {};
        for(const key in reducers){
            nextState[key] = reducers(state[key],action)
        }
        return nextState;
    }
}
```
写法还是比较简单的, 就是将有规律的函数键值对, 拼凑完整在按原样返回. 整理一下思路, 在稍后的章节还会继续剖析<Badge text="react-redux" type="warn"/>全家桶.
| 名称                               | 作用               | 说明          | 
| -------                           | ---------         | ------         | 
|<Badge text="index"/>              |合并所有功能钩子函数   |        🚀     |
|<Badge text="createStore"/>        | 创建仓库函数        |        🚀        |
|<Badge text="combineReducer"/>     |  合并所有动作函数    |        🚀        |
|<Badge text="bindActionCreator"/>  |    合并所有派发函数  |        🚀       |

## react-redux
<Badge text="火热剖析中......"/>






<!-- <ClientOnly>
  <HomeLayout/> 
</ClientOnly> -->


