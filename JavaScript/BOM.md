## Window 对象

## Location 对象

Location接口表示其链接到的对象的位置（URL）。所做的修改反映在与之相关的对象上。`document`和`window`接口都有这样一个链接的Location，分别通过`document.location`和`window.location`访问（引用的是同一个对象）。

| 属性名   | 例子                  | 说明                                 |
| -------- | --------------------- | ------------------------------------ |
| hash     | "#contents"           | 返回URL中的hash（#后跟零或多个字符） |
| host     | "www.wrox.com:80"     | 返回服务器名称和端口号（如果有）     |
| hostname | "www.wrox.com"        | 返回不带端口号的服务器名称           |
| href     | "https:/www.wrox.com" | 返回当前加载页面的完整URL            |
| pathname | "/WileyCDA/"          | 返回URL中的目录和（或）文件名        |
| port     | "8080"                | 返回URL中指定的端口号（如果有）      |
| protocol | "https:"              | 返回页面使用的协议                   |
| search   | "?q=javascript        | 返回URL的查询字符串（以?开头）       |

每次修改location的属性（hash除外），页面都会以新URL重新加载。

### location.assign()

`location.assign(url)`方法会触发窗口加载并显示指定的URL的内容。

### location.replace()

`location.replace(url)`方法以给定的URL来替换当前的资源。与`assign()`方法不同的是调用`replace()`方法后，当前页面不会保存到会话历史中，这样用户点击回退按钮将不会再跳转到该页面。

### location.reload()

`location.reload([forcedReload])`方法用来刷新当前页面。该方法只有一个可选参数，当值为`true`时，将强制浏览器从服务器加载页面资源，否则当值为`false`或者未传参时，浏览器则可能从缓存中读取页面。

## History 对象

History接口允许操作浏览器的曾经在标签页或者框架里访问的会话历史记录。`window.history`是一个只读属性，用来获取History对象的引用。

| 属性名                    | 说明                                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| history.length            | 表示会话历史中元素的数目，包括当前加载的页                                                            |
| history.scrollRestoration | 允许web应用程序在历史导航上显式地设置默认滚动恢复行为，此属性可以是自动的（auto）或者手动的（manual） |
| history.state             | 返回一个表示历史堆栈顶部地状态的值                                                                    |

| 方法名                     | 说明                                            |
| -------------------------- | ----------------------------------------------- |
| history.back()             | 前往上一页，等价于`history.go(-1)`              |
| history.forward()          | 前往下一页，等价于`history.go(1)`               |
| history.go()               | 通过当前页面的相对位置从浏览器历史记录加载页面  |
| **history.pushState()**    | 按指定的名称和URL将数据push进会话历史栈         |
| **history.replaceState()** | 按指定的数据，名称和URL，更新历史栈上最新的入口 |

### history.pushState()

执行`pushState`函数之后，会往浏览器的历史记录中添加一条新记录，同时改变地址栏的地址内容。它可以接收三个参数，按顺序分别为：

1. 状态对象——一个对象或者字符串，用于描述新记录的一些特性。这个参数会被一并添加到历史记录中，以供以后使用。这个参数是开发者根据自己的需要自由给出的。无论什么时候用户导航到新的状态，popstate事件就会被触发，且该事件的state属性包含该历史条目状态对象的副本。
2. 标题——一个字符串，目前这个参数被忽略，但未来可能会用到。传递一个空字符串在这里是安全的，而在将来这是不安全的。二选一的话，你可以为跳转的state传递一个短标题。
3. URL——一个字符串，该参数定义了新的历史URL记录。

```javascript
var state = {
	id: 2,
	name: 'profile'
};
window.history.pushState(state, "My Profile", "/profile/");
```

当用户点击浏览器的「前进」、「后退」按钮时，就会触发`popstate`事件。你可以监听这一事件，从而作出反应。

```javascript
window.addEventListener("popstate", function(e) {
	var state = e.state;
	// do something...
}, false);
```

这里的`e.state`就是当初`pushState`时传入的第一个参数。

### history.replaceState()

`history.replaceState()` 的使用与 `history.pushState()` 非常相似，区别在于 `replaceState()`是修改了当前的历史记录项而不是新建一个。

## Navigator 对象

## Screen 对象
