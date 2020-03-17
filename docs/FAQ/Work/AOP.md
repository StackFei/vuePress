---
title: AOP 面向切面编程
date: 2019-11-03
tags:
- AOP
- JavaScript
---

## 什么是AOP?
> 什么是AOP？ 和OOP又有何关联，AOP中文意思是面向切面编程，与OOP的面向对象编程相隔甚远。听起来感觉很模糊。上例子。

- 农场的水果包装流水线一开始只有 `采摘 - 清洗 - 贴标签`

![work日常工作](http://static.pengyunfei.top/image/Work/work9.png)

- 为了提高销量，想加上两道工序 `分类` 和 `包装` 但又不能干扰原有的流程，同时如果没增加收益可以随时撤销新增工序。

![work日常工作](http://static.pengyunfei.top/image/Work/work10.png)

- 最后在流水线的中的空隙插上两个工人去处理，形成`采摘 - 分类 - 清洗 - 包装 - 贴标签` 的新流程，而且工人可以随时撤回。

回归正题，什么是AOP? 万物皆碎片，可以随意插入、拼接、删除，缺不影响整体功能，与OOP的万物皆对象甚至有点违背。不过二者是可以相互融合使用，取其精华，弃其糟粕。

## AOP前世今生
理论知识过一遍，就到了编码时间，将其思想映射到代码，`AOP`的典型应用场景，最好的例子就是`高阶函数`的应用,明确一点何为高阶函数？看例子。
- 高阶函数
   - 某一个函数，其参数是一个函数
   - 某一个函数，其返回值也是一个函数
```javascript
function App(callback){
    callback()
}

function App(){
    return function App1(){
        // any wear
    }
}
```

## AOP应用场景
### AOP应用场景1-插入切片
明确一点，`AOP`面向切片就是在程序执行过程中在某一个位置切开一个口插入另外一个执行功能，接下来例举一个较为常见的例子。
```javascript
function Work(){
    console.log('不打卡，不计考勤，很高兴，拼命敲代码 😁')
}
```
在以往没有记录考勤时，大家都不需要打卡，突然间公司需要记录考勤，上班之前需要打卡，下班之前需要打卡。 
```javascript
function Work(){
    // 上班打卡
    console.log('打卡，计考勤，不高兴，不像敲代码，每天摸鱼 😭')
    // 下班打卡
}
```
说一下思路，需要在上班之前、之后分别添加打卡的方法。比较简单偷懒的做法，就是直接在`function`的原型链上扩展两个方法`before`,`after`，然后将它塞进去。先只添加一个`before`功能尝尝鲜。
```javascript
function Work(){
    console.log('打卡，计考勤，不高兴，不像敲代码，每天摸鱼 😭')
}

Function.prototype.before = function (beforeCallback) {
    const _this = this
    return function () {
        beforeCallback()
        _this()
    }
}

const newWork = Work.before(function(){
    console.log('上班前打卡')
})
newWork();
```
这场景，典型的`HOC`没错了，既有函数作为参数，又有函数作为返回值，但不会立马执行该函数。这里也涉及到js基础，在原型链上扩展方法，真实开发可别这么做，还是在特定的函数上扩展，避免污染全局。需要值得注意的是`this`指向的问题，涉及到词法作用域`newWork()`执行时的上下文指向问题，尤其是浏览器`window`与node的`global`，使得全局指向也较为模糊，无法判断。这里使用`_this`保存上下文的指向，原理是作用域得以保存，使得这里的`this`得以保存，内部能访问外部的变量`this`。或者也可以将其换为`() => {}` 没有`arguments - this`便可以直接`this()`调用了。看效果图。

![work日常工作](http://static.pengyunfei.top/image/Work/work11.png)

接下来就可以尝试在尾部添加`after`功能，大体其实也没有做多大改动。看实例代码.
```javascript
function Work(){
    console.log('打卡，计考勤，不高兴，不像敲代码，每天摸鱼 😭')
}

Function.prototype.before = function (beforeCallback) {
    return () => {
        beforeCallback()
        // this()
    }
}

Function.prototype.after = function (beforeCallback,afterCallback) {
    return () => {
        beforeCallback()
        this()
        afterCallback()
    }
}

const newWork = Work.before(function(){
    console.log('上班前打卡')
})
const newWork1 = Work.after(newWork,function(){
    console.log('下班前打卡')
})
newWork1();
```
看的出来无非就是在原型链上多扩展的方法。当然这只是乞丐版的，并没有考虑过其他情况，一切都只是以复原`AOP`思路为主。真实情况，可不能这样编码,效果图

![work日常工作](http://static.pengyunfei.top/image/Work/work12.png)

当然，也是支持传参，实例化的时候将参数携带会原型链上的方法，赋值给扩展的实例方法。这里需要注意的是，如果你是使用函数式的写法是可以使用`arguments` 可以直接将参数拿出，如果使用的是`() => {}` ，没有该参数，也可以使用`rest`这个API将参数延展出来。这里小编偷懒就是用`...`拿参数了。
```javascript
Function.prototype.before = function (beforeCallback) {
    return (...args) => {
        beforeCallback()
        this(...args)
    }
}
newWork1('小编');
```
需要注意的是，这里使用`_this`保存的`this`指向，是否是闭包的原理 ？

### AOP应用场景2-修改属性
阅读过Vue源码的都应该知道，其原理便是利用`Object.defineProperty`来劫持数据以更新视图，当然这是2.0，3.0是使用`Proxy`来代理。劫持数据或者说单只指劫持`Array`就有一个缺点，就是`Array`的原始API操作`Array`本身，是无法被劫持到是否改变的，所以Vue源码便对`Array`的原始API进行重写，当然不是完全重写，而是先继承，在此基础上扩展。感兴趣的可以去了解下。当然这不在今天的范畴之类。这种操作，就可以理解为是`AOP`的思想操作
接下来就列举一个`PUSH`的操作来举例说明，明确目标，每次调用`PUSH`时，我需要打印出我调用过该方法。分析一下写法，拿到原型链上的方法，在编写一个自己的方法，在将`this`指向原型链上的方法。
```javascript
let oldPush = Array.prototype,push;

function myPush (...args) {
    console.log('Started execution 👽')
    oldPush.call(this,...args)
}
const arr = ['🚀','🛩']
myPush.call(arr, '⛴')
console.log(arr)
```
这里的`this`稍微有点绕，需要牢记的是，`this`要指向原型链上，由于`myPush`上没有`oldPush`,所以调用自己写的`myPush`时需要将指向通过`call`值向到原始数组`oldPush`上，并将后续的参数传入。并且在自己的`myPush`中不能直接调用老的方法，这样`this`会默认指向`window`,也需要通过相同的方法，调整`this`指向。所以无论调用哪个地方的`call`，`this`指向永远不会混乱永远都是指向原始数组，看效果。

![work日常工作](http://static.pengyunfei.top/image/Work/work13.png)

## AOP扩展场景
既然`AOP`的应用场景如此广泛，Vue中使用，React中势必也会使用，接下里就做一个小的扩展，`React v16.3`之后新增的`hooks`属性中的`useState`便是采用这种切片方式来处理事件。

![work日常工作](http://static.pengyunfei.top/image/Work/work14.png)

执行机制，有点类似洋葱模型有不有，从开始执行`perform`到结束`maintained`，中间会执行一系列方法，可以有N个`wrapper`来包裹执行的方法，有`initialize`过度到`close`，现将所有的请求头执行完，在依次将请求头执行关闭。明确一点，`perform`无疑是一个高阶函数，接受多个`wrapper`、以及任意`anyMethod`作为参数，并且返回多个可执行顺序函数。将其映射到代码模型上。
```javascript
function perform(anyMethod, wrappers) {
    wrappers.forEach(wrapper => wrapper.initialize())
    anyMethod()
    wrappers.forEach(wrapper => wrapper.close())
}

perform(function () {
    console.log('🚧')
}, [
    {
        initialize() {
            console.log('wrapper1  👱before')
        },
        close() {
            console.log('wrapper1  👩lose')
        },
    },
    {
        initialize() {
            console.log('wrapper2  👱before')
        },
        close() {
            console.log('wrapper2  👩close')
        },
    }
])
```
![work日常工作](http://static.pengyunfei.top/image/Work/work15.png)

当然想将其变为高阶函数，延迟执行，也只需将执行的结果用函数返回即可。
```javascript
function perform(anyMethod, wrappers) {
    return function (){
        ...
    }
}
const perform(...)
```
就这么稍微改一下，就又有了`AOP`的编程规则。类似于这中`AOP` 编程思想的还有`axios`中的请求劫持，这些都可以细细研究。