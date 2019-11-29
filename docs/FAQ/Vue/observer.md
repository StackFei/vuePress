# 初识Vue工作原理
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

### 举例说明
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
data.hobby.one = "888";
```
然后这样就会发现, 修改`hobby`中的属性, 然并卵, 没什么变化, 细思极恐. 