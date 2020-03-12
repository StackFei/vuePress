# 克隆

说起克隆, 可是Javascript基础的一大考察, 恶心的浅引用地址查值, 使得赋值修改变成一大难题, 更具代表性的克隆以`lodash`为首, 其实核心不过就是不可变数据的制造. 下面由浅入深的来一一尝试.

## 浅克隆
既然由浅入深, 就先以浅克隆为基础来实现, 我们有如下代码需求。
```js
const str = "彭雲飛";
const num = 123;
const obj = {
  hobby : 'mac'
}
const arr = [1, 2, 3]
```
- **无脑思路的赋值**
```js
const str1 = str;
const num1 = num;
...
```
的确这样写, 基本类型的值是没问题的, 但是`JavaScript`引用类型的地址存储, 使得直接赋值的是地址, 牵一发而动全身, 前者改变后者跟着改变, 显然不是我们的需求,

- **稍微高级一点的写法**

**Object.assign, restProps<...>**
与上述道理一致, 就不做过多赘述 `Object.assign({},target)`

## 深克隆
- 常用思路 `JSON.parse(JSON.stringify(obj))`
```js
const str = "彭雲飛";
const num = 123;
const obj = {
  hobby : 'mac'
}
const obj1 = JSON.parse(JSON.stringify(obj))
obj1.hobby = 'win'
console.log(obj) // { hobby: 'mac' }
console.log(obj1) // { hobby: 'win' }
```

表面上可以解决我们的上述简单问题, 注意是简单结构, 那如果换成稍微复杂一点的结构, 比如 `函数`, `正则`，`...` 就又不行了, 

举例说明
```js
const obj = {
  obj : obj,
  arr : [1, 2, 3],
  data : new Date,
  fn: function(){},
  boolean: true,
  unf: undefined,
  nul: null,
  reg: new RegExp('/我是一个正则/ig'),
  boolean: true,
}
```

###  一般高手的写法
- 前提
    - 首先空值 自然不必考虑
    - 类系列 直接new一下传入实例
    - 函数系列, 既不是null/类, 指定是函数类型, 无法拷贝, 直接赋值
    - 剩下的无非就是对象/数组, 那就找到他们的构造器
    - 循环嵌套, 那就递归
```js
function deepcopy(value) {
    if (value == null) { return value }
    if (value instanceof RegExp) { return new RegExp(value) }
    if (value instanceof Date) { return new Date(value) }
    if (typeof value !== 'object') { return value }
    let obj = new value.constructor()
    for (let key in value) {
        obj[key] = deepcopy(value[key])
    }
    return obj
}
```

以上动作 一气呵成, 似乎没有什么太大的问题, 可偏偏`JavaScript`的主线程是单线程的, 诸如此类的递归循环引用, 很容易就会出栈, 这里又想到了`ES6`的API`WeakMap`, 合理的存储结构, 可以解决这个难题

- 修改
   - 简而言之, 碰到循环引用第一次记录下值缓存, 而后直接拿出来赋值即可
```js
function deepcopy(value, hash = new WeakMap) {
    if (value == null) { return value }
    if (value instanceof RegExp) { return new RegExp(value) }
    if (value instanceof Date) { return new Date(value) }
    if (typeof value !== 'object') { return value }
    let obj = new value.constructor()
    
    // 如果hash表里面有这个值就不需要走拷贝了
    if (hash.get(value)) {
        return hash.get(value)
    }
    hash.set(value, obj)

    for (let key in value) {
        obj[key] = deepcopy(value[key], hash)
    }
    return obj
}
```

###  终极高手的写法
以上写法其实已经能满足大部分需求, 优秀的搬砖师, 岂能止步于此, 既然都到了`ES10`了, 必然会增加一大堆属性类型, 当时得试试拷贝. 以下实例基本上廊括了JS所有的类型
```js
let obj = {
  bigInt: BigInt(12312),
  set: new Set([2]),
  map: new Map([['a', 22], ['b', 33]]),
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: {
    name: '我是一个对象',
    id: 1
  },
  arr: [0, 1, 2],
  func: function () {
    console.log('我是一个函数')
  },
  date: new Date(0),
  reg: new RegExp('/我是一个正则/ig'),
  [Symbol('1')]: 1,
};
```

循环引用我们可以换一种展现方式, 提高一下难度, 让他变成不可枚举的属性
```js
Object.defineProperty(obj, 'innumerable', {
  enumerable: false,
  value: '不可枚举属性'
});
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))

obj.loop = obj
```

**拆解出大致思路, 分片完成**
- 类类型的, 可以尝试列成映射表
```js
let type = [Date, RegExp, Set, Map, WeakMap, WeakSet]
```
  - 依旧通过`WeakMap`记录引用
```js
hash = new WeakMap()
```
  - 由于部分不可枚举, 需要继承原型上的特性
```js
let allDesc = Object.getOwnPropertyDescriptors(obj);  //遍历传入参数所有键的特性
let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc); //继承原型
```
  - 继承完原型, 得想办法遍历出其特性
```js
Reflect.ownKeys(obj)
```
  - 抽取判定类型的公共方法
```js
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)
```

**组装起来**
```js
const isComplexDataType = obj =>
    (typeof obj === 'object' ||
      typeof obj === 'function') &&
    (obj !== null)

  const deepClone = function (obj, hash = new WeakMap()) {
    if (hash.has(obj)) return hash.get(obj)
    let type = [Date, RegExp, Set, Map, WeakMap, WeakSet]
    if (type.includes(obj.constructor)) return new obj.constructor(obj);
    //如果成环了,参数obj = obj.loop = 最初的obj 会在WeakMap中找到第一次放入的obj提前返回第一次放入WeakMap的cloneObj

    let allDesc = Object.getOwnPropertyDescriptors(obj);  //遍历传入参数所有键的特性
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc); //继承原型
    hash.set(obj, cloneObj)

    for (let key of Reflect.ownKeys(obj)) {   //Reflect.ownKeys(obj)可以拷贝不可枚举属性和符号类型
      // 如果值是引用类型(非函数)则递归调用deepClone
      cloneObj[key] =
        (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ?
          deepClone(obj[key], hash) : obj[key];
    }
    return cloneObj;
```
以上的测试用例, 可以用此测试, 妥妥的.