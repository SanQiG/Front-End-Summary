# 浏览器的渲染过程与原理

## 1、关键渲染路径

**关键渲染路径(Critical Rendering Path)** 是指与当前用户操作有关的内容。例如用户刚刚打开一个页面，首屏的显示就是当前用户操作相关的内容，具体就是浏览器接收到HTML、CSS 和 JavaScript 等资源并对其进行处理从而渲染出 Web 页面。

了解浏览器渲染的过程与原理，很大程度上是为了**优化关键渲染路径**，但优化应该是针对具体问题的解决方案，所以优化没有一定之规。例如为了保障**首屏内容**的最快速显示，通常会提到渐进式页面渲染，但是为了**渐进式页面渲染**，就需要做资源的拆分，那么以什么粒度拆分、要不要拆分，不同页面、不同场景策略不同。具体方案的确定既要考虑体验问题，也要考虑工程问题。

## 2、浏览器渲染页面的过程

![](https://user-images.githubusercontent.com/25027560/46640050-6420ad80-cb9c-11e8-991f-4f039e0eb4a9.png)

1. 处理 HTML 标记并构建 DOM 树
2. 处理 CSS 标记并构建 CSSOM 树
3. 将 DOM 和 CSSOM 合并成一个渲染树
4. 根据渲染树来布局，以计算每个结点的几何信息
5. 调用 GPU 绘制，合成图层，显示在屏幕上

这5个步骤**并不一定一次性顺序完成**。如果 DOM 或 CSSOM 被修改，以上过程需要重复执行，这样才能计算出哪些像素需要在屏幕上进行重新渲染。实际页面中，CSS 与 JavaScript 往往会多次修改 DOM 和 CSSOM，下面就介绍它们的影响方式。

## 3、阻塞渲染：CSS 与 JavaScript

谈论资源的阻塞时，我们要清楚，现代浏览器总是并行加载资源。例如，当HTML解析器（HTML Parser）被脚本阻塞时，解析器虽然会停止构建DOM，但**仍会识别该脚本后面的资源，并进行预加载**。

同时，由于下面两点：

**`1. 默认情况下，CSS 被视为阻塞渲染的资源，这意味着浏览器将不会渲染任何已处理的内容，直至 CSSOM 构建完毕。`**

**`2. JavaScript不仅可以读取和修改 DOM 属性，还可以读取和修改 CSSOM 属性。`**

存在阻塞的 CSS 资源时，浏览器会延迟 JavaScript 的执行和 DOM 的构建。另外：

**`1. 当浏览器遇到一个 script 标记时，DOM 构建将暂停，直至脚本完成执行。`**

**`2. JavaScript 可以查询和修改 DOM 与 CSSOM。`**

**`3. CSSOM 构建时，JavaScript 执行将暂停，直至 CSSOM 就绪。`**

所以，script 标签的位置很重要。实际使用时，可以遵循下面两个原则：

**`1. CSS 优先：引入顺序上，CSS 资源先于 JavaScript 资源。`**

**`2. JavaScript 应尽量少影响 DOM 的构建。`**

浏览器的发展日益加快，具体的渲染策略会不断进化，但了解这些原理后，就能想通它进化的逻辑。下面来看看 CSS 与 JavaScript 具体会怎样阻塞资源。

***

### CSS

```html
<style> p { color: red; } </style>
<link rel="stylesheet" href="index.css">
```

这样的 link 标签会被视为阻塞渲染的资源，浏览器会优先处理这些 CSS 资源，直至 CSSOM 构建完毕。

渲染树（Render-Tree）的关键渲染路径中，要求同时具有 DOM 和 CSSOM，之后才会构建渲染树。即，HTML 和 CSS 都是阻塞渲染的资源。HTML 显然是必需的，因为包括我们希望显示的文本在内的内容，都在 DOM 中存放，那么可以从 CSS 上想办法。

最容易想到的当然是**精简 CSS 并尽快提供它**。除此之外，还可以用媒体类型和媒体查询来解除对渲染的阻塞。

```html
<link href="index.css" rel="stylesheet">
<link href="print.css" rel="stylesheet" media="print">
<link href="other.css" rel="stylesheet" media="(min-width: 30em) and (orientation: landscape)">
```

- 第一个资源会加载并阻塞
- 第二个资源设置了媒体类型，会加载但不会阻塞，print 声明只在打印网页时使用
- 第三个资源提供了媒体查询，会在符合条件时阻塞渲染

***

### JavaScript

```html
<p>Do not go gentle into that good night,</p>
<script>console.log("inline")</script>
<p>Old age should burn and rave at close of day;</p>
<script src="app.js"></script>
<p>Rage, rage against the dying of the light.</p>

<p>Do not go gentle into that good night,</p>
<script src="app.js"></script>
<p>Old age should burn and rave at close of day;</p>
<script>console.log("inline")</script>
<p>Rage, rage against the dying of the light.</p>
```

这样的 script 标签会阻塞 HTML 解析，无论是不是 inline-script。上面的 p 标签会从上到下解析，这个过程会被两段 JavaScript 分别打断一次（加载、执行）。

所以实际工程中，我们常常将资源放到文档底部。

### 改变阻塞模式：defer 与 async

为什么要将 script 加载的 defer 与 async 方式放到后面呢？因为这两种方式的出现，全是由于前面讲的那些阻塞条件的存在。换句话说，defer 与 async 方式可以改变之前的那些阻塞情形。

首先，注意 async 与 defer 属性对于 inline-script 都是无效的，所以下面这个示例中三个 script 标签的代码会从上到下依次执行。

```html
<script async>
	console.log('1');
</script>
<script defer>
	console.log('2');
</script>
<script>
	console.log('3');
</script>
```

所以，defer 与 async 都是针对设置了 src 属性的 script 标签。

![](http://images2018.cnblogs.com/blog/1414709/201808/1414709-20180822191511672-1951871802.png)

### defer

```html
<script src='app1.js' defer></script>
<script src='app2.js' defer></script>
<script src='app3.js' defer></script>
```

defer 属性表示延迟执行引入的 JavaScript，即这段 JavaScript 加载时**HTML 并未停止解析**，这两个过程是并行的。整个 document 解析完毕且 defer-script 也加载完成之后（这两件事情的顺序无关），会执行所有由 defer-script 加载 JavaScript 代码，然后触发 DOMContentLoaded 事件。

defer 不会改变 script 中代码的执行顺序，示例代码会按照1、2、3的顺序执行。所以，defer 与普通 script 相比，有两点区别：

1. 载入 JavaScript 文件时不阻塞 HTML 的解析
2. 执行阶段被放到 HTML 标签解析完成之后

### async

```html
<script src='app.js' async></script>
<script src='ad.js' async></script>
<script src='statistics.js' async></script>
```

async 属性表示异步执行引入的 JavaScript，与 defer 的区别在于，如果已经加载好，就会开始执行——无论此刻是 HTML 解析阶段还是 DOMContentLoaded 触发之后。需要注意的是，这种方法加载的 JavaScript 依然会阻塞 load 事件。换句话说，async-script 可能在 DOMContentLoaded 触发之前或之后执行，但一定在 load 触发之前执行。

从上一段也能推出，多个 async-script 的执行顺序是不确定的。值得注意的是，向 document 动态添加 script 标签时，async 属性默认是 true。

### document.createElement

使用 `document.createElement` 创建的 script 默认是异步的，示例如下。

```js
console.log(document.createElement("script").async);  // true
```

所以，通过动态添加 script 标签引入 JavaScript 文件默认是不会阻塞页面的。如果想同步执行，需要将 async 属性手动设置为 false。

### document.write 与 innerHTML

通过 `document.write` 添加的 link 或 script 标签都相当于在 document 中添加的标签，因为它操作的是 document stream（所以对于 loaded 状态的页面使用 `document.write` 会自动调用 `document.open`，这会覆盖原有文档内容）。即正常情况下，link 会阻塞渲染，script 会同步执行。不过这是不推荐的方式，chrome 已经会显示警告，提示未来有可能禁止这样的引入。如果给这种方式引入的 script 添加 async 属性，chrome 会检查是否同源，对于非同源的 async-script 是不允许这样引入的。

如果使用 innerHTML 引入 script 标签，其中的 JavaScript 不会执行。当然，可以通过 `eval()` 来手动处理，不过不推荐。如果引入 link 标签，我试验过在 chrome 中是可以起作用的。

> [【译】理解关键渲染路径](https://wufenfen.github.io/2017/03/13/%E3%80%90%E8%AF%91%E3%80%91%E7%90%86%E8%A7%A3%E5%85%B3%E9%94%AE%E6%B8%B2%E6%9F%93%E8%B7%AF%E5%BE%84/)
