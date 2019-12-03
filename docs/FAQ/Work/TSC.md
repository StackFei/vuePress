---
title: typescript基础篇 
date: 2019-11-08
tags:
- typescript
---

> typescript有多好用，就不在做过多阐述，理工男是不过理论知识的，直接上硬菜，（高手勿扰）

## 基本类型
- 类型
    - number
    - string
    - boolean
    - undefined
    - null
    - void
    - any

接下来一一的做一下阐述。高手勿喷🙅‍。首先需要做一些简单的配置。安装 `typescript` 当然不一定是全局， 使用 `tsc --init` 生成配置文件。修改其中的 `outDir` 为自己的编译出入文件位置。 启动 `vscode` 中的调试监听模式。
```
npm install typescript -g || yarn install typescript -g
mkdir TypeScript && cd TypeScript
tsc --init

//修改配置文件 tsconfig.json
"outDir": "./index",
```

### string
类型声明字符串类型 `string` ,强制约束类型,一旦了赋值类型与约束类型不符合便会报错,当然报错不意味着不能使用，只是编译会提示语法错误。 划重点, 别用 `const` 声明变量, 后面不允许再覆盖赋值。这里就涉及到 `es6` 中 `let`, `const`, `var` 的区别，不理解的得好好补补基础了。
```typescript
let str:string;
str = "MacBook Air"
str = true    // typeError
str = 123456  // typeError
```
直接赋值 `string` , 类型的是完全OK的, 但直接赋值其他数据类型会提示 `不能将类型“true”分配给类型“string”`。来看看编译成 JS之后是什么样子的。`use strict` 表示严格模式下，可以看出与平常的JS代码无异。
```javascript
"use strict";
var str;
str = "MacBook Air";
```

### number
类型声明字符串类型 `number` ,强制约束类型,只允许接受 `number` 类型。当然也是可以接受 `NaN` 、 `Infinity` 类型，虽然不是代表确定的数值，但只要是数值类型都OK。
```typescript
let num:number;
num = 123456
num = NaN 
num = Infinity 
num = "123456"    // typeError
num = boolean     // typeError
```

### boolean
类型声明字符串类型 `boolean` ,强制约束类型,只允许接受 `boolean` 类型。
```typescript
let num:boolean;
num = true/false   
num = 123456      // typeError
num = "123456"    // typeError
```
### 特殊类型
- void
- undefined
- null

`void` 函数返回值类型，顾名思义, 无返回值, 意为永远没有返回值。但是 返回 `undefined` 、 `null` 就不一样了, 本来就是空值的意思。算的上是语言层次的BUG吧。
```typescript
function App(): void{
    return "" // typeError
    return undefined
    return null
}
```

`undefined` 、 `null` 最为特殊, 可以说是所有类型的一个语法糖，也可以理解为所有类型的子类型。一般类型只要初始了类型，就无法改变赋值类型。但任何类型却可以直接改变成 `undefined` 、 `null` 。这样写是没有任何问题的。
```typescript
let all: string = "123" || 123 || boolean;
all = null
all = undefined
```

### any
`any` 很好理解嘛, 可以使用任意值的意思, 可以说是类型无法判定的救星。
```typescript
let all: any
all = "123"
all = null
all = undefined
...
```
当然也不能到处都是用 `any` , 使用完就不会对做类型检查, 不会提示语法错误, 举一个简单的例子
```typescript
let all: any
all = "123"
console.log(all.length)
all = 123
console.log(all.length)
```
首先, 这种写法是问题的, `number` 类型上本身是没有 `length` 属性的, 但是你声明 `any` 类型，就不会做类型校验, 本该报错却没有报错, 所以要慎用 `any` ,不然就会失去使用 `ts` 的意义。

### 隐式声明/类型推导
这种是最为简单的操作, 也是最像 `javascript` 的操作, 不声明类型的意思等同于声明 `any` 类型的意思, 此处与后面的 `类型推导` 有一些相似之处, 即可以赋值任意类型。
```typescript
let all
all = "123"
all = null
all = undefined
...
```

## 联合类型
没想要声明一种类型, 就要使用一个变量声明, 显示这是不合理的, 所以就要使用联合类型来声明, 顾名思义, 将所有要使用到的类型用 `|` 联合起来使用即可, 这样便可以多种类型同时使用, 当然必须得是声明类型中的一种才可。
```typescript
// 以往
let str1 = string
let str2 = number
let str3 = boolean
*****************************************
let str: string | number | boolean
str = "123"
str = 123
str = true
```

## 类型断言
如果使用上述的联合类型来约束一个函数的返回值参数, 就可以会存在一个问题, 如果 某一个联合类型上的 `api` 另外一个联合类型上没有, 但在函数中却使用到了这个 `api` 显然这样是不可行的。
```typescript
function AppLength(arg: string |  number){
    if(x.length){
        return x.length
    }
    return x.toString().length
}
```
类型断言, 便起到了至关重要的作用, 首先确定写法 `<type>value` 或者 `value as type` ,都可以。当然一定得将其用  `()` 包起来, 接下来我们改造一下上述代码。
```typescript
function AppLength(arg: string |  number){
    if((<string>x).length){
        return (<string>x).length
    }
    // or
    if((x as string).length){
        return (x as string).length
    }
    return x.toString().length
}
```

## 对象类型-接口
- 接口类型
    - 可选参数 `?`
    - 只读参数 `readonly`

定义一个对象/函数，不能只是一个一个的写类型声明来约束, 这样就可以直接使用接口来整体规范类型。使用关键字 `interface` 来吃创建接口实例, 配合上 `?` 、 `readonly` 来综合写一个案例, 看例子。
```typescript
interface IPerson{
    readonly name: string;
    age: number;
    gander?: string
}

const person: IPerson = {
    name: "🚀",
    age: 18,
    gander: "男",
}
```
忽略 `gander` 不填写不会提示报错, 直接修改 `person.name = 🚢` 会提示无法修改 

## 数组类型
数组可以算的上是较为复杂的数据类型, 在JS中你无法判断它其中的参数类型, 在TS中就可以使用数组类型来规范约束, 使用关键字 `type[]`、 `Array<type>` 两种方式来声明约束。后一种方式是广义上的泛型, `Array` 代表中类型站位, 后来跟上的 `type` 就相当于类型约束, 一旦无法确定使用时的类型, 都可以使用 `T<type>` 来约束类型。稍后会在之后的的 `泛型` 中着重讲解。 
```typescript
let type = string | number | boolean | ...
const arr: type[] = ["s", "s", "t"]
const arr: Array<type> = ["s", "s", "t"]
```

## 元组类型
可包含多种类型元素的数组, 与之上的单个数组类型有些不同, 就是一个数组中可包含多种特定类型, 使用前提是你得知道数组中的全部类型, 并且前后顺序不可颠倒, 且不可添加规定之外的类型。
```typescript
let arr: [string | number | boolean] = ["s", 123, true]
let arr: [string | number | boolean] = ["s", true, 123] // Error
arr.push({})  // Error
```

## 函数类型
函数声明方式, 与表达式直接约束类型其实没多大差别, 接下来将几个常用类型结合到函数表达式上来说明.
- 函数声明
- 函数表达式
```typescript
// 函数声明
function fn(n1:string,n2:number):string{return '🔥'}
// 函数表达式
const fn = function (n1:string, n2:number):string{return '🔥'}
or
const fn = (n1:string, n2:number):string => {return '🔥'}
//可选
const fn = (n1:string, n2?:number):string => {return '🔥'}
//默认值
const fn = (n1:string, n2:number = 6):string => {return '🔥'}
//剩余参数
const fn = (n1:string, ...args:type):string => {return '🔥'}
```

## 枚举类型
`enum` 枚举在静态语言中有着不可获取的作用, 简而言之就是默认值, 在一定的限定范围之内。举例说明, 连接数据库时, 需要一个默认枚举属性表示入库时间。
```typescript
enum Time { Date.now }
const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: {
        type: String,
        set(val){
            return require('bcrypt').hashSync(val, 10)
        }
    },
    time: {type: Date, default: time:Time}
})
```

## 类
`class` 类的概念在面向对象中有着举足轻重的地位, 尽管现在不提倡使用类组件, 但用类来约束规范类型也是无法忽略掉的一个门槛。首先对访问修饰符得一字不差的背出来, 其次便是实例与构造的关系。举个简单的例子来说明这些方法。
- class访问修饰符
    - public
    - private
    - protected
- readonly
    - 构造方法赋值一次
- abstract抽象类
    - 拥有抽象方法
    - 不存在实例
```typescript
class My{
    零花钱: number
    public readonly 存款: number
    protected 工资: number
    private 私房钱: number
    constructor(零花钱,存款,工资,私房钱){
        this.零花钱 = 零花钱;
        this.存款 = 存款;
        this.工资 = 工资;
        this.私房钱 = 私房钱;
    }
    HuaQian(){
        return `各种花钱${零花钱,存款,工资,私房钱}`
        this.存款 = `不可以修改${存款}`
    }
}
class GirlFriend extends My{
    HuaQian(){
        return `能花${工资}`;
        return `不能花${私房钱}`
    }
}

abstract class My {
    买房: number
    工作 (){}
    abstract 买车 (){}
}
```
类的各种访问修饰符, 以及抽象类相信看到如上述的方法, 应该可以说是茅塞顿开, 下面只对抽象类做一些简单的说明,首先需要对一下概念有一些了解。
- 实现类: 可以实例化, 有实现方法, 可以随意继承
- 抽象类: 关键字 `abstract` 声明, 内部可存在已实现、未实现的方法, 继承该类, 必须实现该父类的抽象方法
- 实现方法: 可以创建实例的实例化方法, 存在方法体
- 抽象方法: 不可以通过 `new` 关键字实例化, 不存在方法体

## 接口与类
将接口与类结合起来可以创建出复杂的约束, 实际上就是对类进行描述, 对其进行部分抽象, 需要注意的是接口可以存在多个, 但最终的父类只存在一个。
- 一个类继承于一个接口, 并且以关键字 `implements` 实现了接口上的方法, 简称单接口单实现
```typescript
interface A {
    alert(): any
}

class B {}

class C extends B implements A {
    alert(){
        console.log('🍊')
    }
}

class D implements A {
    alert(){
        console.log('🍌')
    }
}
```
- 一个类也可以继承多个接口, 并且以关键字 `implements` 实现了接口上的方法。简称多实现单继承
```typescript
interface A {
    alert(): any
}

interface Log {
    info(): void;
    warning(): void
}

class B implements info, warning {
    alert(){
        console.log('🍇')
    }
    info(){
        console.log('🌰')
    }
    warning(){
        console.log('🍊')
    }
}
```
- 接口之间相互继承, 接口继承接口也是OK的
```typescript
interface A extends B, C {}
```

## 泛型
`<T>` 指定某个函数、接口或者类时, 不预先指定具体类型, 使用时在指定类型的一特性, 例如定义数组, 无法判定数组中究竟会存储哪些元素类型, 使用时才可以确定其中存储哪些元素, 便可以使用; 例如封装约束函数的形参以及返回值时, 无法确定传入的实参以及返回值时, 也可以使用, 举例说明。
```typescript
const MyArray: Array<any> 

function MyArray(length: number, value: any): Array<any> {
    let result = []
    for(let i = 0; i < length; i++){
        return result[i] = value;
    }
}

function MyArray2<T>(length: number, value: T): Array<T> {
    let result: Array<T> = [];
    for(let i = 0; i < length; i++){
        return result[i] = value
    }
}
```
其中的 `MyArray` 与 `MyArray2` 有哪些区别呢? 很明显 `MyArray` 无法确定返回值类型, 直接将函数返回值赋值给另外一个变量会产生报错, `MyArray` 使用使用泛型来填充返回值类型, 直到有返回值时, 才会校验。传入值与返回值一致, 返回值明确。


## 内置对象
众所周知, TS属于JS的一个超集, 属于是包含关系, 都是属于 `ECMAScript` 的集合, 所以JS中的内置对象、内置属性都是可以直接声明的, 但也有一点是需要注意的, 声明内置对象与声明对象可不是一个概念.
```typescript
const bool: boolean = true
const bool: Boolean = new Boolean(1)
const str: string = '🚀'
const str: String = new String('🚀')
const date: Date = new Date()
```
这中相同的写法, 只是大小写不同的赋值声明方法有何区别么? 可以这样写么?答案是否定的。举个简单的例子 `str: string` 需要的是一个字符串类型的, 但 `str: String` 返回的 `new` 却是一个对象类型, 所以平常声明类型的时候一定要注意写法。当然其中的元素类型也是可以直接使用的。简单写几个, 以 `React` 的挂载为例。
```typescript
// 元素
const root: HTMLElement = document.getElement('root') | window.root
// 元素组
const root: NodeList<HTMLElement> = document.querySelectorAll('root')
// 事件对象
const e: MouseEvent => {...}
// fragment
const fragment: DocumentFragment = document.createDocumentFragment()
```

## 声明文件
开发中使用第三方库, 一般都是直接引用别人的声明文件, 例如直接将声明文件中的一个变量暴露出来, 才能获得该库的语法提示, 当然库一般都是使用TS来构建, 所有需要使用同意后缀为 `.d.ts` 的声明文件来来约束, 当你引用该库是, 才能获得良好的TS代码提示。下面实现一个简单的声明文件.
```typescript
// my.d.ts
declare const MyTs: (Customs: Array<any>) => Array<any>;
// my.ts
MyTs(['🚀', '✈️', 1998, true])
```

