> 本文主要参考阮一峰大大的[这篇文章](<http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html>)

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071002.png)

## 什么是 Flex ？

Flex 是 Flexible Box 的缩写，意为“弹性布局”，用来为盒状模型提供最的灵活性。

**任何一个容器都可以指定为 Flex 布局**。

注意：**设置为 Flex 布局后，子元素的 `float` 、`clear` 和 `vertical-align` 属性将失效。**

## 1、基本概念

采用 Flex 布局的元素，称为 **Flex 容器**（Flex Container），简称“容器”。它的所有子元素自动成为容器成员，称为 **Flex 项目**（Flex Item），简称“项目”。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png)

容器默认存在两根轴：

- `水平的主轴（main axis）`：主轴开始位置叫做 `main start`，结束位置叫做 `main end`
- `垂直的交叉轴（cross axis）`：交叉轴开始位置叫做 `cross start`，结束位置叫做 `cross end`

项目默认沿主轴排列。单个项目占据的主轴空间叫做 `main size`，占据的交叉轴空间叫 `cross size`

## 2、容器的属性

有以下 6 种：

- `flex-direction`
- `flex-wrap`
- `flex-flow`
- `justify-content`
- `align-items`
- `align-content`

### `flex-direction`

**`flex-direction` 属性决定主轴的方向（即项目排列的方向）。**

它可能有 4 个值：

- `row`（默认值）：主轴为水平方向，起点在左端。
- `row-reverse`：主轴为水平方向，起点在右端。
- `column`：主轴为垂直方向，起点在上沿。
- `column-reverse`：主轴为垂直方向，起点在下沿。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071005.png)

### `flex-wrap`

**`flex-wrap` 属性定义，如果一条轴线排不下，如何换行。**

- `nowrap`（默认值）：不换行。
  ![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071007.png)
- `wrap`：换行，第一行在上方。
  ![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071008.jpg)
- `wrap-reverse`：换行，第一行在下方。
  ![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071009.jpg)

### `flex-flow`

**`flex-flow` 属性是 `flex-direction` 属性和 `flex-wrap` 属性的简写形式，默认值是 `row nowrap`**。

### `justify-content`

**`justify-content` 属性定义了 `项目` 在 `主轴` 上的对齐方式**。

它可能有 5 个值，具体对齐方式与轴的方向有关。下面假设主轴为从左到右。

- `flex-start`（默认值）：左对齐。
- `flex-end`：右对齐。
- `center`：居中。
- `space-between`：两端对齐，项目之间的间隔要相等。
- `space-around`：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071010.png)

### `align-items`

**`align-items` 属性定义了 `项目` 在 `交叉轴` 上的对齐方式**。

它可能有 5 个值，具体的对齐方式与交叉轴的方向有关，下面假设交叉轴从上到下。

- `flex-start`：交叉轴的起点对齐。
- `flex-end`：交叉轴的终点对齐。
- `center`：交叉轴的中点对齐。
- `baseline`：项目的第一行文字的基线对齐。
- `stretch`（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071011.png)

### `align-content`

**`align-content` 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用**。

- `flex-start`：与交叉轴的起点对齐。
- `flex-end`：与交叉轴的终点对齐。
- `center`：与交叉轴的中点对齐。
- `space-between`：与交叉轴两端对齐，轴线之间的间隔平均分布。
- `space-around`：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
- `stretch`（默认值）：轴线占满整个交叉轴。

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071012.png)

## 3、项目的属性

有以下 6 种：

- `order`
- `flex-grow`
- `flex-shrink`
- `flex-basis`
- `flex`
- `align-self`

### `order`

**`order` 属性定义项目的排列顺序。数值越小，排列越靠前，默认为 0。**

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071013.png)

### `flex-grow`

**`flex-grow` 属性定义项目的 `放大` 比例。默认为 `0`，即如果存在剩余空间，也不放大。**

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071014.png)

如果所有项目的 `flex-grow` 属性都为 1，则它们将等分剩余空间（如果有的话）。如果一个项目的 `flex-grow` 属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。

### `flex-shrink`

**`flex-shrink`  属性定义了项目的 `缩小` 比例。默认为 `1`，即如果空间不足，该项目将缩小。**

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071015.jpg)

如果所有项目的 `flex-shrink` 属性都为 1，当空间不足时，都将等比例缩小。如果一个项目的   `flex-shrink` 属性为 0，其他项目都为 1，则空间不足时，前者不缩小。

负值对该属性无效。

### `flex-basis`

**`flex-basis` 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 `auto`，即项目的本来大小。**

它可以设为跟 `width` 或 `height` 属性一样的值（比如 350px ），则项目将占据固定空间。

### `flex`

**`flex` 属性是 `flex-grow`, `flex-shrink`  和  `flex-basis` 的简写，默认值为`0 1 auto`。后两个属性可选。**

该属性有两个快捷值：`auto` (`1 1 auto`) 和 `none` (`0 0 auto`)。

建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。

### `align-self`

**`align-self` 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。**

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071016.png)

该属性可能取6个值，除了`auto`，其他都与 `align-items` 属性完全一致。

## 完

