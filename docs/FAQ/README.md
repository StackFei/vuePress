---
title: 📌 整理笔记与君共勉
date: 2019-12-02
tags:
- FAQ
- 测试
---

## Call/Apply
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

## _flat
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

<!-- <ClientOnly>
  <Demo/> 
</ClientOnly> -->