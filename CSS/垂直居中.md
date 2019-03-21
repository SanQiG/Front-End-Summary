## 1、行高

```html
<div class="box">垂直居中</div>
```

```css
.box {
    width: 100px;
    height: 100px;
    background: #FEE;
    
    line-height: 100px;
}
```

## 2、内边距

```html
<div class="box">垂直居中</div>
```

```css
.box {
    width: 100px;
    background: #FEE;
    
    padding: 50px 0;
}
```

## 3、table

```html
<div class="container">
    <div class="box">垂直居中</div>
</div>
```

```css
.container {
    width: 100px;
    height: 100px;
    background: #FEE;
        
    display: table;
}
.box {
    display: table-cell;
    vertical-align: middle;
}
```

## 4、定位

```html
<div class="container">
    <div class="box">垂直居中</div>
</div>
```

```css
.container {
	width: 100px;
    height: 100px;
    background: #FEE;
    
    position: relative;
}
.box {
	position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
```

## 5、Flex

```html
<div class="box">垂直居中</div>
```

```css
.box {
    width: 100px;
    height: 100px;
    background: #FEE;
    
    display: flex;
    align-items: center;
}
```