# Promise

## 1、什么是`Promise`？

首先，`Promise` 是异步编程的一种解决方案。**所谓 `Promise`，简单来说就像一个容器，里面保存着某个未来才会结束的事件的结果**。从语法上说，`Promise` 是一个对象，从它可以获取异步操作的消息。`Promise` 提供统一的API，各种异步操作都可以用同样的方法进行处理，让开发者不用再关注时序和底层的结果。`Promise` 的状态具有不受外界影响和不可逆两个特点。

## 2、`Promise`常用API

- **`Promise.resolve()`**

  1. **参数是一个 `Promise` 实例**
     不做任何修改，原封不动地返回这个实例。
  2. **参数是一个 `thenable` 对象（具有 `then` 方法的对象）**
     将这个的对象转为 `Promise` 对象，然后立即执行对象的 `then` 方法。
  3. **参数不是具有 `then` 方法的对象或根本不是对象**
     返回一个新的 `Promise` 对象，状态为 `Resolved`。
  4. **不带有任何参数**
     直接返回一个 `Resolved` 状态的 `Promise` 对象。

- **`Promise.reject()`**

  `Promise.reject()`方法的参数会原封不动地作为 `reject` 的理由变成后续方法的参数。

- **`Promise.prototype.then()`**

  为`Promise`实例添加状态改变时的回调函数。第一个参数是 `Resolved`状态的回调函数，第二个参数是`Rejected` 状态的回调函数。`then`中的函数一定要return一个结果或一个新的`Promise`对象，才可以让之后的`then`回调接收。

- **`Promise.prototype.catch()`**

  用于指定发生错误时的回调函数。

  **!!! `catch` 与 `then`的第二个参数的区别是如果在`then`的第一个函数里抛出了异常，后面的`catch`能捕获到，而第二个函数捕获不到。**

- **`Promise.all()`**

  多个`Promise`任务并行执行。如果全部成功执行，则以数组的方式返回所有`Promise`任务的执行结果；如果有一个`Promise`任务 `rejected`，则只返回 `rejected `任务的结果。

- **`Promise.race()`**

  多个`Promise`任务并行执行。返回最先执行结束的 `Promise` 任务的结果，不管这个 `Promise` 结果是成功还是失败。

## 3、实现一个`Promise`

```javascript
function Promise(executor) {
    let self = this;
    self.value  = undefined;
    self.reason = undefined;
    self.status = "pending";
    
    self.onFullFilledCallbacks = [];
    self.onRejectedCallbacks = [];
    
    function resolve(value) {
        if (self.status == "pending") {
            self.value  = value;
            self.status = "resolved";
            
            self.onFullFilledCallbacks.forEach(onFulFilled => onFulFilled());
        }
    }
    
    function reject(reason) {
        if (self.status == "pending") {
            self.reason = reason;
            self.status = "rejected";
            
            self.onRejectedCallbacks.forEach(onRejected => onRejected());
        }
    }
    
    try {
        executor(resolve, reject);
    } catch (error) {
        reject(error);
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    let p2Resolve, p2Reject;
    let p2 = new promise((resolve, reject) => {
        p2Resolve = resolve;
        p2Reject  = reject;
    })
    if (this.status == "pending") {
        this.onFullFilledCallbacks.push(() => {
            onFulfilled(this.value);
            p2Resolve();
        });
        this.onRejectedCallbacks.push(() => {
            onRejected(this.reason);
            p2Reject();
        });
    } else if (this.status == "resolved") {
        onFulfilled(this.value);
        p2Resolve();
    } else if (this.status == "rejected") {
        onRejected(this.reason);
        p2Reject();
    }
    
    return p2;
}
```

## 4、实现一个`Promise.all()`

```javascript
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) return reject(new TypeError("arguments must be an array"));
        let promiseCounter = 0,
            promiseNum = promises.length,
            resolvedValues = new Array(promiseNum);
        for (let i = 0; i < promiseNum; ++i) {
            (function(i) {
                Promise.resolve(promises[i]).then((value) => {
                    ++promiseCounter;
                    resolvedValues[i] = value;
                    if (promiseCounter == promiseNum) return resolve(resolvedValues);
                }).catch((error) => reject(error));
            })(i)
        }
    })
}
```

## 5、`Promise` 和 `async/await` 的区别

-  在函数前有一个关键字`async`，`await`关键字只能在使用`async`定义的函数中使用。任何一个`async`函数都会隐式返回一个`promise`，并且`promise resolve`的值就是`return`返回的值
- `Promise`中不能自定义使用`try/catch`进行错误捕获，但是在`async/await`中可以像处理同步代码处理错误
- `Promise`代码完全都是`Promise`的API，操作本身的语义反而不容易看出来
- `async/await`函数的实现最简洁，最符合语义，几乎没有不相关的代码
- `async/await`函数就是`Generator`函数的语法糖

