## Object.keys 的排序逻辑

**具体[猛戳这里](https://juejin.im/post/5b593e065188251aff2169f7)**

`Object.keys` 在内部会根据属性名 `key` 的类型进行不同的排序逻辑。分三种情况：

1. 如果属性名的类型是 `Number`，那么 `Object.keys` 返回值是按照 `key` 从小到大排序
2. 如果属性名的类型是 `String`，那么 `Object.keys` 返回值是按照属性被创建的时间升序排序
3. 如果属性名的类型是 `Symbol`，那么逻辑同 `String` 相同

**该排序规则同样适用于：Object.values、Object.entries、for...in、Object.getOwnPropertyNames、Reflect.ownKeys**

## 箭头函数和普通函数的区别

**具体[猛戳这里](<https://www.jianshu.com/p/eca50cc933b7>)**

  1. 不绑定this，箭头函数会捕获其所在上下文的this的值
  2. 使用 call 或 apply 对this没有影响
  3. 不绑定arguments，取而代之用rest参数 ... 解决
  4. 不能使用 new 操作符
  5. 没有原型属性
  6. 不能简单返回对象字面量
    7. 箭头函数在参数和箭头之间不能换行
## for...in 和 for...of 的区别

1. 推荐在循环对象属性的时候使用 for...in，在遍历数组的时候使用 for...of
2. for...in 循环出的是 key，for...of 循环出的是 value
3. 注意，for...of 是ES6新引入的特性。修复了ES5引入的 for...in 的不足
4. for...of 不能循环普通的对象，需要通过和 Object.keys() 搭配使用
5. for...in 不能遍历 Set 和 Map，而 for...of 可以

之所以说 for...of 修复了 for...in 的不足是因为 for...in 除了遍历除了数组元素之外，还会遍历自定义属性

## Set 和 WeakSet 的区别

- Set类似于数组，但是**成员的值都是唯一的**，没有重复。Set本身是一个构造函数，用来生成Set数据结构。

- WeakSet的成员只能是对象，而不能是其他类型的值；

- WeakSet中的对象都是**弱引用**，即垃圾回收机制不考虑WeakSet对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象是否还存在于WeakSet之中。

- WeakSet的成员是不适合引用的，因为它会随时消失。另外，WeakSet内部有多少个成员取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此ES6规定**WeakSet不可遍历**。

## Map 和 WeakMap 的区别

- Map对象是一个简单的键/值映射。任何值都（包括对象和原始值）可以用作一个键或者一个值。

- WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。

- WeakMap的键名是对象的**弱引用**，键名所指向的对象不计入垃圾回收机制。典型的应用是，一个对应的DOM元素的WeakMap结构，当某个DOM元素被清除，其所对应的WeakMap记录就会自动被移除。基本上，WeakMap的专用场合就是，它的键所对应的对象，可能会在将来消失。**WeakMap结构有助于防止内存泄漏**。

## Map 和 Object 的区别

- 一个 Object 的键只能是字符串或者 Symbols，但一个 Map 的键可以是任意值。
- Map 中的键值是有序的（FIFO原则），而添加到对象中的键则不是。
- Map 的键值对个数可以从 size 属性获取，而 Object 的键值对个数只能手动计算。
- Object 都有自己的原型，原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。

## Map 与 Object 之间的相互转换

###  Map => Object

```js
const map = new Map([
  [5, '5'],
  ['a', 'a'],
  [1, '1'],
  ['c', 'c'],
  [3, '3'],
  ['b', 'b']
])

Object.fromEntries(map)
```

### Object => Map

```js
const obj = {
  5: '5',
  a: 'a',
  1: '1',
  c: 'c',
  3: '3',
  b: 'b'
}

new Map(Object.entries(obj))
```

## Map 的迭代

### for...of

```js
var map = new Map()
map.set(0, 'zero')
map.set(1, 'one')

for (var [key, value] of map) {
  console.log(key + ' = ' + value)
}

// 这个 entries 方法返回一个新的 Iterator 对象，它按插入顺序包含了 Map 对象中每个元素的 [key, value] 数组
for (var [key, value] of map.entries()) {
  console.log(key + ' = ' + value)
}

// 这个 keys 返回一个新的 Iterator 对象，它按插入顺序包含了 Map 对象中每个元素的键
for (var key of map.keys()) {
  console.log(key)
}

// 这个 values 返回一个新的 Iterator 对象，它按插入顺序包含了 Map 对象中每个元素的值
for (var value of map.values()) {
	console.log(value)
}
```

### forEach()

```javascript
var map = new Map()
map.set(0, 'zero')
map.set(1, 'one')

map.forEach(function(item, index) {
	console.log(key + ' = ' + value)
}, map)
```

## Map 对象的操作

### Map 与 Array 的转换

```javascript
var kvArray = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']]

// Map 构造函数可以将一个二维键值对数组转换成一个 Map 对象
var map = new Map(kvArray)

// 使用 Array.from 函数可以将一个 Map 对象转换成一个二维键值对数组
var outArray = Array.from(map)
```

### Map 的克隆

```js
var map1 = new Map([['key1', 'value1'], ['key2', 'value2']])
var map2 = new Map(map1)

console.log(map1 === map2)
// 打印 false。Map 对象构造函数生成实例，迭代出新的对象。
```

### Map 的合并

```js
var first = new Map([[1, 'one'], [2, 'two'], [3, 'three']])
var second = new Map([[1, 'uno'], [2, 'dos']])

var merged = new Map([...first, ...second])
```

## undefined 与 null 的区别

**undefined**的语义是表示一个变量自然的、最原始的状态值，而非人为操作的结果。这种原始状态会在以下4中情景中出现：

1. 声明了一个变量，但没有赋值
2. 访问对象上不存在的属性或方法
3. 函数定义了形参，但没有传递实参
4. 使用void对任何表达式求值

**null**表示一个变量被人为的设置为空对象，而不是原始状态。在内存里的表示就是，栈中的变量没有指向堆中的内存对象。

所以在实际使用过程中，为了保证变量所代表的的语义，不要对一个变量显式的赋值为undefined，当需要释放一个对象时，直接赋值为null即可。

## 为什么typeof null返回"object"

原理是不同的对象在底层都表示为二进制，在Javascript中**二进制前三位都为0的话会被判断为Object类型**，null的二进制表示全为0，自然前三位也是0，所以执行typeof时会返回"object"。

## 前端路由实现原理

[猛戳我](https://github.com/SanQiG/Front-End-Summary/blob/master/JavaScript/%E5%89%8D%E7%AB%AF%E8%B7%AF%E7%94%B1%E8%B7%B3%E8%BD%AC%E5%8E%9F%E7%90%86.md)

## 假值列表有哪些？

- `undefined`
- `null`
- `NaN`
- `0`
- `false`
- `''`

## 情景分析题：好比说你从后端拿到了一个对象，它的嵌套层级很深（可能要a.b.c.d.e.f.g）这样引用。但是传输过程中对象可能会损坏，可能a.b的属性c不见了（变成undefined了）。但如果还是像上面这样引用，就会变成向undefined请求属性，从而报错。

> 要求：
> 不能报错，但是需要知道引用链从哪里断开的（上例就是a.b.c）
> 如果引用链断开了，从而没有拿到真实的值，请给出一个默认值

- 方法一：利用try...catch的报错信息

```javascript
function getValueByPath(obj, path) {
	try {
		return (new Function('obj', `return obj.${path}`))(obj);
	} catch (error) {
		error = '' + error;
		let idx1 = error.indexOf("'");
		let idx2 = error.indexOf("'", idx1 + 1);
		
		let brokenString = error.substring(idx1 + 1, idx2);
		let brokenIdx = path.indexOf(brokenString);

		console.log(`chain was broken at obj.${path.substring(0, brokenIdx - 1)}`);
		return undefined;
	}
}
```

- 方法二

```javascript
function getValueByPath(obj, path) {
	var names = path.split('.');
	
	var o = obj;
	var tmpStr = "obj";

	for (var i = 0; i < names.length; ++i) {
		o = o[names[i]];
		tmpStr += `.${names[i]}`;
		if (typeof o === "undefined") {
			console.log(`chain was broken at ${tmpStr}`);
			return undefined;
		}
	}
	return o;
}
```

- 方法三

```javascript
function getValueByPath(obj, path) {
	var reg = /(?:^|\.)(\w+)/g;
	var names = [];
	var name = null;
	while((name = reg.exec(path)) != null) {
		names.push(name[1]);
	}

	var o = obj;
	var tmpStr = "obj";

	for (var i = 0; i < names.length; ++i) {
		o = o[names[i]];
		tmpStr += `.${names[i]}`;
		if (typeof o === "undefined") {
			console.log(`chain was broken at ${tmpStr}`);
			return undefined;
		}
	}
	return o;
}
```

## 获取body里的标签个数

```javascript
document.body.getElementsByTagName("*").length;
```

## 获得标签里的方法
```javascript
let target = document.querySelector('div');
for (let key in target) {
	if (/^on\w+/.test(key) && target[key] !== null) {
		console.log(target[key]);
	}
}
```

## 前端渲染和后端渲染的区别

> 🔎[点击这里](https://www.manster.me/?p=473)

前端渲染：后端的HTML页面作为静态文件存在，前端请求时后端不对该文件做任何内容上的修改，直接以资源的方式返回给前端，前端拿到页面后，根据写在HTML页面上的js代码，对该HTML内容进行修改。

后端渲染：后端的程序在把HTML吐给前端之前，先把HTML页面上的特定区域，特定符号，给用数据填充过，再扔给前端，这就是后端渲染。

前后端渲染本质是一样的，都是字符串的拼接，将数据渲染进一些固定格式的HTML代码中形成最终的HTML展示在用户页面上。

## XML和JSON的区别

- 解码难度：JSON的解码难度远小于XML
- 数据体积：JSON数据体积小，传递的速度比较快
- 数据交互：JSON与JavaScript交互更加方便，更容易解析处理
- 数据描述：XML对数据的描述性更好
- 传输速度：JSON速度远远快于XML

## Ajax的优缺点

> 🔎[点击这里](https://www.cnblogs.com/SanMaoSpace/archive/2013/06/15/3137180.html)

**优点**

1. 无刷新更新数据
2. 异步与服务器通信
3. 前端和后端负载均衡
4. 基于标准被广泛支持
5. 界面与应用分离

**缺点**

1. Ajax干掉了Back和History功能，即对浏览器机制的破坏
2. Ajax的安全问题
3. 对搜索引擎支持较弱
4. 破坏程序的异常处理机制
5. 违背URL和资源定位的初衷
6. Ajax不能很好支持移动设备
7. 客户端过肥，太多客户端代码造成开发上的成本

## Ajax如何携带cookie？

```javascript
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://xxx.com/xxx", true);
xhr.withCredentials = true;  // 支持跨域发送cookies
xhr.send();
```

## Proxy 比 Object.defineProperty() 好在哪儿？

Proxy可以监听对象身上发生了什么，并在这些事情发生后执行一些相应的操作。一下子让我们对一个对象有了很强的追踪能力，同时在数据绑定方面也很有用处。

1. Proxy可以直接监听对象而非属性
2. Proxy可以直接监听数组的变化
3. Proxy有多达13种拦截方法，apply、ownKeys、deleteProperty、has等等是Object.defineProperty()不具备的
4. Proxy返回一个新对象，我们可以只操作新的对象达到目的，而Object.defineProperty()只能遍历对象属性直接修改
5. Proxy作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利
6. Proxy的缺点就是兼容性问题
