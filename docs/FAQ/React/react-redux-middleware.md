# 深入浅出react-redux-middleware

> `react-redux`核心系列组件已经过的差不多了, 接下里该碰一碰周边了, `middleware` 很熟悉的名词, 没错`Node`系列都是靠他吃饭, 接下里将尝试搓一搓`redux`中间件, 其实大部分没什么难度, 主要就是起到过滤服务,老规矩, 学习记录, 高手勿扰.

## 前置知识
结果前面的学习, 默认大家都熟练使用`redux`系列组件, 先学会用再学会其原理, 这是一个过程, 下面来剖析`redux`中间价, 顾名思义, 起到中间过滤作用. 需要注意的是, 中间件只拦截自己能解决的问题, 无法解决直接`next`抛到下一个中间件, 下面我们将由浅至深, 分别剖析常用的中间价 **`redux-logger`, `redux-thunk`, `redux-promise`, 已经可能会用到的缓存中间件`redux-persist`**
| 名称                               | 作用               | 说明          | 
| -------                           | ---------         | ------         | 
|<Badge text="redux-logger"/>        |记录操作日志          |        🚀     |
|<Badge text="redux-thunk"/>        | 让`createStore`支持中间件操作    |        🚀        |
|<Badge text="redux-promise"/>      |  可以派发不仅限于`function`的`promise`    |        🚀    |
|<Badge text="redux-persist"/>      |  缓存需要持久化存在的数据  |        🚀       |
|<Badge text="redux-actions"/>      |    简化合并`actions`动作  |       了解即可       |
|<Badge text="............"/>      |    ..............  |       了解即可       |

> **记住一个原则, 中间件就是一个过滤的函,每一个函数都返回下一个函数以及结果**

## redux-logger <Badge text="难度系数🌟" /> 
使用`react-redux`的确是一种很好的体验, 不用在理会状态的污染问题, 操作状态问题, 视图订阅问题, 就缺一个状态可视化, 没错还真有这个功能, 可以将更改`state`前后的变化以及操作的`action`都给浮现出来, 在写中间件前, 先来一个小菜压压惊.
### 原汁原味的logger
先来一个简单地`logger`试试水, 还是完全OK的, 还是比较简单的, 首先说明, 只能是派发一个组件状态才能生效, 多个合并的状态就会GG, 乍一看也没什么难度, 每次修改状态就会在控制台打印出对应的状态, 缺点就是没办法级联<Badge type="warn" text="无限层次嵌套中间件" />其他中间件.
```javascript
// createStore
let store = createStore(reducer);
let oldStore = store.dispatch
store.dispatch = function(action){
    console.log('%c prev state','font:bold; color:gray', store.getState())
    console.log('%c action','font:bold; color:green', action)
    oldStore(action)
    console.log('%c next state','font:bold; color:blue', store.getState())
}
```
很明显完全无法复用, 简直烂的一塌糊涂, 接下来尝试将其封装到一个公共方法中, 注意, 所有的中间件都是一个自执行的函数, 将仓库`store`丢到其中, 执行返回另一个函数以下一个中间件作为参数返回, 说起来有点绕, 看代码会比较清晰.
```javascript
export default function({getState,dispatch}){
    // 此处的next就是无法处理直接返回到下一个中间件接受处理
    return function(next){
        // 下一个中间件接受是需要执行的操作
        return function (action){
            console.log('%c prev state','font:bold; color:gray', getState())
            console.log('%c action','font:bold; color:green', action)
            next(action)
            console.log('%c next state','font:bold; color:blue', getState())
        }
    }
}
```
### 级联中间件 applyMiddleware
结构还是比价清晰的, 只负责自己这块业务, 其他的业务直接忽略过掉, 但是这样用是能用, 还是那句话, 功能写出来了但是只能用一个啊, 其他的完全不能混用, 那这不等于白折腾, 这时候就要想办法将所有的状态操作全都串联到一起, 只不过在处理所有逻辑之前加一个过滤函数, 来分解操作.***举例说明：我们期望的是有一个函数将`logger`传入执行, 然后再将`createStore`传入执行,`...` 最后再将`reducer`传入, 最终返回一个修改完后的`store`照常使用即可.***, 简而言之就是需要将所有的过滤器结合到一起使用.
```javascript
function applyMiddleware(...middlewares) {   
    return function (createStore) {
        return function (reducer) {
            let store = createStore(reducer)
            let middlewareAPI = {                    🚀
                getState: store.getState,
                dispatch: store.dispatch
            }
            middlewares = middlewares(middlewareAPI) 🚀
            dispatch = middlewares(store.dispatch)   🚀
            return {
                ...store,
                dispatch
            }
        }
    }
}
```
中间件的核心就是迭代每一个过滤器, 结构还是比较清晰的, 将所有的中间件收入其中, 在传入到通过`createStore`创建的`store`接收, 注意点：**带🚀的部分就是中间件的执行方式**,
```javascript
function logger({ getState, dispatch }){
    return function(next){
        return function(action){
            console.log('%c prev state', 'font:bold;color:gray', getState())
            console.log('%c action', 'font:bold;color:green', action)
            next(action)
            console.log('%c next state', 'font:bold;color:blue', getState())
        }
    }
}
```
目前来说已经是可以使用了, 但是只能是单个单个中间件使用, 类如`let store = applyMiddleware(logger)(createStore)(reducer)`, 其中的`logger`可以随意切换, 但这明显不是我们需要的场景, 我们需要将他们串联起来使用,

## redux-thunk <Badge text="难度系数🌟🌟" />
在级联中间件之前, 我们先解决另外一个问题, 在开发中也较为常见, 派发`action`的类型, 一般来说我们的类型操作是这种
```javascript
function increment(payload){
    return {type: INTREMENT, payload}
}
```
大概意思就是派发的函数体中的类型都是为`Object`类型, 这也是为我们的类型判断做了校验, 尽管这样写起来很方便,辨识度高, 但是满足不了我们的开发需求, 举一个简单的🌰, 我需要延迟派发某个动作, 当然如果你非要你咋执行的时候加入延迟(沙雕行为, 重构火葬场), 那咱也没办法.
```javascript
function syncIncrement(payload){
    return function(dispatch,getState){
        setTimeout(()=> {
            dispatch({type: INTREMENT, payload})
        }, 6666) 
    }
}
```
我们期望的方式是这样来操作, 解释一下, 由于是延迟操作, 为适应中间件的流程, 所以还是老规矩, 用函数返回的方式来派发, 当然现在直接运行, 肯定是回报`期望值是Object`, 所以我们需要中间件来规避这种操作, 遇到这中函数类型的直接执行掉, 不会流入到其他方法. 之前提到过中间件都是同一套流程, 不多废话直接上代码
```javascript
function thunk({dispatch,getState}){
    return function (next){
        return function(action){
            if(typeof action === 'function'){
                return action(getState,dispatch)
            }
            next(action)
        }
    }
}
```
和`logger`没多大差别, 就是中间层的操作有些许区别, 那就不做过多阐述, 下面有一个更加恶心的操作, 如果我派发的不是一个对象类型, 而是又是包装了一个延迟派发的函数, 如下.
```javascript
function syncIncrement(payload){
    return function(dispatch,getState){
        setTimeout(()=> {
            dispatch(function(dispatch,getState){
                setTimeout(()=> {
                    dispatch({type: INTREMENT, payload})
                }, 6666) 
            })
        }, 6666) 
    }
}
```
### 改造中间件 applyMiddleware
你说气不气, 这样一运行, 又报错, 第二次派发的动作就不会重新进中间件流程, 而是接着派发, 然后内部又没有处理机制, 所以归根结底`dispatch`的属性是个大难题, 不能返回原生的`dispatch`, 这样就不会重新走流程, 导致无法解决中间件问题, 那就来改造一下`applyMiddleware`
```javascript
function applyMiddleware(middleware){
    ...
    let dispatch;   🚀
    let middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args) 🚀
    }
    middleware = middleware(createStore)
    dispatch = middlewares(store.dispatch) 🚀
}
```
就稍微改了下带`🚀`的地方 这个难题就解决了, 先用变量缓存一下, 虽然第一次是空, 但是我内部不会调用, 最后一句是让每一次派发的`dispatch`都是上一次包装过后的`dispatch` 不至于会略过中间件直接进到下一级.

## redux-promise <Badge text="难度系数🌟🌟🌟" />
恶心的需求从来都只有第一次很无数次, 即`thunk`中间件之后又一个恶心的需求, 可能派发的又不是一个函数类型, 可能又会存在`Promise`类型的, 好吧, 这个其实也还好, 在写之前先想好策略。 **中间件,那么结构肯定是和`thunk`没区别, `Promise` 与 普通函数的区别好做表示的那就是`then`属性没错了**, 那就从这点入手.
```javascript
function promise({dispatch, getState}){
    return function (next){
        return function(action){
            if(action.then && typeof action.then === 'function'){
                return action.then(dispatch)
            }
            next(action)
        }
    }
}
```
## compose <Badge type="warn" text="难度系数🌟🌟🌟" />
好像单个的中间件编写起来也都还好, 没什么致命难度, 那你就错了, 果不其然. 现在我们的中间件只能单独使用, 用第一个就用不了第二个, 那不是很蛋疼, 得想办法将他们都用起来, 最好是想数组的操作一样, 直接挨个传入即可, 在使用之前我们先写一个递归的函数.
```javascript
function compose(...fns){
    if(fns.length === 0) return args => args
    if(fns.length === 1) return fns[0]
    return fns.reduce((a,b) => (...args) => a(b(...args)));
}
```
真的 就一行代码, 真的是天秀, 迭代方法. 能将方法由内而外的传入执行, 罒ω罒偷看源码来改的. 还看不懂`reduce`的真的改好好补补基础了. 有了这个函数, 就可以来改造`applyMiddleware`实现中间件级联使用了, 也不是很难.
### 终极中间件 applyMiddleware
```javascript
function applyMiddleware(...middlewares){
    return function(createStore){
        return function(reducer){
            let store = createStore(reducer)
            let dispatch;
            let middlewareAPI = {
                getState: store.getState,
                dispatch = (...args) => dispatch(...args)
            }
            middlewares = middlewares.map(middleware => middleware(middlewareAPI))
            dispatch = compose(middlewares)(store.dispatch)
            return {
                ...store,
                dispatch
            }
        }
    }
}
```
到此为止, 常用中间件系列, 算是告一段落, 其他的中间件也有编写, 就不在做累赘, 留个地址, 有兴趣者, 可移步

 **地址：<https://github.com/StackFei/ReactFAQ>**