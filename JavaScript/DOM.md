- ## DOM 和 BOM 的区别

  - BOM 即**浏览器对象模型**，BOM 没有标准，**BOM的最核心对象是window对象**。window对象为 JavaScript 访问浏览器提供API，同时在ECMAScript中充当Global对象。BOM和浏览器关系密切，浏览器很多东西可以通过JavaScript控制，例如打开窗口、打开选项卡、关闭页面、收藏夹等。
  - DOM 即**文档对象模型**，DOM 是W3C标准，**DOM最根本的对象document（window.document）**，这个对象实际上是window对象的属性，这个对象的独特之处是唯一一个既属于 BOM 又属于 DOM 的对象。DOM和文档有关，这里的文档指的是网页，也就是html文档。DOM和浏览器无关，他关注的是网页本身的内容，由于和浏览器没有多大的关系，所以标准就好定了。
  
- ## DOM 的优缺点

  **优点**

  易用性强，使用DOM时，将把所有XML文档信息都存于内存中，并且遍历简单。

  **缺点**

  效率低，解析速度慢，内存占用量过高，对于大型应用来说几乎不可能使用。另外效率低还表现在大量的消耗时间。

  因为使用DOM解析时，将为文档的每个element、attribute、processing-instruction和comment都创建一个对象。这样在DOM机制中所运用的大量对象的创建和销毁无疑会影响其效率。

- ## 事件委托

  事件委托是指将事件绑定在目标元素的父元素上，利用事件冒泡机制触发该事件。

  优点：

  - 可以减少事件注册，节省大量内存占用
  - 可以将事件应用于动态添加的子元素上

  但使用不当会造成事件在不应该触发时触发。
- ## 如何获取元素位置与宽高

  - element.clientWidth  = content + padding
  - element.clientHeight = content + padding
  - **element.getBoundingClientRect()** 返回值情况
    - left：包围盒左边border以外的边缘距页面左边的距离
    - right：包围盒右边 border 以外的边缘距页面左边的距离
    - top：包围盒上边 border 以外的边缘距页面顶部的距离
    - bottom：包围盒下边 border 以外的便于距页面顶部的距离
    - width：content + padding + border
    - height：content + padding + border
    - 注意，设置外边距时外边距合并的情况

- ## scrollWidth、clientWidth 和 offsetWidth 的区别

  [戳我查看](<https://www.cnblogs.com/kongxianghai/p/4192032.html>)

- ## requestAnimationFrame 原理

  > [MDN文档](<https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame>)、
  > [淘宝前端团队](<http://taobaofed.org/blog/2017/03/02/thinking-in-request-animation-frame/>)

  `window.requestAnimationFrame()`告诉浏览器——你希望执行一个动画，并且要求**浏览器在下次重绘之前调用指定的回调函数更新动画**。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

  > 注意：若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用`window.requestAnimationFrame()`

  当你准备更新动画时你应该调用此方法。这将使浏览器在下一次重绘之前调用你传入给该方法的动画函数（即你的回调函数）。回调函数执行次数通常是每秒60次，但是在大多数遵循W3C建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。为了提高性能和电池寿命，因此在大多数浏览器里，当`requestAnimationFrame()`运行在后台标签页或隐藏的`<iframe>`里时，`requestAnimationFrame()`会被暂停调用以提升性能和电池寿命。

  

  在`requestAnimationFrame()`之前，如果在JS中要实现动画效果，无外乎使用setTimeout 或 setInterval。存在的问题就是：

  - 如何确定正确的时间间隔（浏览器、机器硬件的性能各不相同）？
  - 毫秒不精确性怎么解决？
  - 如何避免过度渲染（渲染频率太高、tab不可见等等）？

  开发者可以用很多方式来减轻这些问题的症状，但是彻底解决，这个、基本、很难。

  归根到底，问题的根源在于**时机**。对于前端开发者来说，setTimeout 和 setInterval 提供的是一个等长的定时器循环（timer loop），但是对于浏览器内核对渲染函数的响应以及何时能够发起下一个动画帧的时机，是完全不了解的。对于浏览器内核来讲，它能够了解发起下一个渲染帧的合适时机，但是对于任何 setTimeout 和 setInterval 传入的回调函数执行，都是一视同仁的，它很难知道哪个回调函数是用于动画渲染的，因此，优化的时机非常难以掌握。悖论就在于，写JavaScript的人了解一帧动画在哪行代码开始，哪行代码结束，却不了解应该何时开始，应该何时结束，而对内核引擎来说，事情却恰恰相反，所以二者很难完美配合，直到`requestAnimationFrame()`出现。

  

  举个栗子：

  ```js
  let box = document.getElementById('box');
  shake(box, 500, 15);
  
  function shake(elm, dur=500, distance=10) {
  	let origin_css = elm.style.cssText;
  	elm.addEventListener("click", ani, false);
  
  	function ani() {
  		let start = null;
  		requestAnimationFrame(act);
  		function act(timestamp) {
  			if (!start) start = timestamp;
  			let progress = timestamp - start;
  			let time_id;
  			if (progress <= dur) {
  				elm.style.transform = 'translateX(' + distance * Math.sin((progress / dur) * 4 * Math.PI) + 'px)';
  				time_id = requestAnimationFrame(act);
  			} else {
  				elm.style.cssText = origin_css;
  				cancelAnimationFrame(time_id);
  			}
  		}
  	}
  }
  ```

- ## 实现元素拖拽

```html
<div id="ball" style="width: 50px; height: 50px; position: absolute; top: 0; left: 0; border: 1px solid #000; border-radius: 50%;">
</div>
```

```javascript
let ball = document.getElementById("ball");
let mouseX = mouseY = undefined,
    sourceX = sourceY = undefined;

function start(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
  sourceX = parseInt(getComputedStyle(e.target, null).left);
  sourceY = parseInt(getComputedStyle(e.target, null).top);
  
  document.addEventListener("mousemove", move, false);
  document.addEventListener("mouseup", end, false);
}

function move(e) {
  let disX = e.pageX - mouseX;
  let disY = e.pageY - mouseY;
  
  ball.style.top = sourceY + disY + "px";
  ball.style.left = sourceX + disX + "px";
}

function end(e) {
  document.removeEventListener("mousemove", move, false);
  document.removeEventListener("mouseup", end, false);
}

ball.addEventListener("mousedown", start, false);
```

- ## 实现图片懒加载

  **原理**：将页面中的 img 标签 `src` 指向一张小图片或者 `src` 为空，然后定义 `data-src` 属性指向真实的图片。`src`指向一张默认的图片，否则当`src`为空时也会向服务器发送一次请求。可以指向`loading`的地址。

  > 图片要指定宽高

  ```html
  <img src="default.jpg" data-src="http://ww4.sinaimg.cn/large/006y8mN6gw1fa5obmqrmvj305k05k3yh.jpg" alt="" />
  <img src="default.jpg" data-src="http://ww4.sinaimg.cn/large/006y8mN6gw1fa5obmqrmvj305k05k3yh.jpg" alt="" />
  <img src="default.jpg" data-src="http://ww4.sinaimg.cn/large/006y8mN6gw1fa5obmqrmvj305k05k3yh.jpg" alt="" />
  <img src="default.jpg" data-src="http://ww4.sinaimg.cn/large/006y8mN6gw1fa5obmqrmvj305k05k3yh.jpg" alt="" />
  <img src="default.jpg" data-src="http://ww4.sinaimg.cn/large/006y8mN6gw1fa5obmqrmvj305k05k3yh.jpg" alt="" />
  <img src="default.jpg" data-src="http://ww4.sinaimg.cn/large/006y8mN6gw1fa5obmqrmvj305k05k3yh.jpg" alt="" />
  <img src="default.jpg" data-src="http://ww4.sinaimg.cn/large/006y8mN6gw1fa5obmqrmvj305k05k3yh.jpg" alt="" />
  <img src="default.jpg" data-src="http://ww4.sinaimg.cn/large/006y8mN6gw1fa5obmqrmvj305k05k3yh.jpg" alt="" />
  <img src="default.jpg" data-src="http://ww4.sinaimg.cn/large/006y8mN6gw1fa5obmqrmvj305k05k3yh.jpg" alt="" />
  <img src="default.jpg" data-src="http://ww4.sinaimg.cn/large/006y8mN6gw1fa5obmqrmvj305k05k3yh.jpg" alt="" />
  ```
  ```css
  img {
    display: block;
    width: 400px;
    height: 400px;
    margin-bottom: 50px;
  }
  ```

  当载入页面时，先把可视区域内的img标签的`data-src`属性值赋给 `src`，然后监听滚动事件，把用户即将看到的图片加载。这样便实现了懒加载。

  ```javascript
  let num = document.getElementsByTagName("img").length;
  let img = document.getElementsByTagName("img");
  let n = 0;  // 存储图片加载到的位置，避免每次都从第一张图片开始遍历
  
  lazyload();  // 页面载入完毕加载可视区域内的图片
  
  window.scroll = throttle(lazyload, 500);
  
  function lazyload() {
    let seeHeight = document.documentElement.clientHeight;  // 可视区域高度
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;  // 滚动条距离顶部高度
    for (let i = n; i < num; ++i) {
      if (img[i].offsetTop < seeHeight + scrollTop) {
        if (img[i].getAttribute("src") == "default.jpg") {
          img[i].src = img[i].getAttribute("data-src");
        }
        n = i + 1;
      }
    }
  }
  
  function throttle(fn, wait) {  // 时间戳节流函数
  	let args, context;
  	let previous = 0;
  	return function() {
  		args = arguments;
  		context = this;
  		let now = Date.now();
  		if (now - previous > wait) {
  			fn.apply(context, args);
  			previous = now;
  		}
  	}	
  }
  ```

- ## 实现一个div滑动的动画，由快至慢 5s 结束（不准用css3)

  ```html
  <div id="box" style="width: 50px; height: 50px; position: absolute; top: 0; left: 0; border: 1px solid #000; border-radius: 50%;"></div>
  ```

  ```javascript
  let box = document.getElementById("box");
  function animate(ele) {
    let start = Date.now();
    let timer = setInterval(function() {
      let timePassed = Date.now() - start;
      if (timePassed >= 5000) {
        clearInterval(timer);
        return;
      } else if (timePassed < 2500) {
        ele.style.left = ele.offsetLeft + 2 + "px";
      } else if (timePassed < 5000) {
        ele.style.left = ele.offsetLeft + 1 + "px";
      }
    }, 1);
  }
  animate(box);
  ```

- ## 封装 getElementById

  ```javascript
  function getelementbyid(node, id) {
    if (!node) return null;
    if (node.id == id) return node;
    for (let i = 0; i < node.children.length; ++i) {
      let found = getelementbyid(node.children[i], id);
      if (found) return found;
    }
    return null;
  }
  ```

- ## 封装 getElementsByTagname

  ```javascript
  let res = []
  function getelementsbytagname(node tagName) {
    if (!node) return null;
  	if (node.tagName.toLowerCase() == tagName) res.push(node);
  	for (let i = 0; i < node.children.length; ++i) {
  		getelementsbytagname(node.children[i], tagName);
  	}
  	return res;
  }
  ```

  

