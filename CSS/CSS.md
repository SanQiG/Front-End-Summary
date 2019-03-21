[TOC]

## 1、BFC

详见[文章](https://github.com/SanQiG/Front-End-Interview-Summarize/blob/master/CSS/BFC.md)

## 2、三栏布局

详见[文章](https://github.com/SanQiG/Front-End-Interview-Summarize/blob/master/CSS/%E4%B8%89%E6%A0%8F%E5%B8%83%E5%B1%80.md)

## 3、水平居中

详见[文章](https://github.com/SanQiG/Front-End-Interview-Summarize/blob/master/CSS/%E6%B0%B4%E5%B9%B3%E5%B1%85%E4%B8%AD.md)

## 4、垂直居中

详见[文章](https://github.com/SanQiG/Front-End-Interview-Summarize/blob/master/CSS/%E5%9E%82%E7%9B%B4%E5%B1%85%E4%B8%AD.md)

## 5、盒模型

盒模型有两种：**`W3C标准盒模型`** 和 **`IE 怪异盒模型`**

盒模型是由：**`内容（content）`**、**`内边距（padding）`**、**`边框（border）`** 和 **`外边距（margin）`**组成的。

标准模型的宽高指的是 **`content`** 区宽高，IE 盒模型的宽高指的是 **`content+padding+border`** 的宽高。

![](https://upload-images.jianshu.io/upload_images/3534156-e2309fc21e18ce8d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/746/format/webp)

![](https://upload-images.jianshu.io/upload_images/3534156-55b43078fcef0bec.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/598/format/webp)

​	**CSS 如何设置这两种盒模型？**

​		标准盒模型：`box-sizing: content-box;`

​		怪异盒模型：`box-sizing: border-box;`

## 6、Flex

详见[文章](https://github.com/SanQiG/Front-End-Interview-Summarize/blob/master/CSS/Flex.md)

## 7、CSS 选择器权重

浏览器通过优先级规则，判断元素展示那些样式。优先级通过 4 个维度指标确定，假定以`a、b、c、d`命名，分别代表以下含义：

1. `a` 表示是否使用内联样式。如果使用，`a`为 1，否则为 0。
2. `b ` 表示 ID 选择器的数量。
3. `c` 表示类选择器、属性选择器和伪类选择器数量之和。
4. `d` 表示标签（类型）选择器和伪元素选择器之和。

优先级的结果并非通过以上四个值生成一个得分，而是**每个值分开比较**。`a`、`b`、`c`、`d` 权重从左到右，依次减小。判断优先级时，从左到右，一一比较，直到比较出最大值，即可停止。所以，如果 `b` 的值不同，那么 `c` 和 `d` 不管多大，都不会对结果产生影响。比如 `0, 1, 0, 0` 的优先级高于 `0, 0, 10, 10`。

**当出现优先级相等的情况时，最晚出现的样式规则被采纳**。如果你在样式表里写了相同的规则（无论是在该文件内部还是其它样式文件中），那么最后出现的（在文件底部的）样式优先级更高，因此会被采纳。

在写样式时，我会使用较低的优先级，这样这些样式可以轻易地覆盖掉。尤其对写 UI 组件的时候更为重要，这样使用者就不需要通过非常复杂的优先级规则或使用 `!important` 的方式，去覆盖组件的样式了。

## 8、请阐述 `z-index`属性，并说明如何形成层叠上下文（stacking context）。



## 9、层叠顺序和堆栈上下文

![](https://images2015.cnblogs.com/blog/608782/201609/608782-20160923104742809-2054066790.png)

**准确的 7 层为：**

  		1. 形成堆叠上下文环境的元素的背景与边框
  		2. 拥有负 `z-index` 的子堆叠上下文元素（负的越高堆叠层级越低）
  		3. 正常流式布局，非 `inline-block`，无 `position` 定位（static除外）的子元素
  		4. 无 `position` 定位的

## 10、有哪些清除浮动的技术？

- **空 `div` 方法**：`<div style="clear: both;"></div>`

- **自定义一个 `.clearfix` 类，利用伪元素选择器`::after` 清除浮动**：

  ```css
  .clearfix::after {
      content: "";
      display: block;
      clear: both;
  }
  ```

- `overflow: auto` 或 `overflow: hidden` **触发 BFC**

## 11、CSS 画三角形、梯形和平行四边形

## 12、多行文本溢出显示省略号

```css
overflow: hidden;
text-overflow: ellipsis;
```

## 13、回到顶部

`window.scrollTo(0, 0);`
