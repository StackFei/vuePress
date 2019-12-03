---
title: 初识Vue工作原理
date: 2019-11-30
tags:
- Vue
- MvvM
---

> 讲道理, 让我这种 `react` 栈的来记录学习`vue`的曲线, 着实有点恶心. 好吧, 我也是被逼无奈, 老规矩, 学习记录.

## 引出问题
初次使用一下`Vue`, 来尝试一下`MVVM`的用法, 暂且先不使用工程化的方式来使用, `npm` 装包这个就不用多说了吧, 不懂的可以出门左转了.
```html
<div id="container">{{name}}</div>
<script src="node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el:'#container',
        data(){
            return{
                name:'守夜人笔记'
            }
        },
    })
</script>
```
没什么很大的使用难度, 果然上手难度小, 可以看出`Vue`就是一个实例化的方法, 然后这些钩子函数无疑于`react`的钩子有相似的使用方法, 是类的实例方法. 我们需要搞懂这其中的数据绑定关系.

## 剖析双向绑定原理
`Vue`是靠`Object.defineProperty`的劫持属性来操纵数据状态已达到监听数据的目的, 首先我们得搞懂`Object.defineProperty`的原理, **`MDN`写的很明确, 该方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象.** 简而言之, 就是给某个对象增加一个属性监听, 发生改变之后就会触发某些事件, 然后执行某些方法.

### 简单单层类型 <Badge text="对象类型" /> 
 - 没有什么比一个例子来的更加是在, 劫持属性, 记住**数据源是一个对象**
```javascript
function observer(obj){
    if(typeof obj !== 'object' || obj === null){
        return obj
    }
    for(const key in obj){
        Reactive(obj, key, obj[key])
    }
}
function Reactive(obj, key, value){
    Object.defineProperty(obj, key, {
        get(){
            return value;
        },
        set(newValue){
            if(value !== newValue){
                value = newValue
                console.log('更新数据')
            }
        }
    })
}
let data = {
    name: "守夜人笔记"
}
observer(data)
```
基本上是没什么大问题, 使用`get`可以获取到属性, 下面来修改一下属性试试
 - 修改基本单层属性, 并侦测变化, 留意这里为啥会说**单层**
```javascript
observer(data)
data.name = "888";
```
不出意外的话, 控制台会打印出`更新数据`, 符合预期, 下面我们来试一试嵌套类型的数据, 毕竟项目中也是各种复杂类型都会存在
 - 修改多层属性
```javascript
let data = {
    name: "守夜人笔记",
    hobby: {
        one: "撸码",
        two: "划水",
        three: "摸鱼",
    }
}
observer(data)
data.name = "888";
data.hobby = "";
data.hobby.one = "888";
```
然后这样就会发现, 修改`hobby`中的属性, 或者直接修改`hobby` 然并卵, 没什么变化, 细思极恐, 细想还是代码写的不够完善, 咱们没考虑过嵌套多层的情况, 稍作修改.
```js
function Reactive(obj,key ,value){
    observer(value) 🚀
    Object.defineProperty(obj,key,{
        get(){
            return value
        },
        set(newValue){
            if(value !== newValue){
                observer(newValue) 🚀
                value = newValue
                console.log('数据更新')
            }
        }   
    })
}
```
没毛病, 在小🚀的位置添加改代码, 判断之前做一个递归, 修改时在做一个递归, 妥妥的.

### 复杂多层类型 <Badge text="对象/数组/...类型" /> 
那么问题又来了, 除非数据类型是对象类型, 否则又无法修改, 这可真是蛋疼, 先复现一下问题.
```js
let data = {
    name: "守夜人📒",
    [1,3,4],             
    [{name: "守夜人📒"}]
}
```
恶心的事来了, 你可以修改存在于数组中的对象类型, 但是直接操作数据类型的修改就不行, 看了下源码的结构, 主要是屏蔽了数组的操作属性, 究其原因, Google, 是由于`Object.defineProperty` 无法触碰数组索引无法获取到变更, 导致无法侦测, 那就恶心了啊, 得另外处理数组的问题, 得多做一步判断操作.
```js
function observer(obj){
     if(typeof obj !== 'object' || obj === null){
        return obj
    }
    if(Array.isArray(obj)){
        for(let i = 0; i < obj.length; i ++){
            Reactive(obj[i])
        }
    }else {
        for(const key in obj){
            Reactive(obj, key, obj[key])
        }
    }
}
```
这里也仅仅是针对数组中有对象类型的属性提供侦测, 如果是常亮类型的依旧无法监听, 然后我们来做一点稍稍的改动, 没记错的话源码是重写数组的`API`, 也算不能上重写, 就是给能让数组增加的方法, 加了个监听 毕竟谁也不知道会不会操作数组加入对象类型, 
 - 先将数组中的`API`完封不动的继承过来, 顺道覆盖一下之前的方法, **重点是给添加的方法的值追加监听**
```js
let arrayProps = Array.prototype;
let proto = Object.create(arrayProps);
// 重写数组中的方法
['push', 'unshift', 'splice'].forEach(method => {
    proto[method] = function (...args) {
        // 判断数组中添加方法
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice': //splice用发 传递三个参数才是添加
                inserted = args.slice(2)
            default:
                break;
        }
        console.log('数组更新了')
        ArrayObserver(inserted)
        arrayProps[method].call(this, ...args)
    }
})

function ArrayObserver(obj) {
    for (let i = 0; i < obj.length; i++) {
        let item = obj[i]
        observer(item)
    }
}

function observer(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj
    }
    if (Array.isArray(obj)) {
        // 增加数组的参数中可能也会添加对象类型
        Object.setPrototypeOf(obj, proto)
        // 数组循环是否侦测
        ArrayObserver(obj)
    } else {
        for (const key in obj) {
            Reactive(obj, key, obj[key])
        }
    }
}
```
**这里使用`Object.create()`是为了避免污染数组原型, 顺便将监听数组的公共方法`ArrayObserver`抽离出来, 这里增加常亮也不会触发, 因为在重写数组方法内部也做了`observer`监听**
这里的`observer`的功能大概就是`MvvM`的功能实现了, 主要也是看源码也差不多这么写的
