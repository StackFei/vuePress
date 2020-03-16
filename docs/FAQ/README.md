
<el-divider content-position="left">功能性函数</el-divider>

  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;序列化树结构](#m1)
  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;列表控制最大并发数](#m2)
  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;按列表顺序请求](#m3)
  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;防抖](#m4)
  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;节流](#m5)
  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;反转字符串编码问题](#m6)

<el-divider content-position="left">零散点</el-divider>

  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;继承问题](#j1)
  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;发布订阅/观察者](#j2)

<el-divider content-position="left">Polyfill</el-divider>

  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;Call/Apply/Bind](#g1)
  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;_flat](#g2)
  - [<i class="el-icon-paperclip"></i>&nbsp;&nbsp;&nbsp;_reduce](#g3)

## 零散点

<div id="j1"></div>

- 继承问题
```js
function Person (money) {this.money = money}
Person.prototype.getMoney = () => console.log(this.money)

function Son (my_money) {
  Person.call(this, money);
  this.my_money = my_money
}
Son.prototype.getMoney = () => console.log(this.my_money)

Son.prototype = Object.create(Person.prototype, {
  constructor: {
    value: Son
  }
})

const son = new Son(1000)
console.log(son instanceof Son);
console.log(son instanceof Person);
```

<div id="j2"></div>

- 发布订阅/观察者
```js
const fs = require('fs')
// 发布订阅
const event = {
  arr: [],
  on(fn) { this.arr.push(fn) },
  emit() { this.arr.forEach(f => f()) }
}
const obj = {};
e.on(() => console.log('订阅'))
e.on(() => Object.keys(obj).length === 2, console.log('over'))

fs.readFile('.', (e, d) => obj['0'] = d, e.emit())
fs.readFile('.', (e, d) => obj['1'] = d, e.emit())
// 订阅  订阅  订阅  over

// 观察者
class Sub {
  constructor(name) {
    this.name = name;
    this.arr = [];
    this.status = false
  }
  attach = (target) => this.arr.push(target)
  setStatus =
    (newValue) =>
      (
        this.status = newValue,
        this.arr.forEach(f => f.up(newValue))
      )
}

class Obe {
  constructor(name) {
    this.name = name
  }
  up(v) {
    console.log(this.name, '知道了改变成了', v)
  }
}

const s1 = new Sub('憨憨');
const o1 = new Obe('憨憨一号');
const o2 = new Obe('憨憨二号');
s1.attach(o1)
s1.attach(o2)
s1.setStatus(true)
// 憨憨一号知道了改变成了true   憨憨二号知道了改变成了true
```

## Polyfill

<div id="g1"></div>

- Call/Apply/Bind
```js
{
  Function.prototype.call = function (target, ...args) {
    const context = target;
    const fn = Symbol();
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
  }
  Function.prototype.apply = function (target, args) {
    const context = target;
    const fn = Symbol();
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
  }

  function test(test1, test2) {
    console.log(this.a + test1 + test2)
  }
  const testObj = { a: 1 }
  test.apply(testObj, [1, 2])

   ~(function (prototype) {
    prototype.bind = function (context, ...outerArgs) {
      let thatFunc = this;
      let fBound = function (...innerArgs) {
        return thatFunc.apply(
          this instanceof thatFunc ? this : context,
          [...outerArgs, ...innerArgs]
        )
      }
      fBound.prototype = Object.create(thatFunc.prototype)
      return fBound;
    }
  })(Function.prototype);
}
```

<div id="g2"></div>

-  _flat
```js
{
  Array.prototype.flat = function (...args) {
    const result = [];
    const _this = this;
    console.log(args)
    function _flat(targetArr) {
      let targetLength = targetArr.length
      for (let i = 0; i < targetLength; i++) {
        const item = targetArr[i];
        if (Array.isArray(item)) {
          _flat(item)
        } else {
          result.push(item)
        }
      }
    }
    _flat(_this);
    return result;
  }
  const arr = [[1], [2, 3, 4], [5, 6, [7, [8]]], 9];
  const result = arr.flat(1, 2, 3);
  console.log(result)
}
```

<div id="g3"></div>

- _reduce
```js
{
  Array.prototype.reduce = function (callback, prev) {
    for (let i = 0; i < this.length; i++) {
      if (typeof prev === 'undefined') {
        prev = callback(this[i], this[i + 1], i + 1, this);
        i++;
      } else {
        prev = callback(prev, this[i], i, this)
      }
    }
    return prev;
  }
  const r = [1, 2, 3, 4].reduce((a, b, i, r) => {
    return a + b
  }, 1);
  console.log(r)
}
```


---

## 功能性函数

<div id="m1"></div>

- 序列化树结构

```js
{
  const nest = (items, id = null, link = 'parent_id') =>
    items
      .filter(item => item[link] === id)
      .map(item => ({ ...item, children: nest(items, item.id) }))

  const obj = [
    { id: 1, parent_id: null },
    { id: 2, parent_id: 1 },
    { id: 3, parent_id: 1 },
    { id: 4, parent_id: 2 },
    { id: 5, parent_id: 4 },
  ]
  const newNest = nest(obj);
  console.log(JSON.stringify(newNest, null, 2))
}
```

<div id="m2"></div>

- 控制最大并发数 

```js
{
  class MaxNum {
    constructor(max) {
      this._max = max;
      this.maxTarget = [];
    }
    take(task) {
      if (this._max > 0) {
        this._max--;
        task();
      } else {
        this.maxTarget.push(task)
      }
    }
    leave() {
      this._max++;
      const task = this.maxTarget.shift();
      if (task)
        this.take();
    }
  }
  const max = new MaxNum(2);
  console.time("default")
  max.take(() => max.leave(), 1000);
  max.take(() => max.leave(), 2000);
  max.take(() => {
    max.leave();
    console.timeEnd('default')
  }, 3000);
}
```

<div id="m3"></div>

- 顺序请求

```js
  const parentSort = (target) => {
    Promise.all(target.map(item => new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', item);
      xhr.responseType = 'json';
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(xhr.response)
          }
        }
      }
      xhr.send();
    }))).then(res => {
      console.log(res)
    })
  }

  const paintOrder = (target) => {
    const result = [];
    let count = 0;
    target.forEach((item, index) => {
      sendRequest(item, index)
    });
    function sendRequest(item, index) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', item);
      xhr.responseType = 'json';
      xhr.onreadystatechange = function (event) {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            result[index] = event.target.response;
            count++;
            if (count === target.length) {
              console.log(result)
            }
          }
        } else {
          result[index] = event.statusText;
          count++;
          if (count === target.length) {
            console.log(result)
          }
        }
      }
      xhr.send();
    }
  }
```

<div id="m4"></div>

-  防抖

```js
const debounce = (func, wait = 50) => {
  // 缓存一个定时器id
  let timer = 0
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
```

<div id="m5"></div>

- 节流

```js
const throttle = (func, wait = 50) => {
  // 上一次执行该函数的时间
  let lastTime = 0
  return function (...args) {
    // 当前时间
    let now = +new Date()
    // 将当前时间和上一次执行函数时间对比
    // 如果差值大于设置的等待时间就执行函数
    if (now - lastTime > wait) {
      lastTime = now
      func.apply(this, args)
    }
  }
}
```

<div id="m6"></div>

- 反转字符串编码问题
```js
const str = '头跟翻会🦊舞跳会🐒小树上会🐘笨大';

// 常规操作
str.split('').reverse()
["大", "笨", "�", "�", "会", "上", "树", "小", "�", "�", "会", "跳", "舞", "�", "�", "会", "翻", "跟", "头"]

// 解决字符串乱码问题
Array.from(str).reverse()
["大", "笨", "🐘", "会", "上", "树", "小", "🐒", "会", "跳", "舞", "🦊", "会", "翻", "跟", "头"]

归根到底, 汉字编码问题
```

<Vssue title="Vssue Demo" :options="{ locale: 'zh' }"/>