- ## `instanceof` 内部机制

  假设现在有 `L instanceof R`

  ```javascript
  function instance_of(L, R) {  // L表示左表达式，R表示右表达式
      var O = R.prototype,  // 取R的显式原型
          L = L.__proto__;  // 取L的隐式原型
      while (true) {
      	if (L === null)
              return false;
          if (O === L)  // 这里重点：当O严格等于L时，返回true
              return true;
          L = L.__proto__;
      }
  }
  ```

- ## 理解下面这张图

  ![](https://user-gold-cdn.xitu.io/2018/12/18/167c0772297e4ff8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- ## 你真的了解`instanceOf`操作符吗？

  有了上面`instanceof`运算符的JS代码和原型继承图，再来理解`instanceof`运算符易如反掌。先来看几个`instanceof`复杂用法：

  ```js
  console.log(Object   instanceof Object);  // true
  console.log(Function instanceof Function);// true
  console.log(Number   instanceof Number);  // false
  console.log(String   instanceof String);  // false

  console.log(Function instanceof Object);  // true

  console.log(Foo      instanceof Function);// true
  console.log(Foo      instanceof Foo);     // false
  ```

  - `Object instanceof Object`

    ```js
    // 为了表述清楚，首先区分左侧表达式和右侧表达式
    ObjectL = Object, ObjectR = Object;
    // 下面根据规范逐步推演
    O = Object.prototype = Object.prototype;
    L = Object.__proto__ = Function.prototype;  // 注意这一步
    // 第一次判断
    O != L;
    // 循环查找L是否还有__proto__
    L = Function.prototype.__proto__ = Object.prototype;
    // 第二次判断
    O == L;
    // 返回true
    ```

  - `Function instanceof Function`

    ```js
    // 为了表述清楚，首先区分左侧表达式和右侧表达式
    FunctionL = Function， FunctionR = Function;
    // 下面根据规范逐步推演
    O = FunctionR.prototype = Function.prototype;
    L = FunctionL.__proto__ = Function.prototype;
    // 第一次判断
    O == L;
    // 返回true
    ```

  - `Foo instanceof Foo`

    ```js
    // 为了表述清楚，首先区分左侧表达式和右侧表达式
    FooL = Foo, FooR = Foo;
    // 下面根据规范逐步推演
    O = FooR.prototype = Foo.prototype;
    L = FooL.__proto__ = Function.prototype;
    // 第一次判断
    O != L;
    // 循环查找L是否还有__proto__
    L = Function.prototype.__proto__ = Object.prototype;
    // 第二次判断
    O != L;
    // 再次循环查找L是否还有__proto__
    L = Object.prototype.__proto__ = null;
    // 第三次判断
    L == null
    // 返回false
    ```

- ## 创建对象的方式

  [戳我查看](https://github.com/SanQiG/Front-End-Interview-Summarize/blob/master/JavaScript/%E5%88%9B%E5%BB%BA%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%96%B9%E6%B3%95%E6%B1%87%E6%80%BB.md)

- ## 继承的方式

  [戳我查看](https://github.com/SanQiG/Front-End-Interview-Summarize/blob/master/JavaScript/%E7%BB%A7%E6%89%BF%E7%9A%84%E6%96%B9%E6%B3%95%E6%B1%87%E6%80%BB.md)

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
  > 否则，计算`**obj.toString()**`，如果结果是原始值，则返回此结果；否则，抛出异常。

- ## `var`和 `let` 区别

  1. ES6 可以用let定义块级作用域变量
  2. let配合for循环的独特应用
  3. let没有变量提升和暂时性死区
  4. let变量不能重复声明

- ## `Promise`

  具体看[这里](https://github.com/SanQiG/Front-End-Interview-Summarize/blob/master/JavaScript/Promise.md)

- ## [TODO]事件循环机制

  具体看[这里](https://github.com/SanQiG/Front-End-Summary/blob/master/JavaScript/%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6.md)

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

- ## 类数组转数组

  ```js
  let arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 };
  // 1.slice
  Array.prototype.slice.call(arrayLike);  // ["name", "age", "sex"]
  // 2.splice
  Array.protrotype.splice.call(arrayLike, 0);  // ["name", "age", "sex"]
  // 3.ES6 Array.from
  Array.from(arrayLike);  // ["name", "age", "sex"]
  // 4.apply
  Array.prototype.concat.apply([], arrayLike);  // ["name", "age", "sex"]
  ```

- ## 改写数组的`push`方法，保持原来的逻辑之外，再添加一个`console.log（arguments）`在控制台打印

  ```js
  const push = Array.prototype.push;
  Array.prototype.push = ((val) => {
      console.log(val);
      push.call(this, val);
  })
  ```
  
- ## 哪些操作会导致内存泄漏
  - JS内存泄漏指对象在不需要使用它时仍然存在，导致占用的内存不能够被使用或回收
  - 未使用var声明的全局变量
  - 闭包函数
  - 循环引用（两个对象相互引用）
  - 控制台日志（console.log）
  - 移除存在事件绑定的DOM元素（IE）

- ## JS调用函数有哪几种方式
  - 作为对象的方法调用
  - 函数直接调用
  - 作为构造函数调用
  - 使用call/apply
  - 使用bind

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
  
- ## 实现`bind`

  ```js
  Function.prototype.bind = function(ctx) {
      let self = this;
      let args = Array.prototype.slice.call(arguments, 1);
      
      let fBound = function() {
          let bindArgs = Array.prototype.slice.call(arguments);
          return self.apply(this instanceof fBound ? this : ctx, args.concat(bindArgs));
      }
      
      fBound.prototype = self.prototype;
      return fBound;
  }
  ```

- ## 实现`new`

  1. 首先新建一个对象
  2. 然后将对象的原型指向 `fn.prototype`
  3. 然后 `Person.apply(obj)`
  4. 返回这个对象

  ```javascript
  function New(fn) {
      let res = {};
      res.prototype = fn.prototype;
      
      let ret = fn.apply(res, Array.prototype.slice.call(arguments, 1));
      
      if ((typeof ret == "function" || typeof ret == "object") && ret !== null) {
          return ret;
      }
      
      return res;
  }
  ```
  
- ## 实现浅拷贝和深拷贝

  **浅拷贝的实现**

  ```js
  function shallowCopy(obj) {
      if (typeof obj !== 'object') return;
      let newObj = obj instanceof Array ? [] : {};
      for (let key in obj) {
          if (obj.hasOwnProperty(key)) newObj[key] = obj[key];
      }
      return newObj;
  }
  ```

  **深拷贝的实现**

  ```js
  function deepCopy(obj) {
      if (typeof obj !== 'object') return;
      let newObj = obj instanceof Array ? [] : {};
      for (let key in obj) {
          if (obj.hasOwnProperty(key)) newObj[key] = typeof obj[key] === "object" ? deepCopy(obj[key]) : obj[key];
      }
      return newObj;
  }
  ```

- ## 实现原生 Ajax

  ```javascript
  let request;
  if (window.XMLHttpRequest) request = new XMLHttpRequest();
  else request = new ActiveXObject("Microsoft.XMLHTTP");
  
  request.onreadystatechange = function() {
      if (request.readystate == 4 && request.status == 200) {
          callback(request.responseText);
      }
  }
  
  request.open('GET', url);
  request.send();
  ```

- ## 防抖与节流

  先来讲讲**防抖**：你尽管触发事件，但是我**一定在事件触发n秒后再执行**，如果你在一个事件触发的n秒内又触发了这个事件，那我就以新的事件的事件为标准，n秒后才执行，总之，就是要等你触发完事件n秒内不在触发事件。

  ```javascript
  function debounce(func, wait) {
    let timeout;
    return function() {
      let ctx  = this;
      let args = arguments;

      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(ctx, args);
      }, wait);
    }
  }
  ```

  再在介绍**节流**：如果你持续触发事件，每隔一段时间，只执行一次事件。有两种主流的实现方式，一种是**时间戳**，一种是设置**定时器**。

  ​	*时间戳*

  ```javascript
  function throttle(func, wait) {
    let ctx, args;
    let prev = 0;

    return function() {
      let now = Date.now();
      ctx  = this;
      args = arguments;
      if (now - prev > wait) {
        func.apply(ctx, args);
        prev = now;
      }
    }
  }
  ```

  ​	*定时器*

  ```javascript
  function throttle(func, wait) {
    let ctx, args;
    let timeout;

    return function() {
      ctx  = this;
      args = arguments;
      if (!timeout) {
        timeout = setTimeout(function() {
          timeout = null;
          func.apply(ctx, args);
        }, wait)
      }
    }
  }
  ```

- ## 简述同步和异步的区别

  同步是阻塞模式，异步是非阻塞模式。

  - 同步就是指一个进程在执行某个请求的时候，若该请求需要一段时间才能返回信息，那么这个进程将会一直等待下去，知道收到返回信息才继续执行下去
  - 异步是指进程不需要一直等下去，而是继续执行下面的操作，不管其他进程的状态。当有消息返回时系统会通知进程进行处理，这样可以提高执行的效率。

- ## 线程和进程的区别

  **进程是资源分配的最小单位，而线程是程序代码执行的最小单位。**

  一个程序至少有一个进程，一个进程至少有一个线程。线程的划分尺度小于进程，使得多线程程序的并发性高。另外，进程在执行过程中拥有独立的内存单元，而多个线程共享内存，从而极大地提高了程序的运行效率。线程在执行过程中与进程还是有区别的。每个独立的线程有一个程序运行的入口、顺序执行序列和程序的出口。但是线程不能独立运行，必须依存在应用程序中，由应用程序提供多个线程执行控制。

  从逻辑角度来看，多线程的意义在于一个应用程序中，有多个执行部分可以同时执行。但操作系统并没有将多个线程看做多个独立的应用，来实现进程的调度和管理以及资源分配。
  
- ## 一道面试题引发的思考

  ```js
  const obj = { selector: { to: { toutiao: "FE Coder"} }, target: [1, 2, { name: 'byted'}]};
  
  get(obj, 'selector.to.toutiao', 'target[0]', 'target[2].name');
  // [ 'FE Coder', 1, 'byted']
  ```

  实现一个get函数，使得上面的输出成立。

  首先，可以通过构建一个Function解决这个问题（[Function的详细介绍](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function>)）。

  ```js
  function get(data, ...args) {
      return args.map(item => (new Function('data', `try {return data.${item}} catch(e) {}`))(data));
  }
  ```

  还可以使用正则表达式来进行处理：

  ```js
  function get (data, ...args) {
      return args.map(item => {
          let res = data;
          item.replace(/\[/g, '.')
          	.replace(/\]/g, '')
          	.split('.')
          	.map(path => res = res && res[path]);
          return res;
      })
  }
  ```

  也可以用eval，不过不推荐使用。

  ```js
  function get(data, ...args) {
      return args.map(item => eval('data.' + item));
  }
  ```

- ## 正则实现千位分隔符

  ```js
  let str = "1312567.903000";
  let reg = /(?=(\B\d{3})+\.)/g;
  
  console.log(str.replace(reg, ","));
  ```

  或者

  ```js
  let str = "1312567.903000";
  let reg = str.replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
      return $1 + ',';
  })
  ```

  还可以

  ```js
  let str = 1312567.903000;
  str.toLocaleString();  // 不过这种方法会自动进行四舍五入
  ```
  
- ## 正则实现转换下划线命名法和驼峰命名法

  - 下划线命名法 -> 驼峰命名法

    ```js
    function toHump(str) {
        return str.replace(/\_([a-z])/g, function($0, $1) {
            return $1.toUpperCase();
        })
    }
    ```

  - 驼峰命名法 -> 下划线命名法

    ```js
    function toLine(str) {
        return str.replace(/[A-Z]/g, function($0) {
            return '_' + $0.toLowerCase();
        })
    }
    ```

- ## 下面的代码输出什么？为什么？

  ```js
  Function,prototype.a = 'a';
  Object.prototype.b = 'b';
  function Person() {}
  var p = new Person();
  console.log('p.a: ' + p.a);  // undefined，因为new出来的p是一个对象
  console.log('p.b: ' + p.b);  // b
  ```

- ## 下面的代码输出什么？为什么？

  ```js
  async function async1() {
      console.log("a");
      await async2();
      console.log("b");
  }
  async function async2() {
  	console.log("c");
  }
  console.log("d");
  setTimeout(function () {
      console.log("e");
  }, 0);
  async1();
  new Promise(function (resolve) {
      console.log("f");
      resolve();
  }).then(function () {
      console.log("g");
  });
  console.log("h");
  // d a c f h b g e
  ```

  **`async/await`本质上还是基于`Promise`的一些封装**，而`Promise`是属于微任务的一种。所以在使用`await`关键字与`Promise.then`效果类似：

  ```js
  setTimeout(_ => console.log(5))
  
  async function main() {
  	console.log(1);
      await side();
      console.log(4);
  }
  
  async function side() {
      console.log(2);
  }
  
  main();
  
  console.log(3);
  // 1 2 3 4 5
  ```

  **async函数在await之前的代码都是同步执行的，可以理解为await之前的代码属于`new Promise`时传入的代码，await之后的所有代码都是在`promise.then`中的回调。await后的代码也会立即执行**。
  
- ## 为什么0.1 + 0.2 不等于 0.3 ？

  > 首先我们要知道**JS是如何表示数字的？**

  JS使用Number类型表示数字（整数和浮点数），遵循IEEE 754标准通过64位来表示一个数字，如下图。

  ![](https://user-gold-cdn.xitu.io/2018/9/16/165e0eb7f4d6c50f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

  - 第0位：符号位，0表示正数，1表示负数（s）
  - 第1位到第11位：存储指数部分（e）
  - 第12位到第63位：存储尾数部分（即有效数字f）

  JS最大安全数是**Number.MAX_SAFE_INTEGER == Math.pow(2, 53) - 1，而不是Math.pow(2, 52) - 1，why？尾数部分不是只有52位吗？**

  这是因为二进制表示有效数字总是1.xx...xx的形式，尾数部分f在规约形式下第一位默认为1（省略不写，xx...xx为尾数部分f，最长52位）。因此，JS提供的有效数字最长为53个二进制位（64位浮点的后52位 + 被省略的1位）。

  >  其次我们还要清楚**运算时发生了什么？**

  首先，计算机无法直接对十进制的数字进行运算，这是硬件物理特性已经决定的。这样运算就分成了两个部分：**先按照IEEE 754转成相应的二进制，然后对阶运算。**

  **1. 进制转换**

  0.1 和 0.2 转换成二进制后会无限循环。

  ```js
  0.1 -> 0.0001100110011001...(无限循环)
  0.2 -> 0.0011001100110011...(无限循环)
  ```

  但是由于IEEE 754尾数位限制，需要将后面多余的位截掉。这样在进制转换的时候精度已经损失。

  **2. 对阶运算**

  由于指数位数不相同，运算时需要对阶运算，这部分也可能产生精度损失。按照上面两步运算（包括两步的精度损失），最后的结果是：

  ```js
  0.0100110011001100110011001100110011001100110011001100 
  ```

  转换为十进制结果就是0.30000000000000004。

- ## 用`setTimeout`实现`setInterval`

  ```js
  function mySetInterval(fn, wait, count) {
  	function interval() {
  		if (typeof count == "undefined" || count --> 0) {  // 这里的 --> 其实是先判断count是否大于0，然后再自减一（第一次看到这种写法。。。）
  			setTimeout(interval, wait);
  			try {
  				fn();
  			} catch (e) {
  				count = 0;
          throw e.toString();
  			}
  		}
  	}
  	setTimeout(interval, wait);
  }
  ```

- ## Fetch和Ajax的区别

  - **Ajax**：利用的是XMLHttpRequest对象来请求数据的。

  - **Fetch**：window对象的一个方法，主要特点是：

  1. 第一个参数是URL
  2. 第二个参数可选，可以控制不同的init对象
  3. 使用了es6的promise对象

  ```js
  fetch(url).then(function(response) {
      return response.json();  // 执行成功第一步
  }).then(function(val) {
      // 执行成功第二步
  }).catch(function(err) {
      // 中途任何地方出错都会在这里捕捉到
  })
  ```

  注意：fetch的第二个参数中

  1. 默认的请求为get请求，可以使用`method: post`来进行配置
  2. 第一步中的response有许多方法：`json()`、`text()`、`formData()`
  3. fetch跨域的时候默认不会带cookie，需要手动指定：`credentials: 'include'`

  - **fetch和ajax的主要区别**

  1. 当接收到一个代表错误的HTTP状态码时，从fetch()返回的**Promise不会被标记为reject**，即便该HTTP响应的状态码是404或500。相反，它会将Promise状态标记为resolve（**但是会将resolve的返回值的`ok`属性设置为false**），仅当网络故障时或请求被阻止时，才会标记为reject。
  2. 在默认情况下**fetch不会从服务器端发送或接收任何cookies**。
  
- ## 前端模块化

  [戳我查看](<https://github.com/SanQiG/Front-End-Summary/blob/master/JavaScript/%E6%A8%A1%E5%9D%97%E5%8C%96.md>)
  
  
