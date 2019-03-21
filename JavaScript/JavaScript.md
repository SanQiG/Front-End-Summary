## TODO

#### 	哪些操作会导致内存泄漏



***

- ## `instanceof` 内部机制

  假设现在有 `x instanceof y`

  ```javascript
  while (x.__proto__ !== null) {
      if (x.__proto__ == y.prototype) return true;
      x.__proto__ = x.__proto__.__proto__;
  }
  if (x.__proto__ == null) return false;
  ```

- ## 创建对象的方式

  1. **工厂模式**
  2. **构造函数模式**
  3. **原型模式**
  4. **组合模式**
  5. **寄生构造函数模式**
  6. **稳妥构造函数模式**

- ## 继承的方式

  1. **原型链继承**
  2. **借用构造函数**
  3. **组合继承**
  4. **原型式继承**
  5. **寄生式继承**
  6. **寄生组合式继承**

- ## 一道跟原型动态性有关的题

```js
function F() {}
function O() {}

O.prototype = new F();
var obj = new O();

console.log(obj instanceof O);
console.log(obj instanceof F);
console.log(obj.__proto__ === O.prototype);
console.log(obj.__proto__.__proto__ === F.prototype);
```

​	答案是：`true, true, true, true`

​	接着再来看：
```js
function F() {}
function O() {}

var obj = new O();
O.prototype = new F();

console.log(obj instanceof O);
console.log(obj instanceof F);
console.log(obj.__proto__ === O.prototype);
console.log(obj.__proto__.__proto__ === F.prototype);
```

​	答案完全相反：`false, false, false, false`

​	这里的坑点在于**重写了原型对象!!!**

​	**重写原型对象切断了现有原型与`任何之前已经存在的对象实例`之间的联系，他们引用的仍然是最初的原型。**



- ## 理解下面这张图
  ![](https://user-gold-cdn.xitu.io/2018/12/18/167c0772297e4ff8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- ## JavaScript 中的 `==` 运算符

  ![](https://pic2.zhimg.com/80/0fc2dd69d7f9d4083f347784446b7f0d_hd.png)

  一张图概括如上。（也可参考[这篇文章](<https://zhuanlan.zhihu.com/p/21650547>)）

  转换规则如下：

  - 字符串和数字之间的比较，是将字符串转换为数字
  - 其他类型和布尔类型的比较，是将布尔类型转换为数字
  - 在 `==` 中`null` 和 `undefined` 相等（他们也与自身相等），除此之外其他值都不存在这种情况
  - 对象和非对象之间的比较，调用`ToPrimitive`将对象转换为原始类型，`ToPrimitive`操作规则如下：

  > **`ToPrimitive(obj)`**等价于：先计算**`obj.valueOf()`**，如果为原始值，则返回此结果；
  >
  > 否则，计算**`obj.toString()`**，如果结果是原始值，则返回此结果；否则，抛出异常。

- ## `Promise`

  具体看[这里]()

- ## 事件循环机制

  具体看[这里]()

- ## `this`的指向  

  - 在调用函数时使用`new`关键字，函数内的`this`是一个全新的对象
  - 如果`apply`、`call`或`bind`方法用于调用、创建一个函数，函数内部的`this`就是作为参数传入这些方法的对象
  - 当函数作为对象里的方法被调用时，函数内的`this`是调用该函数的对象。
  - 如果调用函数不符合上述规则，那么`this`的值指向全局对象。非严格模式下，`this`指向`window`对象，但在非严格模式下，`this`的值是`undefined`。
  - 如果符合上述多个规则，则较高的规则（从上到下依次减小）将决定`this`的值
  - 如果函数是箭头函数，将忽略上面的所有规则，`this`被设置为它被创建时的上下文

- ## `for...in` 和 `for...of` 有什么区别？

1. 推荐在循环对象属性的时候使用 `for...in`，在遍历数组的时候使用 `for...of`
2. `for...in` 循环出的是 key，`for...of` 循环出的是 value
3. 注意，`for...of` 是ES6新引入的特性。修复了ES5引入的 `for...in` 的不足
4. `for...of` 不能循环普通的对象，需要通过和 `Object.keys()` 搭配使用

之所以说`for...of`修复了`for...in`的不足是因为`for...in`除了遍历除了数组元素之外，还会遍历自定义属性

- ## 数组扁平化 + 去重

  先来扁平化。

```javascript
function flattern(arr) {
    return arr.reduce((prev, cur) => prev.concat(Array.isArray(cur) ? flattern(cur) : cur), []);
}
```

```javascript
function flattern(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
```

```javascript
function flattern(arr) {
    return arr.toString().split(',').map((item) => +item);
}
```

```javascript
function iterTree(tree) {
    if (Array.isArray(tree)) {
        for (let i = 0; i < tree.length; ++i) {
            yield* iterTree(tree[i]);
        }
    } else {
        yield tree;
    }
}
```

​	再来去重。

```javascript
function unique(arr) {
    return arr.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], []);
}
```

```javascript
function unique(arr) {
    return array.filter((item, index, array) => array.indexOf(item) === index);
}
```

```javascript
function unique(arr) {
    let obj = {};
    return arr.filter((item, index, arr) => {
        return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)] = true);
    })
}
```

​	ES6 的去重方法：

```js
let unique = (arr) => [...new Set(arr)];
```

```js
function unique(arr) {
    let seen = new Map();
    return arr.filter((a) => !seen.has(a) && seen.set(a, 1));
}
```

- ## 实现`call`、`apply`

  ```javascript
  Function.prototype.call = function(context) {
      let context = context || window;
      context.fn = this;
      
      let args = [];
      for (let i = 1; i < arguments.length; ++i) {
          args.push('arguments[' + i + ']');
      }
      
      let result = eval('context.fn(' + args + ')');
      
      delete context.fn;
      return result;
  }
  ```

  ```javascript
  Function.prototype.apply = function(context, arr) {
      let context = context || window;
      context.fn = this;
      
      let result;
      if (!arr) {
          result = context.fn();
      } else {
          let args = [];
          for (let i = 0, len = arr.length; i < len; ++i) {
              args.push('arr[' + i + ']');
          }
          result = eval('context.fn(' + args + ')');
      }
      delete context.fn;
      return result;
  }
  ```

- ## 实现`new`

  1. 首先新建一个对象
  2. 然后将对象的原型指向 `fn.prototype`
  3. 然后 `Person.apply(obj)`
  4. 返回这个对象

  ```javascript
  function New(fn) {
      let obj = {};
      obj.prototype = fn.prototype;
      
      let ret = fn.apply(obj, Array.prototype.slice.call(arguments, 1));
      
      if ((typeof ret == "function" || typeof ret == "object") && ret !== null) {
          return ret;
      }
      
      return res;
  }
  ```

- ## 防抖与节流

  先来讲讲**防抖**：你尽管触发事件，但是我**一定在事件触发n秒后再执行**，如果你在一个事件触发的n秒内又触发了这个事件，那我就以新的事件的事件为标准，n秒后才执行，总之，就是要等你触发完事件n秒内不在触发事件。

  ```javascript
  function debounce(func, wait) {
      let timeout;
      return function() {
  		let context = this;
          let args = arguments;
          
          clearTimeout(timout);
          timeout = setTimeout(function() {
              func.apply(context, args);
          }, wait);
      }
  }
  ```

  再在介绍**节流**：如果你持续触发事件，每隔一段时间，只执行一次事件。有两种主流的实现方式，一种是**时间戳**，一种是设置**定时器**。

  ​	*时间戳*
  ```javascript
  function throttle(func, wait) {
      let context, args;
      let previous = 0;
      
      return function() {
          let now = +new Date();
          context = this;
          args = arguments;
          if (now - previous > wait) {
              func.apply(context, args);
              previous = now;
          }
      }
  }
  ```

  ​	*定时器*

    ```javascript
  function throttle(func, wait) {
      let timeout;
      let previous = 0;
      
      return function() {
  		context = this;
          args = arguments;
          if (!timeout) {
              timeout = setTimeout(function() {
                  timeout = null;
                  func.apply(context, args);
              }, wait)
          }
      }
  }
    ```