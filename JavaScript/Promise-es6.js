(function(window) {
  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'

  class Promise {
    constructor(executor) {
      const self = this
      self.status = PENDING
      self.value = undefined
      self.callbacksQueue = []

      const resolve = (value) => {
        if (self.status !== PENDING) return

        self.status = RESOLVED
        self.data = value

        setTimeout(() => {
          self.callbacksQueue.length && self.callbacksQueue.forEach((obj) => {
            obj.onResolved(value)
          })
        })
      }

      const reject = (reason) => {
        if (self.status !== PENDING) return

        self.status = REJECTED
        self.data = reason

        setTimeout(() => {
          self.callbacksQueue.length && self.callbacksQueue.forEach((obj) => {
            obj.onRejected(reason)
          })
        })
      }

      try {
        executor(resolve, reject)
      } catch (err) {
        reject(err)
      }
    }

    then(onResolved, onRejected) {
      onResolved = typeof onResolved === 'function' ? onResolved : (value) => value
      onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { throw reason }

      const self = this

      return new Promise((resolve, reject) => {

        const handle = (callback) => {
          try {
            const result = callback(self.data)

            if (result instanceof Promise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          } catch (err) {
            reject(err)
          }
        }

        if (self.status === PENDING) {
          self.callbacksQueue.push({
            onResolved() {
              handle(onResolved)
            },
            onRejected() {
              handle(onRejected)
            }
          })
        } else if (self.status === RESOLVED) {
          setTimeout(() => {
            handle(onResolved)
          })
        } else if (self.status === REJECTED) {
          setTimeout(() => {
            handle(onRejected)
          })
        }
      })
    }

    catch(onRejected) {
      return this.then(undefined, onRejected)
    }

    static resolve(value) {
      return new Promise((resolve, reject) => {
        if (value instanceof Promise) {
          value.then(resolve, reject)
        } else {
          resolve(value)
        }
      })
    }

    static reject(reason) {
      return new Promise((resolve, reject) => {
        reject(reason)
      })
    }

    static all(promises) {
      return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
          return reject(new TypeError('Aruguments must be an array'))
        }

        const promiseNum = promises.length
        const resolvedValues = new Array(promiseNum)
        let promiseCounter = 0

        promises.forEach((p, index) => {
          Promise.resolve(p).then((value) => {
            ++promiseCounter
            resolvedValues[index] = value

            if (promiseCounter === promiseNum) {
              resolve(resolvedValues)
            }
          }).catch(reject)
        })
      })
    }

    static race(promises) {
      return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
          return reject(new TypeError('Aruguments must be an array'))
        }

        promises.forEach((p) => {
          Promise.resolve(p).then(resolve, reject)
        })
      })
    }

    static resolveDelay(value, time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (value instanceof Promise) {
            value.then(resolve, reject)
          } else {
            resolve(value)
          }
        }, time)
      })
    }

    static rejectDelay(reason, time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(reason)
        }, time)
      })
    }
  }

  window.myPromise = Promise

})(window)
