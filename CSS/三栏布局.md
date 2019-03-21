# 三栏布局（7种方式实现）

## 1、浮动布局

```html
<div class="container">
    <div class="left col">left</div>
    <div class="right col">right</div>
    <div class="main col">main</div>
</div>
```

```css
.col {
    min-height: 100px;
    background: #eee;
    border: 1px solid #666;
}
.left {
    float: left;
    width: 100px;
}
.right {
    float: right;
    width: 100px;
}
.main {
    margin: 0 102px;
}
```

## 2、绝对定位

```html
<div class="container">
    <div class="left col">Left</div>
    <div class="right col">Right</div>
    <div class="main col">Main</div>
</div>
```

```css
.container {
    position: relative;
}
.col {
    min-height: 100px;
    background: #eee;
    border: 1px solid #666;
}
.left, .right {
    position: absolute;
    top: 0;
}
.left {
    left: 0;
    width: 100px;
}
.right {
    right: 0;
    width: 100px;
}
.main {
    margin: 0 102px;
}
```

## 3、BFC

```html
<div class="container">
    <div class="left col">left</div>
    <div class="right col">right</div>
    <div class="main col">main</div>
</div>
```

```css
.col {
    min-height: 100px;
    background: #eee;
    border: 1px solid #666;
}
.left {
    float: left;
    width: 100px;
}
.right {
    float: right;
	width: 100px;
}
.main {
    overflow: hidden;
}
```

## 4、Flex

```html
<div class="container">
	<div class="left col">left</div>
    <div class="main col">main</div>
    <div class="right col">right</div>
</div>
```

```css
.container {
    display: flex;
}
.col {
    min-height: 100px;
    background: #eee;
    border: 1px solid #666;
}
.left {
    width: 100px;
}
.main {
    flex: 1;
}
.right {
    width: 100px;
}
```

## 5、table 布局

```html
<div class="container">
	<div class="left col">left</div>
    <div class="main col">main</div>
    <div class="right col">right</div>
</div>
```

```css
.container {
    display: table;
    width: 100%;
    min-height: 100px;
}
.col {
    display: table-cell;
    background: #eee;
    border: 1px solid #666;
}
.left {
    width: 100px;
}
.right {
    width: 100px;
}
```

## 6、双飞翼布局

```html
<div class="doubleFly">
    <div class="container">
        <div class="main col">doubleFly main</div>
    </div>
    <div class="left  col">left</div>
    <div class="right col">right</div>
</div>
```

```css
.container {
	width: 100%;
    float: left;
}
.col {
    min-height: 100px;
}
.main {
    margin: 0 100px;
    background: #666;
}
.left {
    width: 100px;
	float: left;
    margin-left: -100%;
}
.right {
    width: 100px;
    float: right;
    margin-left: -100px;
}
```

## 7、圣杯布局

```html
<div class="container">
    <div class="main col">main</div>
    <div class="left col">left</div>
    <div class="right col">right</div>
</div>
```

```css
.container {
	margin: 0 100px;
}
.col {
	min-height: 100px;
    float: left;
}
.main {
    width: 100%;
    background: #666;
}
.left {
    width: 100px;
    position: relative;
    left: -100px;
    margin-left: -100%;
    background: #999;
}
.right {
    width: 100px;
    position: relative;
    right: -100px;
    margin-left: -100px;
    background: #333;
}
```