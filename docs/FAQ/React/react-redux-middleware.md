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
            let dispatch;
            let middlewareAPI = {
                getState: store.getState,
                dispatch: (...args) => dispatch(...args) // 返回包装后的dispatch
            }
            // middlewares -> [promise, thunk, logger]中间件
            // 递归顺序执行logger执行结果 -> thunk执行结果 -> promise执行(返回的dispatch)
            middlewares = middlewares.map(middleware => middleware(middlewareAPI))
            dispatch = compose(...middlewares)(store.dispatch)
            return {
                ...store,
                dispatch
            }
        }
    }
}
```
中间件的核心就是迭代每一个过滤器, 结构还是比较清晰的, 将所有的中间件收入其中, 在传入到通过`createStore`创建的`store`接收, 注意点：**dispatch必须是经过包装过的dispatch不能是初始的dispatch否则中间件就失去了意义**, 难点就是如果将下一次中间件执行的结果跑到下一个中间件接着执行, 这点确实有点难顶, 好在偷偷看了下`react-redux`源码, 将其中的精华偷了点回来.
```javascript
function compose(...fns){
    if(fns.length === 0) return args => args
    if(fns.length === 1) return fns[0]
    return fns.reduce((a,b) => (...args) => a(b(...args)))
}
```
这个写法可以说是相当**秀**了, 难度不大, 但就是想不到这个点上, 这点也是做了点兼容问题, 可能传入的中间件不存在, 或是只传入一个, 那就远样抛出即可, `reduce`的作用就不做阐述, 按顺序迭代每一项, 前提是得确保每一项必须得是函数.
### 封装高可用的logger
前置工作已经搞定, 后面的工作就简单了, 记住前面一个原则, 所有的中间件都是一个函数, 接收状态返回一个新的函数, 派发都丢到下一个中间件来执行, 这样就很好处理了.
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

## redux-thunk <Badge text="难度系数🌟🌟" />
## compose <Badge type="warn" text="难度系数🌟🌟🌟" />
## redux-promise <Badge type="warn" text="难度系数🌟🌟🌟🌟" />
## redux-persist <Badge type="warn" text="难度系数🌟🌟🌟🌟🌟" />