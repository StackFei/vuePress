---
title: 📌 整理笔记与君共勉
date: 2019-12-02
tags:
- FAQ
- 测试
---

## Polyfill

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
## 功能性函数

-  序列化树结构
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

<!-- <ClientOnly>
  <Demo/> 
</ClientOnly> -->