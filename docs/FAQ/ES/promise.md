> 后方高能, 注意! 这里不教你怎么用`Promise`, 是教你怎么写属于自己的`Promise`

## 基本的场景
平常用到`Promise`的时候会觉得很方便, 具体怎么形容大可去看官方的说辞, 这里就以最基本的使用为切入点来入手. 以下的点, 以及一下每一步的操作都是严格按照[`PromiseA+`规范](https://promisesaplus.com/)来操作的
 - 类 (或者纯函数 - 注意this的指向问题)
 - 实例方法/静态方法/原先方法 ()
 - 扩展性 (兼容性)
```js
class Promise {
  constructor(execution) {
		this.value = undefined;
		this.reason = undefined;
		const resolve = value => {
			this.value = value
		}
		const reject = reason => {
			this.reason = reason
		}
		execution(resolve, reject);
	}
}
```

最基本的功能目前是可以使用了, 可以实例化, 可以传参, 由于`Promise`是立即执行函数,所以这里直接执行, 下面再来一步一步的晚上功能.

## 功能项
Well known `Promise` 中 可以传入成功和失败的函数, 根据成功和失败的方法来做下一步操作, 最重要的一点, 需要有一个状态值来判断, 成功了就不能失败, 反之亦然, 其余的状态统称为等待状态.
```js
const PENDING = Symbol.for("PENDING");
const FULFILLED = Symbol.for("FULFILLED");
const REJECTED = Symbol.for("REJECTED");
const resolve = value => {
	if (this.status === FULFILLED) {
		this.value = value;
		this.status = FULFILLED;
	}
};
const reject = ... {}
```
看起来还不错, 接下来难度稍微升级, 都知道`new Promise` 后面可以直接跟上`then`方法, 他也接收两个参数 成功/失败(`onFulfilled, onRejected`)的状态, 依据不同的状态执行不同的方法, 显而易见他是实例上的方法, 先写出来看看.
```js
then(onFulfilled, onRejected) {	
	if(this.status === FULFILLED) {
		onFulfilled(this.value)
	}
	if(this.status === REJECTED){
		...
	}
	if(this.status === PENDING){
		...
	}
}
```

一切看起来似乎都是那么完美, 我们再把难度提高一点, 如果我在`Promise`中返回一个`setTimeout`或者其他任意一个异步操作, 说到这大家应该都懂了吧, 同步异步的问题就不用我多说了吧, 还没等我执行, `Promise`已经跑完了, 所以我们需要在刚刚的`then`中的`PENDING`状态中做一点处理, 在`execution` 中的 成功/失败 (resolve,reject) 中也需要做点处理, 思路简单, 既然等待, 那我就把你`push`到一个数组, 异步完了 我再依次执行,
```js
constructor(){
	this.onResolvedCallBacks = [];
  this.onRejectedCallBacks = [];
	if (this.status === PENDING) {
		this.value = value;
		this.status = FULFILLED;
		this.onResolvedCallBacks.forEach(fn => fn());
	}
	if (this.status === PENDING) {
		this.reason = value;
		this.status = REJECTED;
		this.onRejectedCallBacks.forEach(fn => fn());
	}
}

then(onFulfilled, onRejected) {
this.onResolvedCallBacks.push(() => {
	onFulfilled(this.value);
this.onRejectedCallBacks.push(() => {
	onRejected(this.reason);
}
```

感觉离成功又近了一步有没有, 再来换一个知识点, `jquery` 链式调用 应该都用过吧, 不好意思`then` 之后也可以使用`.` 语法接着调用, 之所以能使用链式调用, 他的核心观念, 就是返回自己, 这样才能在调用自己的方法, 那就好理解了, `then` 直接返回一个`Promise` 似乎是可行的,
```js
then(onFulfilled, onRejected) {
	const promise = new Promise((resolve,reject) => {
		this.onResolvedCallBacks.push(() => {
			onFulfilled(this.value);
		})
		this.onRejectedCallBacks.push(() => {
			onRejected(this.reason);
		})
	})
	return promise;
}
```

好了， 各位萌新 是不是以为到此就结束了, 呵 ！年轻人, 尝试一下回调地狱的恐怖,(你以为使用`Promise`就碰不到了么, 年轻人, 你永远不知道你的用户会怎么使用你写的东西), 有那么一天你的用户在 `Promise`返回值中在使用`Promise` 然后你写的代码就炸了. 这种嵌套类型的最简单的方案就是使用递归来处理. 那就有需要一个方法来判断了.
```js
then(onFulfilled, onRejected) {
	const promise = new Promise((resolve,reject) => {
		this.onResolvedCallBacks.push(() => {
			let x = onFulfilled(this.value);
			resolvePromise(promise, x, resolve, reject)
		})
		...
	})
	return promise;
}

const resolvePromise = (promise, x, resolve, reject) => {
	...
}
``` 
差点忘了, 这里直接将`promise` 这个实例在`resolvePromise`中使用是否可以 ? 哈哈哈, 我还是加上一个异步的定时器来简单处理一下, 只需要将`push`的函数丢到`setTimeout`中既可, 至于原因, 那你得好好了解一下事件环. 这里的重点还是判断`x`的类型. 官方是这么解释的 有两大点 [`e and x refer to the same object, reject promise with a TypeError as the reason.`,`if x is an object or function`](https://promisesaplus.com/), 考验数据类型基本功的时候到了

 - 不能自己返回自己 (自己等待自己的执行)
 - 类型可以是`object`,`function`

```js
	const resolvePromise = (promise, x, resolve, reject) => {
		 if (promise === x) {
			return reject(new TypeError("event noop Promise"));
		}
		if ((typeof x === "object" && x !== null) || typeof x == "function") {
				...
		} else {
			resolve(x);
		}
	}
```
唉！ 架子算是搭出来了, 下面来一步步完善, 可以说这个函数才是`Promise`的核心点, 走到这里基本上可以断定是个正常的 函数或者对象类型, 如果是`Promise` 只需要验证他的`then`方法属性既可, 并且考虑到各大恶心的兼容性, 也要保证 `then`的指向问题, 毕竟数据劫持加属性的方法也不是很少提一嘴`defineProperty`, 罪魁祸首, 
```js
Object.defineProperty({},then,{
	get(){}
	set(){}
})
```
避免其他人的方法污染到自己写的, 有必要做兼容
```js
let then = x.then;
if (typeof then === "function") {
	then.call(
		x,
		y => {
			resolve(y);
		},
		r => {
			reject(r);
		}
	);
} else {
	resolve(x);
}
```

看起来是真的简单, 然而, 你以为就这么结束了? 呵, 年轻人, 我说的不是 `then.call()`完 之后返回的还是`Promise`这么简单, 的确， 这里还得加一个递归判断.
```js
  resolvePromise(promise, y, resolve, reject);
```
我说的不是这个, 有那么一天, 你亲爱的用户, 这么来使用你写的`Promise`.
```js
new Promise().then().then().then()
```
然后你写的代码, 他又崩了, 也不能说是蹦, 只不过返回的东西稍微有那么一丢丢的不同, 幸亏留了一手, 在到`then`的时候就判断一下传入的类型既可
```js
	onFulfilled =
		typeof onFulfilled === "function" ? onFulfilled : value => value;
	onRejected =
		typeof onRejected === "function"
			? onRejected
			: err => {
					throw err;
				};
```
正常函数, ok 接下去执行, 不是的话 那就更好处理, 直接返回即可, 报错那就更好处理了, throw 呗  万能的. 基本上到此为止, 写的算是差不多了, 剩下的就是优化项了.

## 优化项
 - 既然是处理给别人用的库, 那报错提醒是必不可少的, 尤其是取值以及执行操作, 这些都是死的写法, 没少好说的, 举个例子,

```js
//执行时
try {
	execution(resolve, reject);
} catch (error) {
	reject(error);
}
// 取值时
if (this.status === REJECTED) {
	setTimeout(() => {
		try {
			let x = onRejected(this.reason);
			resolvePromise(promise, x, resolve, reject);
		} catch (error) {
			reject(error);
		}
	});
}
...
```

 - 既然提到了兼容, 那又回到了判断`Promise`的话题上, 还是那句话, 就怕别人写的和自己写的冲突, 当然我写的可不会冲突, 毕竟可是按照规范来写的, 也要做一下兼容, 每次都锁定一下值, 下次碰到直接绕过, 说到底还是怕`Object.defineProperty`
```js
let called;
try {
	let then = x.then;
	if (typeof then === "function") {
		then.call(
			x,
			y => {
				if (called) return;
				called = true;
				resolvePromise(promise, y, resolve, reject);
			},
			r => {
				if (called) return;
				called = true;
				reject(r);
			}
		);
	} else {
		resolve(x);
	}
} catch (error) {
	if (called) return;
	called = true;
	reject(error);
    }
```
 - 还有一点是最骚的, 有些用户就是不走平常路`resolve`接着返回`Promise`,你说你能拿他怎么办, 兼容呗， 这个倒不是很难, 繁重你都是同一个`Promise`， 那就判断一下实例就好, 当然`reject`是可以不理会的, 反正是不执行的, 无所谓!
```js
const resolve = value => {
		if (value instanceof Promise) {
			return value.then(resolve, reject);
		}
		if (this.status === PENDING) {
			this.value = value;
			this.status = FULFILLED;
			this.onResolvedCallBacks.forEach(fn => fn());
		}
	};
```

## 补充项
都写到这了,就附赠几个周边函数`all`, `catch`,  `resolve` , `reject`之类的静态方法 以及全部代码
```js
const PENDING = Symbol.for("PENDING");
const FULFILLED = Symbol.for("FULFILLED");
const REJECTED = Symbol.for("REJECTED");
class Promise {
  constructor(execution) {
    this.value = undefined;
    this.reason = undefined;
    this.status = PENDING;
    this.onResolvedCallBacks = [];
    this.onRejectedCallBacks = [];
    const resolve = value => {
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        this.onResolvedCallBacks.forEach(fn => fn());
      }
    };
    const reject = reason => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallBacks.forEach(fn => fn());
      }
    };
    try {
      execution(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : err => {
            throw err;
          };
    const promise = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === PENDING) {
        this.onResolvedCallBacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallBacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });
    return promise;
  }
  catch(onRejected) {
    return this.then(null, onRejected);
	}
	
  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
}

const resolvePromise = (promise, x, resolve, reject) => {
  if (promise === x) {
    return reject(new TypeError("event noop Promise"));
  }
  if ((typeof x === "object" && x !== null) || typeof x == "function") {
    let called;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
};

Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let arr = [];
    let index = 0;
    for (let i = 0; i < promises.length; i++) {
      let promise = promises[i];
      if (isPromise(promise)) {
        promise.then(data => {
          processDate(i, data);
        }, reject);
      } else {
        processDate(i, promise);
      }
    }
    const processDate = (i, promise) => {
      arr[i] = promise;
      if (index++ === promise.length) {
        resolve(arr);
      }
    };
  });
};

const isPromise = promise => {
  if (
    (typeof promise === "object" && promise !== null) ||
    typeof promise === "function"
  ) {
    return typeof promise.then === "function";
  }
  return false;
};

module.exports = Promise;
```

## 测试项
测试是必然的, 别写了大半天， 跑不过测试, 那谁敢用你写的东西,
```js
Promise.deferred = function() {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
```
添加这个倒你的文件就行, 别问, 官方让这么干的, 然后再装一个测试包`promises-aplus-tests` 使用这个命令 加上你的文件名既可. 
至此, 属于自己的乞丐版`Promise`完成.