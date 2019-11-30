# 常见通信方式
> 又到了日常学习框架组件通信的时候, 讲道理, 还记得曾经看`React`通信就觉得恶心, 因为事实上你根本用不到那么花里胡哨的方式, 一个状态管理就搞定. 现如今我看到`Vue`的组建通信的方式, 更是看白了头, 各种堆`Api`.

**老规矩, 个人学习记录, 不喜勿喷**

## 前置知识
看到这块地方, 相信你已经对大多数`api`以及有了解到, 学到这我算是发现, 怪不得`Vue`上手比`React`快, 就是各种`Api`往上怼, 不是说很熟练, 起码对单向数据流的概念是有认知的, 单向的不陌生吧, 和`React`的操作一个尿性, 就是各种向下传, 向上回传.

## 常见操作
 以下就是几种实现写法上的异同.
 - **<Badge text="props emit"/>**
 - **<Badge text="update:xxx sync v-model"/>**
 - **<Badge text="$parent $children"/>**
 - **<Badge text="$attrs $listeners"/>**
 - **<Badge text="provider inject"/>**
 - **<Badge text="ref"/>**
 - **<Badge text="eventBus"/>**

### 常见小🌰
常见的祖孙三代传递数据的小🌰
```vue
// Parent
<template>
    <Child :price="price" />
</template>
<script>
    components:{Child},
    data(){
        return {price:100}
    }
</script>

// Child
<template>
    <div>{{price}}</div>
</template>
<script>
    props:{
        price:{
            type:Number
        }
    }
</script>
```

 - **以上传值方式, 简单粗暴也没有什么大难度的操作, 下面我们来尝试基本的更改操作, 前置以及说过单向数据, 肯定相差无几.**<Badge text="props emit"/>
```vue
// Parent
<template>
    <Child :price="price" @changePrice="changePrice" />
</template>
<script>
    components:{Child},
    data(){
        return {price:100}
    },
    methods:{
        changePrice(newPrice){
            this.price = newPrice
        }
    }
</script>

// Child
<template>
    <div>{{price}}</div>
    <button @click="addPrice">➕💰</button>
</template>
<script>
    methods:{
        addPrice(){
            this.$emit('changePrice',6666)
        }
    },
    props:{
        price:{
            type:Number
        }
    }
</script>
```
将方法丢到子组件等同于`this.$on('changePrice','changePrice')`, 然后到子组件用`this.$emit('changePrice',value)`, 接收回传调用, 单向数据流都是这么恶心, 只能修改状态源才能出发下流状态更新, 这种方式写那么一两层传那么一两层或许你还觉得没啥, 现在我想给你多加两层传递, 你可能就想轮键盘, 好在人家就是`Api`多, 各种恶性的情况都考虑到了, 如下

 - **穿插几个小的case方法**<Badge text="update:xxx sync v-model"/>

讲道理, 这前面两个真的我就没见人用过, 但是你还必须得会, 你说气不气, 这里过渡一下就行了, 知道有这种方式就行.
```vue
// Parent
<template>
    <Child :count="count" @update:count="newValue => count = newValue"></Child>
    <Child :count.sync="count"></Child>
</template>
// Child
<script>
    methods: {
        sonChange() {
        // parent 必须使用 :count.sync="count"
        this.$emit("update:count", 666);
        },
    }
</script>
```
其中这两种是等价式的操作, 由于第一种方式写的太过于臃肿, 于是乎官方给出了第二种的实现方式, 那我为什么还要学习第一种???, 还是要注意一点`update:`是固定写法, 重点来了, 我会告诉你, 还有更加简单的方法, `v-model`, 但是也有不小的局限性. 先来看看方法.
```vue
<template>
    <Child v-model="count"></Child>
</template>
```
??? 挖槽, 突然回过神, 这个可以双向绑定, 太坑`React`系列了, 又一查, 好像只能接受单值, 不知道对象可以不.
 
 - **多层嵌套传参**<Badge type="warn" text="$parent $children"/>

其实常见的`$parent`,`$children`是足以解决我们的问题, 其实这是属于两种不同的操作, 但是实现的思路是差不多的, 以下是三层嵌套是使用的方法, 我们期望在第三层触发父组件的更新
```vue
<script>
    // Parent
    methods:{
        changePrice(newPrice){
            this.price = newPrice
        }
    }
    // Child
    methods:{
        addPrice(newPrice){
            this.$emit('changePrice',newPrice)
        }
    }
    //ChildSon
    methods:{
        addPrice(){
            this.$parent.$emit('changePrice',6666)
        }
    }
</script>
```
OK, 效果显著, 由于其他代码都一样, 就不做全部展示, 看到这要是还看不懂那就没办法了, 三层貌似也是能接受的, 那我们来四层, 来五层, 来...层？？, 说到这又想轮键盘了, 你这不是闹着玩吗. 

 - **多层嵌套传参升级**<Badge text="$parent"/>

鉴于层级过深问题, 本人过懒问题, 以及`Vue`源码重写数组的问题, 那我们就仿照一下, 直接在`Vue`原型上做点手脚, 在实例上添加一点自己的东西来解决这个问题. 我们期望是自动向上寻找触发源, 直到顶层, **注意：此方式是向上寻找触发源**
```js
// main
Vue.prototype.$parent = function(E,V){
    let parent = this.$parent;
    while(parent){
        parent.$emit(E,V)
        parent = parent.$parent;
    }
}
```
方法还是比较明显的`parent`只需要存储每次找到的有`emit`的值, 循环覆盖, 直到不存在`parent`的顶层. 用法也是极其简单, 因为是直接在原型上扩展, 挂载到`vm`实例上, 所有需要**注意重名问题**, 使用也是调用即可. 由于是自己实现递归操作, 所以不再需要考虑层级问题.
```vue
<script>
    //ChildSon /ChildN
    methods:{
        addPrice(){
            this.$parent('changePrice',6666)
        }
    }
</script>
```

 - **多层嵌套传参升级**<Badge text="$children"/>

目前为止, 我们已经解决了无限嵌套向上寻找触发源的问题, 那么恶心的需求总是有一次以及无数次, 下面我们又有个需求, 我需要在顶层组件触发旗下所有子组件的某个方法, 听起来有点像发布订阅的概念, 及似广播事件, 不过这个实现思路, 倒也是很`$parent`差不多, 好像就是方向不同罢了. 那么再来试试. 既然用法相同无异, 那实现定时无异.
```js
Vue.prototype.$broadscat = function(E,V){
    let children = this.$children
    function boad(children){
        children.forEach(child => {
            child.$emit(E,V)
             // 迭代递归
            if (child.$children) {
                broad(child.$children)
            }
        })
    }
    boad(children)
}
```
也不是很难吧, 就是简单的循环查找, 存在下级就接着找, 触发一切你想要触发的事件, 用法与上无异.
```vue
<script>
    //App
    methods:{
        addPrice(){
            this.$broadscat('changePrice',6666)
        }
    }
</script>
```

 - **多层多参数嵌套传参**<Badge type="warn" text="$attrs $listeners"/>

既然恶心那就恶心到底, 在来一个需求, 同时传入多个**参数/方法**并且, **多层传递**, 场景如下, 第二层组件不使用方法, 第三层才需要使用.
```vue
// Parent
<template>
  <div>
    <Child :price="price" :count="count" @click="eat" @mouseup="eat"></Child>
  </div>
</template>

// Child
<template>
  <div>
    <ChildSon></ChildSon>
  </div>
</template>

// ChildSon
<template>
  <div>
    {{props}}
  </div>
</template>
```
那这不是很简单, `Props`接受一下不就完事了, 没错我也是这么想的, 我在第二层Props拦截接受了一下, 如果在当前页面使用过就发现传递不下去了, 抛开这一点, 就算逐个接受, 也有诸多不便, 难道写一大堆接受方法？ 然后翻遍`Api`发现还有`$Attrs`,`$listeners`这两东西. 

 - **多层多参数嵌套升级传参**<Badge text="$attrs"/>

先来试试同时接受多个属性, 并且传递到下一层
```vue
// Child
<template>
    <ChildSon v-bind="$attrs"></ChildSon>
</template>
// ChildSon
<template>
    {{$attrs}}
</template>
```
完美, 这里需要注意到的是, `$attrs`可以是复合属性, 并且在当前页面直接`$attrs.xxx`都是完全OK, 但是必须得使用`v-bind`来动态绑定, 并且不能简写成`:`

 - **多层多参数嵌套升级传参**<Badge text="$listeners"/>

属性都这样写出来了, 方法必然也是雷同.
```vue
// Child
<template>
    <ChildSon v-bind="$attrs" v-on="$listeners"></ChildSon>
</template>
// ChildSon
<template>
    {{$attrs}}
    <button @click="$listeners.click" @mouseup="$listeners.mouseup">修改</button>
</template>
```
没毛病.

 - **多层多参数嵌套升级传参**<Badge text="provider inject"/>

看了下官方推荐, 不建议使用, 原因是状态混乱, 看到`provider`就让我想到了`React`中的`context`, 一看就是全局包装暴露父组件本身实例, 那就不做过多阐述, 人家都不推荐使用, 想要了解方法的可以直接前往官网查看.

 - **实例获取方法**<Badge text="ref"/>

这个就强了, 直接获取到真实`DOM`的实例来操作, 由于`Vue`是一个实例, 再也不用担心, 会想`React`一样碰到函数式写法,拿不到`this`实例, 这个可以直接操作实例上的方法, 可以说是最简单粗暴的.看用法
```vue
<template>
    <Child ref="son2"></Child>
</template>
<script>
    methods: {
    // 直接通过parent上的ref来获取
    show(){
      alert(3)
    }
  }
</script>
```
简单粗暴, 只需要注意获取真实`DOM`千万不要重名, 不然就会出现覆盖或者找不到实例的情况.

 - **第三者方法**<Badge text="eventBus"/>

听说这个是用的最为常见的, 用法也是`$emit`,`$on`的用法, 和`$parent`,`$children`有些许差异, 这个更像是将转接权交给第三者来转发, 之后就可以在任何组件定义事件源, 在任何组件触发任何事件源, 用起来感觉很舒服, 先根据需求来试试怎么写.
```js
Vue.prototype.$bus = new Vue()
```
很简单有不有, 只需要暴露一个实例即可, 那他的实例上不就有`$emit`触发源以及`$on`绑定源, 不就可以做到任意化,
```vue
<script>
// Parent
  mounted(){
      // eventsBus
      this.$bus.$on("bus",()=>{console.log('bus')})
  },
</script>
<script>
// anyComponent
  mounted(){
    this.$nextTick(()=>{
      this.$bus.$emit('bus')
    })
  }
</script>
```
由于`mounted`的钩子执行顺序的原因, 这里使用`$nextTick`来延迟执行, 等到视图全图挂载完成在执行该方法，看起来似乎并没有什么毛病, 但个人感觉这样会造成很多不必要的更细操作以及数据混乱, 一旦操作复杂就会出现状态丢失问题. 

 - 以上各种使用方法, 个人还是最推荐`props $emit`, 感觉这两个最不会出现问题, 最简单的也是最稳妥的.

