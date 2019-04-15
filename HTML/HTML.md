## HTML5 为什么只需要写`<!DOCTYPE HTML>`

HTML5不基于SGML，因此不需要对DTD进行引用，但是需要doctype来规范浏览器的行为。

而HTML4.01基于SGML，所以需要对DTD进行引用，才能告知浏览器文档所使用的文档类型。

## src 和 href 的区别

href是指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，用于超链接。

src是指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求src资源时会将其指向的资源下载并应用到文档内，例如js脚本，img图片和frame等元素。当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也是如此，类似于将所指向资源嵌入当前标签内。这也是为什么将js脚本放在底部而不是头部。

## 使用meta标签禁用缓存

浏览器禁止缓存的headers如下：

```html
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

## attribute和property的区别

**attribute**

1. **attribute由HTML来定义，并不存在于DOM中，即：只要是HTML标签内定义的都是attribute**。

   ```html
   <div id="test" class="button" custom-attr="1"></div>
   ```

   ```javascript
   document.getElementById("test").attributes;
   // 返回：[custom-attr="1" class="button" id="test"]
   ```

2. **attribute是String类型**。对于上面的div，`document.getElementById('test').getAttribute('custom-attr')`会返回string："1"。

**property**

1. **property属于DOM，DOM的本质就是JavaScript中的一个Object。我们可以像操作普通object一样读取、设置property，property可以是任意类型**。

   ```javascript
   document.getElementById("test").foo = 1;  // 设置property：foo为number: 1
   document.getElementById("test").foo;  // 读取property，返回number: 1
   ```

2. **非自定义attribute，如id、class、title等，都会有对应的property映射**。

   ```html
   <div id="test" class="button" foo="1"></div>
   ```

   ```js
   document.getElementById("test").id;  // 返回string："test"
   document.getElementById("test").className;  // 返回string："button"
   document.getElementById("test").foo;  // 返回undefined，因为foo是自定义attribute
   ```

   注：由于**class**为JavaScript的保留关键字，所以通过property操作class时应使用**className**。

3. **非自定义的property或attribute的变化多数是联动的**。

   ```html
   <div id="test" class="button"></div>
   ```

   ```js
   var div = document.getElementById("test");
   div.className = "red-input";
   div.getAttribute("class");  // 返回string："red-input"
   div.setAttribute("class", "green-input");
   div.className;  // 返回string："green-input"
   ```

4. **带有默认值的attribute不随property变化而变化**。

   ```html
   <input id="search" value="foo" />
   ```

   ```js
   var input = document.getElementById('search');
   input.value = "foo2";
   input.getAttribute("value");  // 返回string："foo"
   ```
   
