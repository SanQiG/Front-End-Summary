[toc]

# 1. 起步

## 安装

```shell
npm install --save express
```

## Demo

```js
const expresss = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('hello world'))

app.listen(3000, () => console.log(`Example app running at http:localhost/${port}`))
```

## 基本路由

### GET

```js
app.get('/', (req, res) => {
  res.send('Got a GET request')
})
```

### POST

```js
app.post('/', (req, res) => {
  res.send('Got a POST request')
})
```

## 静态服务

```js
// 公开 public 资源，通过 url 可以直接访问 public 文件目录下的静态资源
app.use(express.static('public'))

// 带上第一个参数之后，通过 url 访问静态资源需要以对应参数内容开头
app.use('/public', express.static('public'))
 
app.use('/public', express.static(path.join(__dirname, 'public')))
```

# 2. Express 配置使用 art-template

**[art-template 官方文档](https://aui.github.io/art-template/express/)**

## 安装

```shell
npm install --save art-template
npm install --save express-art-template
```

## 配置

```js
app.engine('html', require('express-art-template'))
```

如果希望修改默认的 views 视图渲染存储目录，可以：

```js
app.set('views', path.join(__dirname, 'views'));
```

## 使用

```js
app.get('/', (req, res) => {
	res.render('index.html', {
		data: data
	})
})
```

# 3. Express 获取 GET 请求体数据

在 `Express` 中内置了 `req.query` API，可以通过它直接访问 GET 方法的请求体数据。

# 4. Express 获取 POST 请求体数据

在 `Express` 中没有内置获取表单 POST 请求体的 API，因此需要使用一个第三方包：

**body-parser**。

## 安装

```shell
npm install body-parser
```

## 配置

```javascript
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// 只要加入这个配置，在 req 请求对象上就会多出来一个 body 属性
// 也就是说可以直接通过 req.body 来获取表单 POST 请求体数据了
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
```

## 使用

```js
app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})
```

