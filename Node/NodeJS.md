[toc]

# 1. NodeJS 基础

## 模块

在编写每个模块时，都有 `require`、`exports`、`module` 三个预先定义好的变量可供使用。

**_`require`_**

`require` 函数用于在当前模块中加载和使用别的模块，传入一个模块名，返回一个模块导出对象。模块名可使用相对路径（以 `./` 开头），或者是绝对路径（以 `/` 或 `C:` 之类的盘符开头）。另外，模块名中的 `.js` 扩展名可以省略。

**当 Node 遇到 `require(X)` 时，按下面的顺序处理。**

1. 如果 X 是内置模块（比如 `require('http')` )
   a. 返回该模块
   b. 不再继续执行

2. 如果 X 以 "./" 或者 "/" 或者 "../" 开头
   a. 根据 X 所在的父模块，确定 X 的绝对路径
   b. 将 X 当成文件，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行

   - X
   - X.js
   - X.json
   - X.node

   c. 将 X 当成目录，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行，

   - X/package.json（main字段）
   - X/index.js
   - X/index.json
   - X/index.node

3. 如果 X 不带路径
   a. 根据 X 所在的父模块，确定 X 可能的安装目录

   b. 依次在每个目录中，将 X 当成文件名或目录名加载

4. 抛出 “not found”

**_`exports`_**

`exports` 对象是当前模块的导出对象，用于导出模块的公有方法和属性。别的模块通过 `require` 函数使用当前模块时得到的就是当前模块的 `exports` 对象。

**_`module`_**

通过 `module` 对象可以访问到当前模块的一些相关信息，但最多的用途是替换当前模块的导出对象。

**`exports` 和 `module.exports` 的区别：**

1. `module.exports` 初始值为一个空对象
2. `exports` 是指向的 `module.exports` 的引用
3. `require()` 返回的是  `module.exports` 而不是 `exports`

### 模块初始化

一个模块中的 JS 代码仅在模块第一次被使用时执行一次，并在执行过程中初始化模块的导出对象。之后，缓存起来的导出对象被重复利用。

### 主模块

通过命令行参数传递给 NodeJS 以启动程序的模块被称为主模块。主模块负责调度组成整个程序的其它模块完成工作。通过以下命令启动程序时，`main.js` 就是主模块。

```js
node main.js
```

---

# 2. 代码的组织和部署

## 模块路径解析规则

为了能更加灵活地引入模块路径，`require` 支持除了相对路径和绝对路径之外的第三种形式，写法类似于 `foo/bar`，并依次按照以下规则解析路径，直到找到模块位置。

1. **内置模块**

   如果传递给 `require` 函数的是 NodeJS 内置模块名称，不做路径解析，直接返回内部模块的导出对象，例如 `require('fs')`。
   
   
   
2. **node_modules 目录**


   NodeJS 定义了一个特殊的 `node_modules` 目录用于存放模块。例如某个模块的绝对路径是 `/home/user/hello.js`，在该模块中使用 `require('foo/bar')` 方式加载模块时，则 NodeJS 依次尝试使用以下路径。


```
/home/user/node_modules/foo/bar
/home/node_modules/foo/bar
/node_modules/foo/bar
```

3. **NODE_PATH 环境变量**


   与 PATH 环境变量类似，NodeJS 允许通过 `NODE_PATH` 环境变量来指定额外的模块搜索路径。`NODE_PATH` 环境变量中包含一到多个目录路径，路径之间在 Linux 下使用 `:` 分隔，在 Windows 下使用 `;` 分隔。例如定义了以下 `NODE_PATH` 环境变量：

   ```
NODE_PATH=/home/user/lib:/home/lib
   ```

​	当使用 `require('foo/bar')` 的方式加载模块时，则 NodeJS 依次尝试以下路径

   ```
/home/user/lib/foo/bar
/home/lib/foo/bar
   ```

## 包（package）

JS 模块的基本单位是单个 JS 文件，但复杂些的模块往往由多个子模块组成。为了便于管理和使用，我们可以把由多个子模块组成的大模块称作**包**，并把所有子模块放在同一个目录里。

在其他模块使用包的时候，需要加载包的入口模块。但是入口模块出现在路径里使得包使用起来不像是单个模块，因此需要做一些额外的工作。

1. `index.js`

   当模块的文件名是 `index.js`，加载模块时可以使用模块所在目录的路径代替模块文件路径，因此，下面两条语句等价。

   ```js
   var cat = require('/home/user/lib/cat');
   var cat = require('/home/user/lib/cat/index');
   ```

   这样处理后，就只需要把包目录路径传递给 `require` 函数，感觉上整个目录被当作单个模块使用，更有整体感。
   
2. `package.json`

   如果想自定义入口模块的文件名和存放位置，就需要在包目录下包含一个 `package.json` 文件，并在其中指定入口模块路径。

   ```
   - /home/user/lib
   	- cat/
   		+ doc/
   		- lib/
   			head.js
   			body.js
   			main.js
   		+ tests/
   		package.json
   ```

   其中 `package.json` 内容如下

   ```
   {
   	"name": "cat",
   	"main": "./lib/main.js"
   }
   ```

   如此一来，就同样可以使用 `require('/home/user/lib/cat')` 的方式加载模块。NodeJS 会根据包目录下的 `package.json` 找到入口模块所在位置。

## NPM

---

# 3. 文件操作

_**小文件拷贝**_

```javascript
var fs = require('fs');

function copy(src, dst) {
  fs.writeFileSync(dst, fs.readFileSync(src));
}

function main(argv) {
  copy(argv[0], argv[1]);
}

main(process.argv.slice(2));
```

以上程序使用 `fs.readFileSync` 从源路径读取文件内容，并使用 `fs.writeFileSync` 将文件内容写入目标路径。

> process 是一个全局变量，可通过 `process.argv` 获得命令行参数。由于 `argv[0]` 固定等于 NodeJS 执行程序的绝对路径，`argv[1]` 固定等于主模块的绝对路径，因此第一个命令行参数从 `argv[2]` 这个位置开始。

_**大文件拷贝**_

上面的程序拷贝一些小文件没啥问题，但是这种一次性把所有文件内容都读取到内存中后再一次性写入磁盘的方式不适合拷贝大文件，内存会爆仓。对于大文件，我们只能读一点写一点，直至拷贝完成。

```javascript
var fs = require('fs');

function copy(src, dst) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

function main(argv) {
  copy(argv[0], argv[1]);
}

main(process.argv.slice(2));
```

以上程序使用 `fs.createReadStream` 创建了一个源文件的只读数据流，并使用 `fs.createWriteStream` 创建了一个目标文件的只写数据流，并且用 `pipe` 方法把两个数据流连接了起来。连接起来后发生的事情，说的抽象点的话，水顺着水管从一个桶流到了另一个桶。

## API

### Buffer（数据块）

NodeJS 提供了一个与 `String` 对等的全局构造函数 `Buffer` 来提供对二进制数据的操作。除了可以读取文件得到 `Buffer` 实例外，还能直接构造，例如：

```javascript
var bin = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);
```

Buffer 与字符串类似，除了可以用 `.length` 属性得到字节长度外，还可以用 `[index]` 方式读取指定位置的字节，例如：

```javascript
bin[0]; // => 0x68
```

`Buffer` 与字符串能够相互转化，例如可以使用指定编码将二进制数据转化为字符串：

```js
var str = bin.toString('utf-8'); // => "hello"
```

或者反过来，将字符串转换为指定编码下的二进制数据：

```js
var bin = new Buffer('hello', 'utf-8'); // => <Buffer 68 65 6c 6c 6f>
```

`Buffer` 与字符串有一个重要区别。字符串是只读的，并且对字符串任何修改得到的都是一个新字符串，原字符串保持不变。至于 `Buffer`，更像是可以做指针操作的C语言数组。例如，可以用 `[index]` 方式直接修改某个位置的字节。

```js
bin[0] = 0x48;
```

**而 `.slice` 方法也不是返回一个新的 `Buffer` ，而更像是返回了指向原 `Buffer` 中间的某个位置的指针**，如下所示。

```js
[ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]
    ^           ^
    |           |
   bin     bin.slice(2)
```

因此对 `.slice` 方法返回的 `Buffer` 的修改会作用于原 `Buffer`，例如：

```js
var bin = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);
var sub = bin.slice(2);

sub[0] = 0x65;
console.log(bin); // => <Buffer 68 65 65 6c 6f>
```

也因此，如果想要拷贝一份 `Buffer`，得首先创建一个新的 `Buffer`，并通过 `.copy` 方法把原 `Buffer` 中的数据复制过去。这个类似于申请一块新的内存，并把已有内存中的数据复制过去。以下是一个例子。

```js
var bin = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);
var dup = new Buffer(bin.length);

bin.copy(dup);
dup[0] = 0x48;
console.log(bin); // => <Buffer 68 65 6c 6c 6f>
console.log(dup); // => <Buffer 48 65 6c 6c 6f>
```

总之，`Buffer` 将 JS 的数据处理能力从字符串扩展到了任意二进制数据。

> new Buffer() 已废弃，改为使用 Buffer.from() 或 Buffer.alloc() 或 Buffer.allocUnsafe()

### Stream（数据流）

当内存中无法一次装下需要处理的数据时，或者一边读取一边处理更加高效时，我们就需要用到数据流。NodeJS 中通过各种 `Stream` 来提供对数据流的操作。

以上边的大文件拷贝程序为例，我们可以为数据来源创建一个只读数据流，示例如下：

```javascript
var rs = fs.createReadStream(pathname);

rs.on('data', function(chunk) {
  doSomething(chunk);
});

rs.on('end', function() {
  cleanUp();
});
```

> `Stream` 基于事件机制工作，所有 `Stream` 的实例都继承于 NodeJS 提供的 EventEmitter。

上边的代码中 `data` 事件会源源不断地被触发，不管 `doSomething` 函数是否处理得过来。代码可以继续做如下构造，以解决这个问题。

```javascript
var rs = fs.createReadStream(src);

rs.on('data', function(chunk) {
  rs.pause();
  doSomething(chunk, function() {
    rs.resume();
  });
});

rs.on('end', function() {
  cleanUp();
})
```

以上代码给 `doSomething` 加上了回调，因此我们可以在处理数据前暂停数据读取，并在处理数据后继续读取数据。

此外，我们也可以为数据目标创建一个只写数据流，示例如下：

```javascript
var rs = fs.createReadStream(src);
var ws = fs.createWriteStream(dst);

rs.on('data', function(chunk) {
  ws.write(chunk);
});

rs.on('end', function() {
  ws.end();
});
```

我们把 `doSomething` 换成了往只写数据流里写入数据后，以上代码看起来就像是一个文件拷贝程序了。但是以上代码存在上面提到的问题，如果写入速度跟不上读取速度的话，只写数据流内部的缓存会爆仓。我们根据 `.write` 方法的返回值来判断传入的数据是写入目标了，还是临时放在了缓存，并根据 `drain` 事件来判断什么时候只写数据流已经将缓存中的数据写入目标，可以传入下一个代写数据了。因此代码改造如下：

```javascript
var rs = fs.createReadStream(src);
var ws = fs.createWriteStream(dst);

rs.on('data', function(chunk) {
  if (ws.write(chunk) === false) {
    rs.pause();
  }
});

rs.on('end', function() {
  ws.end();
});

ws.on('drain', function() {
  rs.resume();
});
```

以上代码实现了数据从只读数据流到只写数据流的搬运，并包括了防爆仓控制。因为这种使用场景很多，例如上边的大文件拷贝程序，NodeJS 直接提供了 `.pipe` 方法来做这种事，其内部实现方式与上边的代码类似。

### File System（文件系统）

NodeJS 通过 `fs` 内置模块提供对文件的操作。`fs` 模块提供的 API 基本上可以分为以下三类：

- 文件属性读写。

  其中常用的有 `fs.stat`、`fs.chmod`、`fs.chown` 等等。

- 文件内容读写。

  其中常用的有 `fs.readFile`、`fs.readdir`、`fs.writeFile`、`fs.mkdir` 等等。

- 底层文件操作。

  其中常用的有 `fs.open`、`fs.read`、`fs.write`、`fs.close` 等等。

NodeJS 最精华的异步 IO 模型在 `fs` 模块里有着充分的体现，例如上面提到的这些API都通过回调函数传递结果。以 `fs.readFile` 为例：

```javascript
fs.readFile(pathname, function(err, data) {
  if (err) {
    // Deal with error.
  } else {
    // Deal with dara.
  }
});
```

如上边代码所示，**基本上所有 `fs` 模块API的回调参数都有两个。第一个参数在有错误发生时等于异常对象，第二个参数始终用于返回API方法执行结果。**

此外，`fs` 模块的所有异步API都有对应的同步版本，用于无法使用异步操作时，或者同步操作更方便时的情况。**同步API除了方法名的末尾多了一个 `Sync` 之外，异常对象与执行结果的传递方式也有相应变化。**同样以 `fs.readFileSync` 为例：

```javascript
try {
	var data = fs.readFileSync(pathname);
  // Deal with data.
} catch {
  // Deal with error.
}
```

### Path（路径）

NodeJS 提供了 `path` 内置模块来简化路径相关操作，并提升代码可读性。

- [path.normalize(path)](#jump1)
- [path.dirname(path)](#jump2)
- [path.basename(path[, ext])](#jump3)
- [path.extname(path)](#jump4)
- [path.isAbsolute(path)](#jump5)
- [path.relative(from, to)](#jump6)
- [path.parse(path)](#jump7)
- [path.join([...paths])](#jump8)
- [path.resolve([...paths])](#jump9)

**<span name="jump1">path.normalize(path)</span>**

将传入的路径转换为标准路径，具体讲的话，除了解析路径中的 `.` 与 `..` 外，还能去掉多余的斜杠。如果有程序需要使用路径作为某些数据的索引，但又允许用户随意输入路径时，就需要使用该方法保证路径的唯一性。如果 `path` 不是字符串，则抛出 `TypeError`。

```javascript
var cache = {};

function store(key, value) {
  cache[path.normalize(key)] = value;
}

store('foo/bar', 1);
store('foo//baz//../bar', 2);
console.log(cache); // => {"foo/bar": 2}
```

> 标准化之后的路径里的斜杠在 Windows 系统下是 `\`，而在Linux系统下是 `/` 。如果想保证任何系统下都使用 `/` 作为路径分隔符的话，需要用 `.replace(/\\/g. '/')` 再替换一下标准路径。

**<span name="jump2">path.dirname(path)</span>**

`path.dirname()` 方法返回 `path` 目录名，尾部的目录分隔符将被忽略。如果 `path` 不是字符串，则抛出 `TypeError`。

```javascript
path.dirname('/foo/bar/baz/asdf/quux');
// 返回：'/foo/bar/baz/asdf'
```

**<span name="jump3">path.basename(path[, ext])</span>**

`path.basename()` 方法返回 `path` 的最后一部分。

```javascript
path.basename('/foo/bar/baz/asdf/quux.html');
// 返回：'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返回：'quux'
```

**<span name="jump4">path.extname(path)</span>**

当需要根据不同文件扩展名做不同操作时，该方法就显得很好用。

```javascript
path.extname('foo/bar.js'); // => '.js'
```

**<span name="jump5">path.isAbsolute(path)</span>**

`path.isAbsolute()` 方法检测 `path` 是否为绝对路径。

**<span name="jump6">path.relative(from, to)</span>**

`path.relative()` 方法根据当前工作目录返回 `from` 到 `to` 的相对路径。如果 `from` 和 `to` 各自解析到相同的路径（分别调用 `path.resolve()` 之后），则返回零长度的字符串。

如果将零长度的字符串传入 `from` 或 `to`，则使用当前工作目录代替该零长度的字符串。如果 `from` 或 `to` 不是字符串，则抛出 `TypeError`。

```javascript
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 返回：'../../impl/bbb'
```

**<span name="jump7">path.parse(path)</span>**

`path.parse()` 方法返回一个对象，其属性表示 `path` 的重要元素。尾部的目录分隔符将被忽略。

返回的对象将具有以下属性：

- `dir` <string>
- `root` <string>
- `base` <string>
- `name` <string>
- `ext` <string>

```javascript
path.parse('/home/user/dir/file.txt');
// 返回：
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

```reStructuredText
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
```

**<span name="jump8">path.join([...paths])</span>**

`path.join()` 方法使用平台特定的分隔符作为定界符将所有给定的 `path` 片段连接在一起，然后规范化生成的路径。

零长度的 `path` 片段会被忽略。如果连接的路径字符串是零长度的字符串，则返回 `'.'`，表示当前工作目录。

```javascript
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'); 
// 返回： 'foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```

**<span name="jump9">path.resolve([...paths])</span>**

`path.resolve()` 方法将路径或路径片段的序列解析为绝对路径。

如果在处理完所有的给定的 `path` 片段之后还为生成绝对路径，则再加上当前工作目录。

如果没有传入 `path` 片段，则 `path.resolve()` 将返回当前工作目录的绝对路径。

如果任何参数不是字符串，则抛出 `TypeError`。

```javascript
path.resolve('/foo/bar', './baz');
// 返回： '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回： '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node,
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

#### path.join() 和 path.resolve() 的区别？

1. join 是把各个 path 片段连接在一起，resolve 把 `'/'` 当成根目录
2. resolve 在传入非 `/` 路径时，会自动加上当前目录形成一个绝对路径，而 join 仅仅用于路径拼接

#### `__dirname`，`__filename`，`process.cwd()`，`./` 的一些坑

```reStructuredText
syntax/
	-nodejs/
    -findLargest.js
    -path.js
    -fs.js
  -regs
    -regx.js
    -test.txt
```

```javascript
// 在 path.js 里面写如下代码
const path = require('path');
console.log('__dirname：', __dirname);
console.log('__filename：', __filename);
console.log('process.cwd()：', process.cwd());
console.log('./：', path.resolve('./'));

// 在当前目录下，以上代码的输出分别是
// __dirname: /Users/sanqi/Desktop/syntax/nodejs
// __filename: /Users/sanqi/Desktop/syntax/nodejs/path.js
// process.cwd(): /Users/sanqi/Desktop/syntax/nodejs
// ./: /Users/sanqi/Desktop/syntax/nodejs
```

在Desktop目录下运行 `node syntax/nodejs/path.js`，我们再看输出结果：

```reStructuredText
__dirname: /Users/sanqi/Desktop/syntax/nodejs
__filename: /Users/sanqi/Desktop/syntax/nodejs/path.js
process.cwd(): /Users/sanqi/Desktop
./: /Users/sanqi/Desktop
```

- `__dirname`：获得当前执行文件所在目录的完整目录名
- `__filename`：获得当前执行文件的带有完整绝对路径的文件名
- `process.cwd()`：获得当前执行node命令时候的文件夹目录名
- `./`：使用require时候，`./` 与__dirname一样；不使用 require 时候，`./` 与process.cwd()一样

**只有在 `require()` 时才使用相对路径 `(./, ../)` 的写法，其他地方一律使用绝对路径，如下：**

```javascript
// 当前目录下
path.dirname(__filename) + '/path.js';
// 相邻目录下
path.resolve(__dirname, '../regx/regx.js');
```

## 遍历目录

遍历目录是操作文件时的一个常见需求。比如写一个程序，需要找到并处理指定目录下的所有JS文件时，就需要遍历整个目录。

### 递归算法

遍历目录时一般使用递归算法，否则就难以编写出简洁的代码。使用递归算法编写的代码虽然简洁，但由于每递归一次就产生一次函数调用，在需要优先考虑性能时，需要把递归算法转换为循环算法，以减少函数调用次数。

### 遍历算法

目录是一个树状结构，在遍历时一般使用深度优先+先序遍历算法。

#### 同步遍历

了解了必要的算法后，我们可以简单地实现以下目录遍历函数。

```javascript
function travel(dir, callback) {
  fs.readdirSync(dir).forEach(function(file) {
    var pathname = path.join(dir, file);
    
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}
```

可以看到，该函数以某个目录作为遍历的起点。遇到一个子目录时，就先接着遍历子目录。遇到一个文件时，就把文件的绝对路径传给回调函数。回调函数拿到文件路径后，就可以做各种判断和处理。因此假设有以下目录：

```
- /home/user/
	- foo/
		x.js
	- bar/
		y.js
	z.css
```

使用以下代码遍历该目录时，得到的输入如下。

```
travel('/home/user', function(pathname) {
	console.log(pathname);
});

------------------

/home/user/foo/x.js
/home/user/bar/y.js
/home/user/z.css
```

#### 异步遍历

如果读取目录或读取文件状态时使用的是异步 API，目录遍历函数实现起来会有些复杂，但原理完全相同。

```javascript
function travel(dir, callback, finish) {
  fs.readdir(dir, function(err, files) {
    (function next(i) {
      if (i < files.length) {
        var pathname = path.join(dir, files[i]);
        
        fs.stat(pathname, function(err, stats) {
        	if (stats.isDirectory()) {
            travel(pathname, callback, function() {
							next(i + 1);
            });
          } else {
            callback(pathname, function() {
              next(i + 1);
            });
          }
        });
      } else {
        finish && finish();
      }
    })(0);
  });
}
```

## 文本编码

使用 NodeJS 编写前端工具时，操作得最多的是文本文件，因此也就涉及到了文件编码的处理问题。我们常用的文件编码有 `UTF-8` 和 `GBK` 两种，并且 `UTF-8` 文件还可能带有 BOM。在读取不同编码的文本文件时，需要将文件内容转换为 JS 使用的 `UTF-8` 编码字符串后才能正确处理。

### BOM的移除

BOM 用于标记一个文本文件使用 Unicode 编码，其本身是一个 Unicode 字符（"\uFEFF"），位于文本文件头部。在不同的 Unicode 编码下，BOM 字符对应的二进制字节如下：

```
    Bytes        Encoding
----------------------------
    FE FF         UTF16BE
    FF FE         UTF16LE
    EF BB BF      UTF8
```

因此，我们可以根据文本文件头几个字节等于啥来判断文件是否包含 BOM，以及使用哪种 Unicode 编码。但是，BOM 字符虽然起到了标记文件编码的作用，其本身却不属于文件内容的一部分，如果读取文本文件时不去掉 BOM ，在某些使用场景下就会有问题。例如我们把几个 JS 文件合并成一个文件后，如果文件中间含有 BOM 字符，就会导致浏览器 JS 语法错误。**因此使用 NodeJS 读取文本文件时，一般需要去掉 BOM。**例如，以下代码实现了识别和去除 UTF8 BOM 的功能。

```javascript
function readText(pathname) {
  var bin = fs.readFileSync(pathname);
  
  if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
    bin = bin.slice(3);
  }
  
  return bin.toString('utf-8');
}
```

### GBK 转 UTF8

NodeJS 支持在读取文本文件时，或者在 `Buffer` 转换为字符串时指定文本编码，但遗憾的是，**GBK 编码不在 NodeJS 自身支持范围内**。因此，一般我们借助 `iconv-lite` 这个三方包来转换编码。使用 NPM 下载该包后，我们可以按以下方式编写一个读取 GBK 文本文件的函数。

```javascript
var iconv = require('iconv-lite');

function readGBKText(pathname) {
  var bin = fs.readeFileSync(pathname);
  
  return iconv.decode(bin, 'gbk');
}
```

### 单字节编码

有时候，我们无法预知需要读取的文件采用哪种编码，因此也就无法指定正确的编码。比如我们要处理的某些 CSS 文件中，有的用 GBK 编码，有的用 UTF8 编码。虽然可以一定程度根据文件的字节内容猜测出文本编码，但这里要介绍的是有些局限，但是要简单得多的一种技术。

首先我们知道，如果一个文本文件只包含英文字符，比如 `Hello World` ，那无论用 GBK 编码还是 UTF8 编码读取这个文件都是没问题的。这是因为在这些编码下，ASCII0-128 范围内字符都使用相同的单字节编码。

反过来讲，即使一个文本文件中有中文等字符，如果我们处理的字符仅在 ASCII0-128 范围内，比如除了注释和字符串以外的 JS 代码，我们就可以统一使用单字节编码来读取文件，不用关心文件的实际编码是 GBK 还是 UTF8。以下示例说明了这种方法。

```
1. GBK 编码源文件内容：
	 var foo = '中文';
2. 对应字节：
	 76 61 72 20 66 6F 6F 20 3D 20 27 D6 D0 CE C4 27 3B
3. 使用单字节编码读取后得到的内容
	 var foo = '{乱码}{乱码}{乱码}{乱码}';
4. 替换内容
	 var bar = '{乱码}{乱码}{乱码}{乱码}';
5. 使用单字节编码保存后对应字节：
	 76 61 72 20 66 6F 6F 20 3D 20 27 D6 D0 CE C4 27 3B
6. 使用 GBK 编码读取后得到的内容：
	 var bar = '中文';
```

这里的诀窍在于，不管大于 0xEF 的单个字符在单字节编码下被解析成什么乱码字符，使用同样的单字节编码保存这些乱码字符时，背后对应的字节保持不变。

NodeJS 中自带了一种 `binary` 编码可以用来实现这个方法，因此在下例中，我们使用这种编码来演示上例对应的代码该怎么写。

```javascript
function replace(pathname) {
  var str = fs.readFileSync(pathname, 'binary');
  str = str.replace('foo', 'bar');
  fs.writeFileSync(pathname, str, 'binary');
}
```

---

# 4. 网络操作

使用 NodeJS 内置的 `http` 模块简单实现一个 HTTP 服务器。

```javascript
var http = require('http');

http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text-plain' });
  response.end('Hello World\n');
}).listen(8124);
```

以上程序创建了一个HTTP服务器并监听 `8124` 端口，打开浏览器访问该端口 `http://127.0.0.1:8124/` 就能够看到效果。