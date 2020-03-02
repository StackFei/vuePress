---
title: 📌 整理笔记与君共勉
date: 2019-12-02
tags:
- FAQ
- 测试
---

## Polyfill

- Call/Apply
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

<!-- <ClientOnly>
  <Demo/> 
</ClientOnly> -->