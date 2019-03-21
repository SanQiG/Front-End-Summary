## 1、外边距

```html
<div class="box"></div>
```

```css
.box {
    width: 100px;
    height: 100px;
    background: #FCC;
    
    margin: 0 auto;
}
```

## 2、行内块

```html
<div class="container">
    <div class="box"></div>
</div>
```

```css
.container {
    text-align: center;
}
.box {
    width: 100px;
    height: 100px;
    background: #FCC;
    
    display: inline-block;
}
```

## 3、绝对定位

```html
<div class="box"></div>
```

```css
.box {
    width: 100px;
    height: 100px;
    background: #FCC;
    
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}
```

## 4、Flex

```html
<div class="container">
    <div class="box"></div>
</div>
```

```css
.container {
    display: flex;
    justify-content: center;
}
.box {
    width: 100px;
    height: 100px;
    background: #FCC;
}
```