- ## DOM 和 BOM 的区别

  - BOM 即**浏览器对象模型**，BOM 没有标准，**BOM的最核心对象是window对象**。window对象为 JavaScript 访问浏览器提供API，同时在ECMAScript中充当Global对象。BOM和浏览器关系密切，浏览器很多东西可以通过JavaScript控制，例如打开窗口、打开选项卡、关闭页面、收藏夹等。
  - DOM 即**文档对象模型**，DOM 是W3C标准，**DOM最根本的对象document（window.document）**，这个对象实际上是window对象的属性，这个对象的独特之处是唯一一个既属于 BOM 又属于 DOM 的对象。DOM和文档有关，这里的文档指的是网页，也就是html文档。DOM和浏览器无关，他关注的是网页本身的内容，由于和浏览器没有多大的关系，所以标准就好定了。

- ## 事件委托

事件委托是指将事件绑定在目标元素的父元素上，利用事件冒泡机制触发该事件。

优点：

- 可以减少事件注册，节省大量内存占用
- 可以将事件应用于动态添加的子元素上

但使用不当会造成事件在不应该触发时触发。

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

- ## 封装 getElementsByClassname

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

  

