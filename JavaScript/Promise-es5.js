(function(window) {
  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'

  /**
   * Promise 构造函数
   * @param {Function} executor 
   * @return {Promise} 
   */
  function Promise(executor) {
    var self = this
    self.status = PENDING // 给 Promise 对象指定 status 属性，初始值为 pending
    self.value = undefined // 给 Promise 对象指定一个用于存储结果数据的属性
    self.callbacksQueue = [] // 每个元素的结构：{ onResolved() {}, onRejected() {} }

    function resolve(value) {
      if (self.status !== PENDING) return

      // 将状态改为 resolved
      self.status = RESOLVED

      // 保存 value 数据
      self.data = value

      // 如果有待执行的 callback 函数，立即异步执行回调函数
      setTimeout(function() { // 放入队列中执行所有成功的回调
        self.callbacksQueue.length && self.callbacksQueue.forEach(function(obj) {
          obj.onResolved(value)
        })
      })
    }

    function reject(reason) {
      if (self.status !== PENDING) return

      // 将状态改为 rejected
      self.status = REJECTED

      // 保存 value 数据
      self.data = reason

      // 如果有待执行的 callback 函数，立即异步执行回调函数
      setTimeout(function() {
        self.callbacksQueue.length && self.callbacksQueue.forEach(function(obj) {
          obj.onRejected(reason)
        })
      })
    }

    // 立即同步执行 excutor
    try {
      executor(resolve, reject)
    } catch(err) {
      reject(err)
    }
  }

  /**
   * Promise 原型对象的 then 方法，指定成功和失败的回调函数，返回一个新的 Promise 对象
   * 返回的 Promise 的结果由 onResolved/onRejected 执行结果决定
   * @param {Function} onResolved
   * @param {Function} onRejected 
   * @return {Promise} 
   */
  Promise.prototype.then = function (onResolved, onRejected) {
    
    // 指定默认的成功回调
    onResolved = typeof onResolved === 'function' ? onResolved : function (value) { return value } // 向后传递成功的 value
    // 指定默认的失败回调（实现异常穿透的关键步骤）
    onRejected = typeof onRejected === 'function' ? onRejected : function (reason) { throw reason } // 向后传递失败的 reason

    var self = this

    // 返回一个新的 Promise 对象
    return new Promise(function (resolve, reject) {

      // ⭐️调用指定的回调函数处理，根据执行结果，改变 return 的 Promise 的状态
      function handle(callback) {
        /**
         * 1. 如果抛出异常，return 的 Promise 就会失败，reason 就是 error
         * 2. 如果回调函数返回的不是 Promise，return 的 Promise 就会成功，value 就是返回的值
         * 3. 如果回调函数返回的是 Promise，return 的 Promise 结果就是这个 Promise 的结果
         */
        try {
          var result = callback(self.data)

          // 情况 3
          if (result instanceof Promise) {
            result.then(function (value) {
              resolve(value) // 当 result 成功时，return 的新 Promise 也成功
            }, function (reason) {
              reject(reason) // 当 result 失败时，return 的新 Promise 也失败
            })

            // 这个代码块里的内容也可直接写为：
            // result.then(resolve, reject)
          } else {
            // 情况 2
            resolve(result)
          }
        } catch (err) {
          // 情况 1
          reject(err)
        }
      }

      // 当前状态是 Pending 状态，将回调函数保存起来
      if (self.status === PENDING) {
        self.callbacksQueue.push({
          onResolved (value) {
            handle(onResolved)
          },
          onRejected (reason) {
            handle(onRejected)
          }
        })
      } else if (self.status === RESOLVED) {
        // 当前状态是 Resolved 状态，异步地执行 onResolved 回调函数并改变 return 的 Promise 的状态
        setTimeout(function() {
          handle(onResolved)
        })
      } else if (self.status === REJECTED) {
        // 当前状态是 Rejected 状态，异步地执行 onRejected 回调函数并改变 return 的 Promise 的状态
        setTimeout(function() {
          handle(onRejected)
        })
      }
    })
  }

  /**
   * Promise 原型对象的 catch 方法，指定失败的回调函数，返回一个新的 Promise 对象
   * @param {Function} onRejected 
   * @return {Promise} 
   */
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }

  /**
   * Promise 函数对象的 resolve 方法，返回一个指定结果的成功的 Promise 对象
   * @param {} value 
   * @return {Promise} 
   */
  Promise.resolve = function (value) {
    // 返回一个成功或失败的 Promise
    return new Promise(function(resolve, reject) {
      // value 是 Promise => 使用 value 的结果作为 Promise 的结果
      if (value instanceof Promise) {
        value.then(resolve, reject)
      } else { // value 不是 Promise => Promise 变为成功，数据是 value
        resolve(value)
      }
    })
  }

  /**
   * Promise 函数对象的 reject 方法，返回一个指定结果的失败的 Promise 对象
   * @param {} reason 
   * @return {Promise} 
   */
  Promise.reject = function (reason) {
    return new Promise(function(resolve, reject) {
      reject(reason)
    })
  }

  /**
   * Promise 函数对象的 all 方法，返回一个 Promise，只有当所有 Promise 都成功时才成功，否则只要有一个失败的就失败
   * @param {Array} promises
   * @return {Array} 
   */
  Promise.all = function (promises) {
    return new Promise(function(resolve, reject) {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Aruguments must be an array'))
      }

      const promiseNum = promises.length
      const resolvedValues = new Array(promiseNum)
      let promiseCounter = 0

      // 遍历 Promises 获取每个 Promise 的结果
      promises.forEach(function(p, index) {
        Promise.resolve(p).then(function(value) {
          ++promiseCounter
          resolvedValues[index] = value

          if (promiseCounter === promiseNum) {
            resolve(resolvedValues)
          }
        }).catch(reject)
      })
    })
  }

  /**
   * Promise 函数对象的 race 方法，返回一个 Promise，其结果由第一个完成的 Promise 决定
   * @param {Array} promises
   * @return {Promise} 
   */
  Promise.race = function (promises) {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Aruguments must be an array'))
    }

    return new Promise(function(resolve, reject) {
      promises.forEach(function(p) {
        Promise.resolve(p).then(resolve, reject)
      })
    })
  }

  /**
   * 返回一个 Promise 对象，在指定的时间后才成功
   * @param {} value
   * @param {Number} time
   * @return {Promise}
   */
  Promise.resolveDelay = function (value, time) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        if (value instanceof Promise) {
          value.then(resolve, reject)
        } else {
          resolve(value)
        }
      }, time)
    })
  }

  /**
   * 返回一个 Promise 对象，在指定的时间后才失败
   * @param {} reason
   * @param {Number} time
   * @return {Promise}
   */
  Promise.rejectDelay = function (reason, time) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(reason)
      }, time)
    })
  }

  window.myPromise = Promise
})(window)
