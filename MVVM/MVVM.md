## MVVM

![MVVM](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015020110.png)

MVVM是`Model-View-ViewModel`的缩写。MVVM是一种设计思想。Model层代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑；View代表UI组件，它负责将数据模型转换成UI展现出来，ViewModel是一个同步View和Model的对象。

在MVVM架构下，View和Model之间并没有直接的联系，而是通过ViewModel进行交互，Model和ViewModel之间的交互是双向的，因此View数据的变化会同步到Model中，而Model数据的变化也会立即反应到View上。

ViewModel通过**双向数据绑定**把View层和Model层连接了起来，而View和Model之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全由MVVM来统一管理。

## MVVM和MVC的区别？

![MVC](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015020105.png)

MVC也是一种设计思想，主要就是MVC中的Controlled演变成MVVM中的ViewModel。MVVM主要解决了MVC中大量的DOM操作是页面渲染性能降低，加载速度变慢，影响用户体验。和当Model频繁发送变化，开发者需要主动更新到View。

## 数据的双向绑定

![数据的双向绑定](https://user-gold-cdn.xitu.io/2018/10/23/166a031209fc8da5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

利用`Object.defineProperty()`对数据进行劫持，设置一个监听器`Observer`，用来监听所有属性，如果属性上发生变化了，就需要告诉订阅者`Watcher`去更新数据，最后指令解析器`Compile`解析对应的指令，进而会执行对应的更新函数，从而更新视图，实现双向绑定。

##  [TODO]React组件如何更新虚拟DOM

    1. state 数据
    2. JSX 模板
    3. 数据 + 模板 => 虚拟 DOM（JS对象）
    4. 虚拟 DOM => 真实 DOM
    5. state 发生变化
    6. 数据 + 模板 => 虚拟 DOM
    7. 新旧虚拟 DOM 作对比，找区别
    8. 直接操作 DOM 改变内容

## [TODO]React生命周期

  React生命周期主要包括三个主要场景：

  - 装载（Mounting）：组件被插入 DOM 中
  - 更新（Updating）：组件重新渲染以更新 DOM
  - 卸载（Unmounting）：组件从 DOM 中移除

  不同的场景会调用不同的生命周期方法，包含`will`的方法在某个时间节点**之前**执行，包含`did`方法在某个时间节点**之后**执行。

  - ### 初始渲染（装载）

  **getDefaultProps**

  **getInitialState**

  **componentWillMount**

  **render**

  **componentDidMount**

  - ### 更新

  **componentWillReceiveProps**

  **shouldComponentUpdate**

  **componentWillUpdate**

  **render**

  **componentDidUpdate**

  - ### 卸载

  **componentWillUnmount**
