## 什么是BFC（Block Formatting Context）？

> BFC 直译为“块级格式化上下文”。它是一个独立的渲染区域，只有Block-level Box参与，它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

文档流分 `定位流`、`浮动流` 和 `普通流` 三种。而普通流其实就是指 BFC 中的 FC。

FC直译过来是格式化上下文，它是**页面中的一块渲染区域**，有一套渲染规则，决定了其**子元素如何布局，以及和其他元素之间的关系和作用**。

BFC 对布局的影响主要体现在对 **`float`** 和 **`margin`** 两个属性的处理。BFC 让 float 和 margin 这两个属性的表现更加符合我们的直觉。

根据 BFC 对其内部元素和外部元素的表现特性，将 BFC 的特性总结为 **`对内部元素的包裹性`** 及 **`对外部元素的独立性`**。

## 如何触发 BFC ？

满足下列条件之一就可触发 BFC。

- 根元素，即 HTML 元素
- `float` 的值不为 `none`
- `overflow` 的值不为 `visible`
- `display` 的值为 `inline-block`、`table-cell`、`table-caption`
- `position` 的值为 `absolute` 或 `fixed`

## BFC 布局规则

先来个总结，稍后会一一说明。

1. 内部的 Box 会在垂直方向，一个接一个地放置。
2. Box 垂直方向的距离由 margin 决定。**属于同一个 BFC 的两个相邻 Box** 的 margin 会发生重叠。
3. 每个元素的 margin box 的左边，与包含块 border box  的左边相接触（对于从左向右的格式化，否则相反）。即使存在浮动也是如此。
4. BFC 的区域不会与 float box 重叠。
5. BFC 就是页面上一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
6. 计算 BFC 的高度时，浮动元素参与计算。

## BFC 有哪些作用？

>  !!! 这里推荐去[这里](<http://www.cnblogs.com/xiaohuochai/p/5248536.html>)在线查看 BFC 的作用。

1. 自适应两栏布局
2. 可以阻止元素被浮动元素覆盖
3. 可以包含浮动元素——清除内部浮动
4. 分属于不同的 BFC 时可以阻止 margin 重叠

***

### BFC 布局规则1：内部的 Box 会在垂直方向， 一个接一个地放置

上文定义中提到过的块级盒：`Block-level Box` 到底是什么意思呢？

![](https://lc-gold-cdn.xitu.io/b80801d8707be24ecbc0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

我们平常说的盒子是由 margin、border、padding、content组成的，实际上每种类型的四条边定义了一个盒子，分别是`content box`、`padding box`、`border box`、`margin box`，这四种类型的盒子一直存在，即使他们的值为0。决定块盒在包含块中与相邻块盒的垂直间距的便是 `margin-box`。

**提示**：Box 之间的距离虽然也可以使用 padding 来控制，但是此时实际上还是属于 box 内部里面，而且使用 padding 来控制的话就不能再使用 border 属性了。

布局规则1就是我们**平常div一行一行块级放置的样式**。

### BFC 布局规则2：Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠

![](https://lc-gold-cdn.xitu.io/6b0fc0e3d34f94875d35.gif?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

上文提到过，决定块级盒在包含块中与相邻块盒的垂直间距的便是 `margin-box`。上面的例子就是这种情况。

演示中 css 属性设置：上面的 box：`margin-bottom: 100px; `下面的 box：`margin-top: 100px;`（他们是同一侧的 margin，所以会发生 margin 重叠的情况，两个 div 的距离实际上只有 100px。）

这个时候  **`BFC 的作用 4：阻止 margin 重叠`**  就派上了用场：

当两个相邻块级子元素**分属于不同的 BFC **时可以**阻止 margin 重叠**。

**操作方法**：给其中一个 div 外面包一个 div，然后通过触发外面这个 div 的 BFC，就可以阻止这两个 div 的 margin  重叠，具体触发方式可以参考上文给出的触发条件。

### BFC 布局规则3：每个元素的 margin box 的左边，与包含块 border-box 的左边相接触（对于从左向右的格式化，否则相反）。即使存在浮动也是如此。

```html
<div class="par">
    <div class="child"></div>
    // 给这两个子div加浮动，浮动的结果，如果没有清除浮动的话，父div不会将下面两个div包裹， 
    // 但还是在父div的范围之内。
    <div class="child"></div>
</div>
```

**解析**：给这两个子 div 加浮动，浮动的结果，如果没有清除浮动的话，父 div 不会将下面两个 div 包裹，但还是在父 div 的范围之内，**左浮动是子 div 的左边接触父 div 的 `border-box` 的左边，右浮动是子 div 的左边接触父 div 的 `border-box` 的右边**，除非设置 margin 来撑开距离，否则一直是这个规则。

这个时候 **`BFC 的作用 3：可以包含浮动元素——清除内部浮动`** 登场！

给父 div 加上 `overflow: hidden;`

**清除浮动原理**：触发父 div 的 BFC 属性，**使下面的子 div 都处在父 div 的同一 BFC 区域之内**，此时已成功清除浮动。

![](https://lc-gold-cdn.xitu.io/dfe63a3d19cae8adf5fa.gif?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

还可以使父 div 向同一个方向浮动来达到清除浮动的目的，清除浮动的原理是两个 div 都位于同一个浮动的 BFC 区域之中。

### BFC 布局规则4：BFC 区域不会与 float box 重叠。

![](https://lc-gold-cdn.xitu.io/0e2c7b710c4a13111120.gif?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

上面 aside 盒子有一个浮动属性，覆盖了 main 盒子的内容，main 盒子没有清除 aside 盒子的浮动。只做了一个动作，就是**触发自身的 BFC**，然后就不在被 aside 盒子覆盖了。所以：**BFC 的区域不会与 float box 重叠**。

下面再来介绍一下 **`BFC 的作用 1：自适应两栏布局`** ：

![](https://lc-gold-cdn.xitu.io/304255779293ba4c2082.gif?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

还是上面的代码，此时 BFC 的区域不会与 float box 重叠，因此**会根据父 div 宽度，和 aside 的宽度，自适应宽度**。

### BFC 与 Layout

IE 作为浏览器中的奇葩，当然不可能按部就班的支持 BFC 标准，于是乎 IE 中就有了 Layout 这个东西。**Layout 和 BFC 基本是等价的**，为了处理 IE 的兼容性，在需要触发 BFC 时吗，我们除了需要用触发条件中的 CSS 属性来触发 BFC，还需要针对 IE 浏览器使用 **`zoom: 1`** 来触发 IE 浏览器的 Layout。

以上的几个例子都体现了 BFC 布局规则的第 5 条——

### BFC 布局规则5：BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之亦然。

***

**文本环绕 float**：

```html
<div style="float: left; width: 100px; height: 100px; background: #000;">
</div>
<div style="height: 200px; background: #AAA;">
    <div style=" width: 30px; height: 30px; background: red;"></div>
    <p>content</p> <p>content</p> <p>content</p> <p>content</p> <p>content</p>
</div>
```

![](https://lc-gold-cdn.xitu.io/c02b2396d987f4d7439a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

问题：为什么灰色背景的 div 左上角被覆盖后，红色 div 被覆盖，但是文本却没有被覆盖？

**解决**：

**float 的定义和用法**：

float 属性定义元素在哪个方向上浮动。以往这个属性总应用于图像，**使文本围绕在图像周围**，不过在 CSS 中，**任何元素都可以浮动**。浮动元素会生成一个块级框，而不论它本身是何种元素。

![](https://lc-gold-cdn.xitu.io/5994ed11ebc3e4b971db.gif?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

从上图可以看到，float 属性确实生效，将 float 隐藏后，下面还有一个红色的 div，这个 div 是被黑色 div 所覆盖掉的。**div 会被 float 覆盖，而文本却没有被 float 覆盖**，是因为 **float 当初设计的时候就是为了使文本围绕在浮动对象的周围。**

***

## 完

