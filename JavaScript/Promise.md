# 1. Promise 定义

首先，Promise 是异步编程的一种解决方案。**所谓 Promise，简单来说就像一个容器，里面保存着某个未来才会结束的事件的结果**。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理，让开发者不用再关注时序和底层的结果。Promise 的状态具有不受外界影响和不可逆两个特点。

# 2. Promise 常用API

- **Promise.resolve**

  1. **参数是一个 Promise 实例**
     不做任何修改，原封不动地返回这个实例。
  2. **参数是一个 thenable 对象（具有 then 方法的对象）**
     将这个的对象转为 Promise 对象，然后立即执行对象的 then 方法。
  3. **参数不是具有 then 方法的对象或根本不是对象**
     返回一个新的 Promise 对象，状态为 Resolved。
  4. **不带有任何参数**
     直接返回一个 Resolved 状态的 Promise 对象。

- **Promise.reject**

  Promise.reject 方法的参数会原封不动地作为 reject 的理由变成后续方法的参数。

- **Promise.prototype.then**

  为 Promise 实例添加状态改变时的回调函数。第一个参数是 Resolved 状态的回调函数，第二个参数是 Rejected 状态的回调函数。then 中的函数一定要 return 一个结果或一个新的 Promise 对象，才可以让之后的 then 回调接收。

- **Promise.prototype.catch**

  用于指定发生错误时的回调函数。

  **!!! catch 与 then 的第二个参数的区别是如果在 then 的第一个函数里抛出了异常，后面的 catch 能捕获到，而第二个函数捕获不到。**

- **Promise.all**

  多个 Promise 任务并行执行。如果全部成功执行，则以数组的方式返回所有 Promise 任务的执行结果；如果有一个 Promise 任务 rejected，则只返回 rejected 任务的结果。

- **Promise.race**

  多个 Promise 任务并行执行。返回最先执行结束的 Promise 任务的结果，不管这个 Promise 结果是成功还是失败。

# 3. Promise 几个关键问题

## 3.1 改变 Promise 状态的三种方式

- resolve(value)：如果当前是 pending 就会变为 resolved
- reject(reason)：如果当前是 pending 就会变为 rejected
- 抛出异常：如果当前是 pending 就会变为 rejected

## 3.2 一个 Promimse 指定多个成功/失败回调函数，都会调用吗？

```js
const p = new Promise((resolve, reject) => {
  resolve(1)
})

p.then(value => console.log('1', value))

p.then(value => console.log('2', value))
```

此时输出为：

```js
1 1
2 1
```

因此，当 Promise 改变为对应状态时所定义的所有回调函数都会被调用。

## 3.3 改变 Promise 状态和指定回调函数谁先谁后？

都有可能。正常情况是先指定回调函数再改变状态，但也可以先改变状态再指定回调函数。

- 先指定回调再改变状态

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
}).then(value => {
  console.log(value)
})
```

- 先改状态再指定回调

```js
// 1. 在执行器中直接调用 resolve()/reject()
new Promise((resolve, reject) => {
  resolve(1)
}).then(value => {
  console.log(value)
})

// 2. 延迟更长时间再调用 then
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
})

setTimeout(() => {
  p.then(value => {
    console.log(value)
  })
}, 1100)
```

如果先指定的回调，那么当状态发生改变时，回调函数就会调用，得到数据；

如果先改变的状态，那么当指定回调函数时，回调函数就会被调用，得到数据。

## 3.4 Promise.then 返回的新 Promise 的结果状态由什么决定？

1. 简单表达：由 then 指定的回调函数执行的结果决定；
2. 详细表达：
   - 如果抛出异常，新 Promise 变为 rejected，reason 为抛出的异常；
   - 如果返回的是非 Promise 的任意值，新 Promise 变为 resolved，value 为返回的值；
   - 如果返回的是另一个新 Promise，此 Promise 的结果就会成为新 Promise 的结果。

```js
new Promise((resolve, reject) => {
  resolve(1)
}).then(value => {
  console.log('onResolved1', value)
  throw 2
  // return 2
  // return Promsie.resolve(2)
  // return Promsie.reject(2)
}, reason => {
  console.log('onRejected1', reason)
}).then(value => {
  console.log('onResolved2', value)
}, reason => {
  console.log('onRejected2', reason)
})
```

## 3.5 Promise 如何串联多个操作任务？

1. Promise 的 then 方法返回一个新的 Promise，可以写成 then 的链式调用
2. 通过 then 的链式调用串联多个同步/异步任务

## 3.6 Promise 异常穿透？

当使用 Promise 的 then 链式调用时，可以在最后指定失败的回调，前面的任何操作出了异常，都会传到最后失败的回调函数中处理。

## 3.7 中断 Promise 链？

当使用 Promise 的 then 链式调用时，如果想在中间中断，不再调用后面的回调函数，可以在回调函数中返回一个 pendding 状态的 Promise 对象。

# 3. 实现 Promise

[实现Promise(ES5版本)](https://github.com/SanQiG/Front-End-Summary/blob/master/JavaScript/Promise-es5.js)

[实现Promise(ES6版本)](https://github.com/SanQiG/Front-End-Summary/blob/master/JavaScript/Promise-es6.js)

# 4. Promise 和 async/await 的区别

-  在函数前有一个关键字`async`，`await`关键字只能在使用`async`定义的函数中使用。任何一个`async`函数都会隐式返回一个`promise`，并且`promise resolve`的值就是`return`返回的值
- `Promise`中不能自定义使用`try/catch`进行错误捕获，但是在`async/await`中可以像处理同步代码处理错误
- `Promise`代码完全都是`Promise`的API，操作本身的语义反而不容易看出来
- `async/await`函数的实现最简洁，最符合语义，几乎没有不相关的代码
- `async/await`函数就是`Generator`函数的语法糖

