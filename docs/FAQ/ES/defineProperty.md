# Object.defineProperty

> 说到`Object.defineProperty`可能都觉得自己很了解, 他不就是将对象劫持, 监听其值的变化, 不约而同的就会说到 `Vue`就是利用这个`Api`实现数据的响应式

**先划重点（之所以改变数组中的某些位置的值会触发监听, 是受制于数组在内存中按顺序存储的结构, 所以第一次只能监听到初始化的数组, 即原有内存地址的改变）**

- 按层级划分理解
  - 能监听对象的改变, 不能监听数组的改变 
  - 能监听数组的改变, 不能监听数组的`length`的改变
  - 能监听`length`的改变, 无法动态监听新增数组
  - **监听的成效取决于是否存在于原数组的内存地址上**
## 基本用法
基本的监听对象的改变,并作出其他操作
```js
const obj = { name: 1 }

const observer = data => {
  Object.keys(data).forEach(key => {
    defineReactive(data, key, data[key]);
  })
}

const defineReactive = (data,key, value) => {
  Object.defineProperty(data, key, {
    get(){
      console.log(`获取到了${key}---${value}`)
      return value
    },
    set(newValue) {
      console.log(`设置了${key}---${value}`)
      value = newValue
    }
  })
}
observer(obj)
obj.name = 100
console.log(obj.name);

// 设置了name---1
// 获取到了name---100
// 100
```
以上是基本用法, 看起来一点毛病都没有

## 监听数组

还是以上的代码, 只是把目标值改为数组
```js
const arr = [1, 2, 3];
...
observer(arr)
```

### 灵魂第一问 `arr.push(4)`
以上会被监听到么, 这个时候肯定会有人说, 这个简单,`defineProperty`不会监听到数组的长度变化, 所以不会监听到
```js
observer(arr)
arr.push(4)
console.log(arr)

// [ [Getter/Setter], [Getter/Setter], [Getter/Setter], 4 ]
```

### 灵魂第二问 `arr.pop`
以上会被监听到么, 由以上的说法, `defineProperty`肯定是能监听到数组长度的变化, 那这个肯定会被监听到
```js
observer(arr)
arr.pop()
console.log(arr)

// 获取到了2---3
// [ [Getter/Setter], [Getter/Setter] ]
```

### 灵魂第三问 先`arr.push(4)` 再 `arr.pop`

先别着急回答, 这个你得好好琢磨琢磨, 这`arr.push(4)`不会别监听到, 这`arr.pop`会被监听到, 这组合在一起到底会不会被监听到, 别着急。 先看结果
```js
observer(arr)
arr.push(4)
arr.pop()
console.log(arr)

// [ [Getter/Setter], [Getter/Setter], [Getter/Setter] ]
```

❓！！！！ 这 ,  是不是颠覆了某些人的三观, 没反应。 别着急, 接着往下面看

### 灵魂第四问 `arr.unshift(4)`
结果上述的问题, 这个应该不难吧, 你这往数组前面插, 指定会被监听到
```js
observer(arr)
arr.unshift(0)
console.log(arr)

// 获取到了2---3
// ...
// 设置了0---1
// [ [Getter/Setter], [Getter/Setter], [Getter/Setter], 3 ]
```

结果是让你猜对啦, 但是这最终改变过后的`arr`似乎有点不对劲, `[1, 2, 3]`-->`[0, 1, 2, 3]`, 这前面几个都有`get/set`, 新增之后原有的`3`却被挤了出来, 没有原有的监听方法, **记住arr最后的输出结果** 别着急, 接着往后看

### 灵魂第五问 `arr.shift()`
这个应该不难吧, 从头去除一个, 他的结果和`pop`不一样,
```js
observer(arr)
arr.shift()
console.log(arr)

// 获取到了0---1
// ...
// 设置了1---2
// [ [Getter/Setter], [Getter/Setter] ]
``` 

### 灵魂第六问 先`arr.unshift(0)` 再 `arr.shift`
都做到这了,我相信这个组合已经难不倒大多数人, 还不能确定的话, 你得好好的反思一下了
```js
observer(arr)
arr.unshift(0)
arr.shift()
console.log(arr)

// 获取到了2---3
// ...
// 设置了2---2
// [ [Getter/Setter], [Getter/Setter], [Getter/Setter] ]
```
没错, 大多数人, 应该都是没问题的, 此时的`arr = [1, 2, 3]`,接下来我们在来尝试一个组合, 相信就应该能看出规律来了,

### 灵魂终极问 先`arr.unshift(0)` 再 `arr.pop`
屏住呼吸, 先不看答案, 好好地思考结果, 结合之前的规律, 
```js
observer(arr)
arr.unshift(0)
arr.pop()
console.log(arr)

// 获取到了2---3
// 获取到了1---2
// 设置了2---3
// 获取到了0---1
// 设置了1---2
// 设置了0---1
// [ [Getter/Setter], [Getter/Setter], [Getter/Setter] ]
```
首先说明, 这里所有的触发都是`arr.unshift(0)`触发的, 至于为什么, 不妨先看看改变之后的`arr`的结果是`arr = [0, 1, 2]`

看到这里, 有没有恍然大悟, 茅塞顿开的感觉 ???? 

### 总结
  `Object.defineProperty`是可以监听到数组的改变的, 注意这里的数组改变的原有数组的原有内存地址的改变才可以, 如果向前插入一个, 所有的数组向后移, 原有的内存地址还是之前的, 只不过数据向后移. 导致最后一个无法被监听到, **注意都是监听原有内存地址** 


