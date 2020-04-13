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

JS 模块的基本单位是单个 JS 文件，但复杂些的模块往往由多个子模块组成。为了便于管理和使用，我们可以把由多个子模块组成的大模块称作**包**，并把所有子模块放在同一个目录里。在其他模块使用包的时候，需要加载包的入口模块。但是入口模块出现在路径里使得包使用起来不像是单个模块，因此需要做一些额外的工作。

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

> 在 Linux 系统下，监听 1024 以下端口需要 root 权限。因此，如果想监听 80 或 443 端口的话，需要使用 `sudo` 命令启动程序。

## API

### HTTP

`http` 模块提供两种使用方式：

- 作为服务端使用时，创建一个HTTP服务器，监听HTTP客户端请求并返回响应。
- 作为客户端使用时，发起一个HTTP客户端请求，获取服务端响应。

如上例，首先需要使用 `.createServer` 方法创建一个服务器，然后调用 `.listen` 方法监听端口。之后，每当来了一个客户端请求，创建服务器传入的回调函数就被调用一次。可以看出，这是一种事件机制。

HTTP 请求本质上是一个数据流，由请求头和请求体组成。例如以下是一个完整的HTTP请求数据内容。

```
POST / HTTP/1.1
User-Agent: curl/7.26.0
Host: localhost
Accept: */*
Content-Length: 11
Content-Type: application/x-www-form-urlencoded

Hello World
```

可以看到，空行之上是请求头，之下是请求体。HTTP 请求在发给服务器时，可以认为是按照从头到尾的顺序一个字节一个字节地以数据流方式发送的。**而 `http` 模块创建的 HTTP 服务器在接收到完整的请求头后，就会调用回调函数。**在回调函数中，**除了可以使用 `request` 对象访问请求头数据外，还能把 `request` 对象当作一个只读数据流来访问请求体数据**。以下是一个例子。

```javascript
http.createServer(function(request, response) {
  var body = [];
  
  console.log(request.method);
  console.log(request.headers);
  
  request.on('data', function (chunk) {
    body.push(chunk);
  });
  
  request.on('end', function () {
    body = Buffer.concat(body);
    console.log(body.toString());
  });
}).listen(80);
```

HTTP 响应本质上也是一个数据流，同样由响应头和响应体组成。例如以下是一个完整的 HTTP 请求数据内容。

```
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11
Date: Tue, 05 Nov 2013 05:31:38 GMT
Connection: keep-alive

Hello World
```

在回调函数中，**除了可以使用 `response` 对象来写入响应头数据外，还能把 `response` 对象当作一个只写数据流来写入响应体数据**。例如在以下例子中，服务端原样将客户端请求的请求体数据返回给客户端。

```javascript
http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  
  request.on('data', function(chunk) {
    response.write(chunk);
  });
  
  request.on('end', function() {
    response.end();
  });
}).listen(80);
```

接下来看看客户端模式下如何工作，为了发起一个客户端HTTP请求，我们需要指定目标服务器的位置并发送请求头和请求体，以下示例演示了具体做法。

```javascript
var options = {
  hostname: 'www.example.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

var request = http.request(options, function (response) {});

request.write('Hello World');
request.end();
```

可以看到，`.request` 方法创建了一个客户端，并指定请求目标和请求头数据。之后，就可以把 `request` 对象当作一个只写数据流来写入请求体数据和结束请求。另外，由于 HTTP 请求中 `GET` 请求是最常见的一种，并且不需要请求体，因此 `http` 模块也提供了以下便捷 API。

```javascript
http.get('http://www.example.com/', function (response) {});
```

当客户端发送请求并接收到完整的服务端响应头时，就会调用回调函数。在回调函数中，除了可以使用 `response` 对象访问响应头数据，还能把 `response` 对象当作一个只读数据流来访问响应体数据。以下是一个例子。

```javascript
http.get('http://www.example.com/', function(response) {
  var body = [];
  
  console.log(response.statusCode);
  console.log(response.headers);
  
  response.on('data', function (chunk) {
    body.push(chunk);
  });
  
  response.on('end', function() {
    body = Buffer.concat(body);
    console.log(body.toString());
  });
});
```

### HTTPS

`HTTPS` 模块与 `HTTP` 模块极为类似，区别在于 `HTTPS` 模块需要额外处理 SSL 证书。

在服务端模式下，创建一个 HTTPS 服务器的示例如下。

```javascript
var options = {
	key: fs.readFileSync('./ssl/default.key'),
  cert: fs.readFileSync('./ssl/default.cer')
};

var server = https.createServer(options, function(request, response) {
  // ...
});
```

可以看到，与创建 HTTP 服务器相比，多了一个 `options` 对象，通过 `key` 和 `cert` 字段指定了 HTTPS 服务器使用的私钥和公钥。

另外，NodeJS 支持 SNI 技术，可以根据 HTTPS 客户端请求使用的域名动态使用不同的证书，因此同一个 HTTPS 服务器可以使用多个域名提供服务。接着上例，可以使用以下方法为 HTTPS 服务器添加多组证书。

> [SNI]([https://zh.wikipedia.org/wiki/%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%90%8D%E7%A7%B0%E6%8C%87%E7%A4%BA](https://zh.wikipedia.org/wiki/服务器名称指示))，服务器名称指示，是 TLS 的一个扩展协议，在该协议下，在握手过程开始时客户端告诉它正在连接的服务器要连接的主机名称。这允许服务器在相同的 IP 地址和 TCP 端口号上呈现多个证书，并且因此允许在相同的 IP 地址上提供多个安全网站，而不需要所有这些站点使用相同的证书。

```javascript
server.addContext('foo.com', {
  key: fs.readFileSync('./ssl/foo.com.key'),
  cert: fs.readFileSync('./ssl/foo.com.cer')
});

server.addContext('bar.com', {
  key: fs.readFileSync('./ssl/bar.com.key'),
  cert: fs.readFileSync('./ssl/bar.com.cer')
});
```

在客户端模式下，发起一个 HTTPS 客户端请求与 `http` 模块几乎相同，示例如下。

```javascript
var options = {
  hostname: 'www.example.com',
  port: 443,
  path: '/',
  method: 'GET'
};

var request = https.request(options, function(response) {});

request.end();
```

但如果目标服务器使用的 SSL 证书是自制的，不是从颁发机构购买的，默认情况下 `https` 模块会拒绝连接，提示说有证书安全问题。在 `options` 里加入 `rejectUnauthorized: false` 字段可以禁用对证书有效性的检查，从而允许 `https` 模块请求开发环境下使用自制证书的 HTTPS 服务器。

### URL

处理 HTTP 请求时 `url` 模块使用率超高，因为该模块允许解析 URL、生成 URL，以及拼接 URL。首先我们来看看一个完整的 URL 的各组成部分。

```
                           href
 -----------------------------------------------------------------
                            host              path
                      --------------- ----------------------------
 http: // user:pass @ host.com : 8080 /p/a/t/h ?query=string #hash
 -----    ---------   --------   ---- -------- ------------- -----
protocol     auth     hostname   port pathname     search     hash
                                                ------------
                                                   query
```

我们可以使用 `.parse` 方法来将一个 URL 字符串转换为 URL 对象，示例如下。

```javascript
url.parse('http://user:pass@host.com:8080/p/a/t/h?query=string#hash');
/* =>
{
	protocal: 'http',
	auth: 'user:pass',
	host: 'host.com:8080',
	port: '8080',
	hostname: 'host.com',
	hash: '#hash',
	search: '?query=string',
	query: 'query=string',
	pathname: '/p/a/t/h',
	path: '/p/a/t/h?query=string',
	href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'
} */
```

传给 `.parse` 方法的不一定要是一个完整的 URL，例如在 HTTP 服务器回调函数中，`request.url` 不包含协议头和域名，但同样可以用 `.parse` 方法解析。

```javascript
http.createServer(function (request, response) {
	var tmp = resquest.url; // => "/foo/bar?a=b"
  url.parse(tmp);
  /* =>
  {
    protocal: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: '?a=b',
    query: 'a=b',
    pathname: '/foo/bar',
    path: '/foo/bar?a=b',
    href: '/foo/bar?a=b'
  } */
}).listen(80);
```

`.parse` 方法还支持第二个和第三个布尔类型可选参数。第二个参数等于 `true` 时，该方法返回的 URL 对象中，`query` 字段不再是一个字符串，而是一个经过 `querystring` 模块转换后的参数对象。第三个参数等于 `true` 时，该方法可以正确解析不带协议头的 URL，例如 `//www.example.com/foo/bar`。

反过来，`format` 方法允许将一个 URL 对象转换为 URL 字符串，示例如下。

```javascript
url.format({
  protocol: 'http:',
  host: 'www.example.com',
  pathname: '/p/a/t/h',
  search: 'query=string'
});
/* => 
	'http://www.example.com/p/a/t/h?query=string'
*/
```

另外，`.resolve` 方法可以用于拼接 URL，示例如下。

```javascript
url.resolve('http://www.example.com/foo/bar', '../baz');
/* =>
	http://www.example.com/baz
*/
```

### Query String

`querystring` 模块用于实现 URL 参数字符串与参数对象的互相转换，示例如下。

```javascript
querystring.parse('foo=bar&baz=qux&baz=quux&corge');
/* =>
	{ foo: 'bar', baz: ['qux', 'quux'], corge: '' }
*/

querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
/* =>
	'foo=bar&baz=qux&baz=quux&corge='
*/
```

### Zlib

`zlib` 模块提供了数据压缩和解压的功能。当我们处理 HTTP 请求和响应时，可能需要用到这个模块。

首先我们看一个使用 `zlib` 模块压缩 HTTP 响应体数据的例子。这个例子中，判断了客户端是否支持 gzip，并在支持的情况下使用 `zlib` 模块返回 gzip 之后的响应体数据。

```javascript
http.createServer(function(request, response) {
  var i = 1024,
      data = '';
  
  while (i--) {
    data += '.';
  }
  
  if ((request.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
    
		zlib.gzip(data, function(err, data) {
			response.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Encoding': 'gzip'
      });
      
      response.end(data);
    });
    
  } else {
    
    response.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    
    response.end(data);
    
  }
}).listen(80);
```

接着看一个使用 `zlib` 模块解压 HTTP 响应体数据的例子。这个例子中，判断了服务端响应是否使用 gzip 压缩，并在压缩的情况下使用 `zlib` 模块解压响应体数据。

```javascript
var options = {
  hostname: 'www.example.com',
  port: 80,
  path: '/',
  method: 'GET',
  headers: {
    'Accept-Encoding': 'gzip, defalte'
  }
};

http.request(options, function(response) {
  var body = [];
  
  response.on('data', function(chunk) {
		body.push(chunk);
  });
  
  response.on('end', function() {
		body = Buffer.concat(body);
    
    if (response.headers['content-encoding'] === 'gzip') {
      zlib.gunzip(body, function(err, data) {
        console.log(data.toString());
      });
    } else {
      console.log(data.toString());
    }
  });
}).end();
```

### Net

`net` 模块可用于创建 Socket 服务器或 Socket 客户端。由于 Socket 在前端领域的使用范围还不是很广，这里先不涉及到 WebSocket 的介绍，仅仅简单演示一下**如何从 Socket 层面来实现 HTTP 请求和响应**。

首先来看一个使用 Socket 搭建一个很不严谨的 HTTP 服务器的例子。这个 HTTP 服务器不管收到什么请求，都固定返回相同的响应。

```javascript
net.createServer(function(conn) {
  conn.on('data', function(data) {
		conn.write([
      'HTTP/1.1 200 OK',
      'Content-Type: text/plain',
      'Content-Length: 11',
      '',
      'Hello World'
    ].join('\n'));
  });
}).listen(80);
```

接着看一个使用 Socket 发起 HTTP 客户端请求的例子。这个例子中，Socket 客户端在建立连接后发送了一个 HTTP GET 请求，并通过 `data` 事件监听函数来获取服务器响应。

```javascript
var options = {
	port: 80,
  host: 'www.example.com'
};

var client = net.connect(options, function() {
  client.write([
    'GET / HTTP/1.1',
    'User-Agent: curl/7.26.0',
    'Host: www.google.com',
    'Accept: */*',
    '',
    ''
  ].join('\n'));
});

client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});
```

## 灵机一点

- 问：为什么通过 `headers` 对象访问到的 HTTP 请求头或响应头字段不是驼峰的？

  答：从规范上讲，HTTP 请求头和响应头字段都应该是驼峰的。但现实是残酷的，不是每个 HTTP 服务端或客户端程序都严格遵循规范，所以 NodeJS 在处理别的客户端或服务端收到的头字段时，都统一地转换为了小写字母格式，以便开发者能使用统一的方式来访问头字段，例如 `headers['content-length']`。

- 问：为什么 `http` 模块创建的 HTTP 服务器返回的响应是 `chunked` 传输方式的？

  答：因为默认情况下，使用 `.writeHead` 方法写入响应头后，允许使用 `.write` 方法写入任意长度的响应体数据，并使用 `.end` 方法结束一个响应。由于响应体数据长度不确定，因此 NodeJS 自动在响应头里添加了 `Transfer-Encoding: chunked` 字段，并采用 `chunked` 传输方式。但是当响应体数据长度确定时，可使用 `.writeHead` 方法在响应头里加上 `Content-Length` 字段，这样做之后 NodeJS 就不会自动添加 `Transfer-Encoding` 字段和使用 `chunked` 传输方式。

- 问：为什么使用 `http` 模块发起 HTTP 客户端请求时，有时候会发生 `socket hang up` 错误？

  答：发起客户端 HTTP 请求前需要先创建一个客户端。`http` 模块提供了一个全局客户端 `http.globalAgent`，可以让我们使用 `.request` 或 `.get` 方法时不用手动创建客户端。但是全局客户端默认只允许5个并发 Socket 连接，当某一个时刻 HTTP 客户端请求创建过多，超过这个数字时，就会发生 `socket hang up` 错误。解决方法是通过 `http.globalAgent.maxSockets` 属性把这个数字改大些。另外，`https` 模块遇到这个问题时也一样通过 `https.globalAgent.maxSockets` 属性来处理。

## 小结

本章介绍了使用 NodeJS 操作网络时需要的 API 以及一些坑回避技巧，总结起来有以下几点：

- `http` 和 `https` 模块支持服务端模式和客户端模式两种使用方式
- `request` 和 `response` 对象除了用于读写头数据外，都可以当作数据流来操作
- `url.parse` 方法加上 `request.url` 属性是处理 HTTP 请求时的固定搭配
- 使用 `zlib` 模块可以减少使用 HTTP 协议时的数据传输量
- 通过 `net` 模块的 Socket 服务器与客户端可对 HTTP 协议做底层操作
- 小心踩坑

# 5. 进程管理

NodeJS 可以感知和控制自身进程的运行环境和状态，也可以创建子进程并与其协同工作，这使得 NodeJS 可以把多个程序组合在一起共同完成某项工作，并在其中充当胶水和调度器的作用。本章除了介绍与之相关的 NodeJS 内置模块外，还会重点介绍典型的使用场景。

我们已经知道 NodeJS 自带的 `fs` 模块比较基础，把一个目录里的所有文件和子目录都拷贝到另一个目录里要写不少代码。另外我们知道，终端下的 `cp` 命令比较好用，一条 `cp -r source/* target` 命令就能搞定目录拷贝。那我们首先看看如何**使用 NodeJS 调用终端命令来简化目录拷贝**，示例代码如下：

```javascript
var child_process = require('child_process');
var util = require('util');

function copy(source, target, callback) {
  child_process(
    util.format('cp -r %s/* %s', source, target), callback
  );
}

copy('a', 'b', function(err) {
  // ...
});
```

从以上代码可以看到，子进程是异步运行的，通过回调函数返回执行结果。

> **format 函数的基本用法**
>
> format 函数根据第一个参数，返回一个格式化字符串，第一个参数是一个可包含零个或多个占位符的字符串。每一个占位符被替换为与其对应的转换后的值，支持的占位符有："**%s(字符串)**"、"**%d(数字)**"、"**%j(JSON)**"、"**%(单独一个百分号则不作为一个参数)**"。
>
> 1. 如果占位符没有相对应的参数，占位符将不会被替换。如示例：
>
>    ```js
>    var util = require('util');
>    var result = util.format('%s:%s', 'foo');
>    console.log(result); // 'foo:%s'
>    ```
>
> 2. 如果有多个参数占位符，额外的参数将会调用 `util.inspect()` 转换为字符串。这些字符串被连接在一起，并且以空格分隔。如示例：
>
>    ```js
>    var util = require('util');
>    var result = util.format('%s:%s', 'foo', 'bar', 'baz');
>    console.log(result); // 'foo:bar baz'
>    ```
>
> 3. 如果第一个参数是一个非格式化字符串，则会把所有的参数转成字符串并以空格隔开拼接在一起，而且返回该字符串。如示例：
>
>    ```js
>    var util = require('util');
>    var result = util.format(1, 2, 3);
>    console.log(result); // '1 2 3'
>    ```

## API

### *Process（进程）*

任何一个进程都有启动进程时使用的命令行参数，有标准输入标准输出，有运行权限，有运行环境和运行状态。在 NodeJS 中，可以通过 `process` 对象感知和控制 NodeJS 自身进程的方方面面。另外需要注意的是，`process` 不是内置模块，而是一个全局对象，因此在任何地方都可以直接使用，无需使用 `require()`。

### *Child Process（子进程）*

使用 `child_process` 模块可以创建和控制子进程。该模块提供的 API 中最核心的是 `.spawn`，其余 API 都是针对特定使用场景对它的进一步封装，算是一种语法糖。

### *Cluster（集群）*

`cluster` 模块是对 `child_process` 模块的进一步封装，专用于解决单进程 NodeJS Web 服务器无法充分利用多核 CPU 的问题。使用该模块可以简化多进程服务器程序的开发，让每个核上运行一个工作进程，并统一通过主进程监听端口和分发请求。

## 应用场景

和进程管理相关的 API 单独介绍起来比较枯燥，因此从一些典型的应用场景出发，分别介绍一些重要 API 的使用方法。

**_如何获取命令行参数_**

​	在 NodeJS 中可以通过 `process.argv` 获取命令行参数。但是比较意外的是，`node` 执行程序路径和主模块文件路径固定占据了 `argv[0]` 和 `argv[1]` 两个位置，而第一个命令行参数从 `argv[2]` 开始。为了让 `argv` 使用起来更加自然，可以按照以下方式处理。

```javascript
function main(argv) {
	// ...
}

main(process.argv.slice(2));
```

**_如何退出程序_**

​	通常一个程序做完所有事情后就正常退出了，这时程序的退出状态码为 `0`。或者一个程序运行时发生了异常后就挂了，这时程序的退出状态码不等于 `0`。如果我们在代码中捕获了某个异常，但是觉得程序不应该继续运行下去，需要立即退出，并且需要把状态码设置为指定数字，比如 `1`，就可以按照以下方式：

```javascript
try {
  // ...
} catch (err) {
  // ...
  process.exit(1);
}
```

**_如何控制输入输出_**

​	NodeJS 程序的标准**输入流**（stdin）、一个标准**输出流**（stdout）、一个标准**错误流**（stderr）分别对应 `process.stdin`、`process.stdout` 和 `process.stderr`，第一个是只读数据流，后边两个是只写数据流，对它们的操作按照对数据流的操作方式即可。例如，`console.log` 可以按照以下方式实现。

```javascript
function log() {
	process.stdout.write(
  	util.format.apply(util, arguments) + '\n'
  );
}
```

**_如何降权_**

在 Linux 系统下，我们知道需要使用root权限才能监听1024以下端口。但是一旦完成端口监听后，继续让程序运行在 root 权限下存在安全隐患，因此最好能把权限降下来。以下是这样一个例子。

```javascript
http.createServer(callback).listen(80, function() {
  var env = process.env,
      uid = parseInt(env['SUDO_UID'] || process.getuid(), 10),
      gid = parseInt(env['SUDO_GID'] || process.getgid(), 10);
  
  process.setgid(gid);
  process.setuid(uid);
});
```

上例中有几点需要注意：

1. 如果是通过 `sudo` 获取root权限的，运行程序的用户的 UID 和 GID 保存在环境变量 `SUDO_UID` 和 `SUDO_GID` 里边。如果是通过 `chmod +s` 方式获取root权限的，运行程序的用户的 UID 和 GID 可直接通过 `process.getuid` 和 `process.getgid` 方法获取。
  
2. `process.getuid` 和 `process.getgid` 方法只接受 `number` 类型的参数。

3. **降权时必须先降 GID 再降 UID**，否则顺序反过来的话就没权限更改程序的 GID 了。

**_如何创建子进程_**

​	以下是一个创建 NodeJS 子进程的例子。

```javascript
var child = child_process.spawn('node', ['xxx.js']);

child.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

child.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

child.on('close', function (code) {
  console.log('child process exited with code ' + code);
});
```

上例中使用了 `child_process.spawn(command[, args][, options])` 方法，该方法支持三个参数。第一个参数是要运行的命令。第二个参数是字符串参数的列表，数组中的每个成员都按顺序对应一个命令行参数。第三个参数可选，用于配置子进程的执行环境与行为。

`child_process.spawn()` 方法使用给定的 `command` 衍生一个新进程，并带上 `args` 中的命令行参数。如果省略 `args`，则其默认为一个空数组。

另外，上例中虽然通过子进程对象的 `.stdout` 和 `.stderr` 访问子进程的输出，但通过 `options.stdio` 字段的不同配置，可以将子进程的输入输出重定向到任何数据流上，或者让子进程共享父进程的标准输入输出流，或者直接忽略子进程的输入输出。

**_进程间如何通讯_**

在 Linux 系统下，进程之间可以通过信号互相通信。以下是一个例子。

```javascript
/* parent.js */
var child = child_process.spawn('node', ['child.js']);

child.kill('SIGTERM');

/* child.js */
process.on('SIGTERM', function () {
  cleanUp();
  process.exit(0);
});
```

在上例中，父进程通过 `.kill` 方法向子进程发送 `SIGTERM` 信号，子进程监听 `process` 对象的  `SIGTERM` 事件响应信号。**不要被 `.kill` 方法的名称迷惑了，该方法本质上是用来给进程发送信号的，进程收到信号具体做什么，完全取决于信号的种类和进程自身的代码。**

另外，如果父子进程都是 NodeJS 进程，就可以通过 IPC（进程间通讯）双向传递数据。以下是一个例子。

```javascript
/* parent.js */
var child = child_process.spawn('node', ['child.js'], {
  stdio: [0, 1, 2, 'ipc']
});

child.on('message', function (msg) {
  console.log(msg);
});

child.send({ hello: 'hello' });

/* child.js */
process.on('message', function (msg) {
  msg.hello = msg.hello.toUpperCase();
  process.send(msg);
});
```

可以看到，父进程在创建子进程时，在 `options.stdio` 字段中通过 `ipc` 开启了一条 IPC 通道，之后就可以监听子进程对象的 `message` 事件接收来自子进程的消息，并通过 `.send` 方法给子进程发送消息。在子进程这边，可以在 `process` 对象上监听 `message` 事件接收来自父进程的消息，并通过 `.send` 方法向父进程发送消息。**数据在传递过程中，会先在发送端使用 `JSON.stringify` 方法序列化，再在接收端使用 `JSON.parse` 方法反序列化。**

**_如何守护子进程_**

守护进程一般用于监控工作进程的运行状态，在工作进程不正常退出时重启工作进程，保障工作进程不间断运行。以下是一种实现方式。

```javascript
function spawn(mainModule) {
  var worker = child_process.spawn('node', [mainModule]);
  
  worker.on('exit', function (code) {
    if (code !== 0) spawn(mainModule);
  });
}

spawn('worker.js');
```

可以看到，工作进程非正常退出时，守护进程立即重启工作进程。

## 小结

本章介绍了使用 NodeJS 管理进程时需要的 API 以及主要的应用场景，总结起来有以下几点：

- 使用 `process` 对象管理自身

  

- 使用 `child_process` 模块创建和管理子进程

# 异步编程

NodeJS 最大的卖点——事件机制和异步IO，对开发者并不是透明的。开发者需要按异步方式编写代码才用得上这个卖点，而这一点也遭到了一些 NodeJS 反对者的抨击。但不管怎样，异步编程确实是 NodeJS 最大的特点，没有掌握异步编程就不能说是真正学会了 NodeJS。本章将介绍与异步编程相关的各种知识。

## 回调

在代码中，异步编程的直接体验就是回调。异步编程依托于回调来实现，但不能说使用了回调之后程序就异步化了。首先看以下代码。

```javascript
function heavyCompute(n, callback) {
	var count = 0,
      i, j;
  
  for (i = n; i > 0; --i) {
		for (j = n; j > 0; --j) {
			count += 1;
    }
  }
  
  callback(count);
}

heavyCompute(10000, function (count) {
  console.log(count);
});

console.log('hello');

-- Console ------------------------------
100000000
hello
```

可以看到，以上代码中的回调函数仍然先于后续代码执行。JS 本身是单线程运行的，不可能在一段代码还未结束运行时去运行别的代码，因此也就不存在异步执行的概念。

但是，如果某个函数做的事情是创建一个别的线程或进程，并与 JS 主线程并行地做一些事情，并在事情做完后通知 JS 主线程，那情况又不一样了。接着看以下代码。

```javascript
setTimeout(function() {
  console.log('world');
}, 1000);

console.log('hello');

-- Console ------------------------------
hello
world
```

这次可以看到，回调函数后于后续代码执行了。如同上边所说，JS 本身是单线程的，无法异步执行，因此我们可以认为 `setTimeout` 这类 JS 规范之外的由运行环境提供的特殊函数做的事情是创建一个平行线程后立即返回，让 JS 主进程可以接着执行后续代码，并在收到平行进程的通知后再执行回调函数。除了 `setTimeout`、`setInterval` 这些常见的，这类函数还包括 NodeJS 提供的诸如 `fs.readFile` 之类的异步API。

另外，我们仍然回到 JS 是单线程运行的这个事实上，这决定了 JS 在执行完一段代码之前无法执行包括回调函数在内的别的代码。也就是说，即使平行线程完成工作了，通知 JS 主线程执行回调函数了，回调函数也要等到 JS 主线程空闲时才能开始执行。以下就是这么一个例子。

```javascript
function heavyCompute(n) {
  var count = 0,
        i, j;

  for (i = n; i > 0; --i) {
    for (j = n; j > 0; --j) {
      count += 1;
    }
  }
}

var t = new Date();

setTimeout(function () {
  console.log(new Date() - t);
}, 1000);

heavyCompute(50000);

-- Console ------------------------------
8520
```

可以看到，本来应该在1秒后被调用的回调函数因为 JS 主线程忙于运行其他代码，实际执行时间被大幅延迟。

## 代码设计模式

异步编程有很多特有的代码设计模式，为了实现同样的功能，使用同步方式和异步方式编写的代码会有很大差异。以下分别介绍一些常见的模式。

**_函数返回值_**

使用一个函数的输出作为另一个函数的输入是很常见的需求，在同步方式下一般按以下方式编写代码：

```javascript
var output = fn1(fn2('input'));
// Do something.
```

而在异步方式下，由于函数执行结果不是通过返回值，而是通过回调函数传递，因此一般按以下方式编写代码：

```javascript
fn2('input', function (output2) {
  fn1(output2, function (output1) {
    // Do something.
  });
});
```

可以看到，这种方式就是一个回调函数套一个回调函数，套的太多了很容易写出 `>` 形状的代码（回调地狱）。

**_遍历数组_**

在遍历数组时，使用某个函数依次对数据成员做一些处理也是常见的需求。如果函数是同步执行的，一般就会写出以下代码：

```javascript
var len = arr.length,
    i = 0;

for (; i < len; ++i) {
  arr[i] = sync(arr[i]);
}

// All array items have processed.
```

如果函数是异步执行的，以上代码就无法保证循环结束后所有数组成员都处理完毕了。如果数组成员必须一个接一个串行处理，则一般按照以下方式编写异步代码：

```javascript
(function next(i, len, callback) {
  if (i < len) {
    async(arr[i], function (value) {
      arr[i] = value;
      next(i + 1, len, callback);
    });
  } else {
    callback();
  }
})(0, arr.length, function () {
  // All array items have processed.
});
```

可以看到，以上代码在异步函数执行一次并返回执行结果后才传入下一个数组成员并开始下一轮执行，直到所有数组成员处理完毕后，通过回调的方式出发后续代码的执行。

如果数组成员可以并行处理，但后续代码仍然需要所有数组成员处理完毕后才能执行的话，则异步代码会调整为以下形式：

```javascript
(function (i, len, count, callback) {
  for (; i < len; ++i) {
    (function(i) {
      async(arr[i], function (value) {
        arr[i] = value;
        if (++count === len) {
          callback();
        }
      });
    })(i);
  }
})(0, arr.length, 0, function() {
  // All array items have processed.
});
```

可以看到，与异步串行遍历的版本相比，以上代码并行处理所有数组成员，并通过计数器变量来判断什么时候所有数组成员都处理完毕了。

**_异常处理_**

JS 自身提供的异常捕获和处理机制——`try...catch...`，只能用于同步执行的代码。以下是一个例子。

```javascript
function sync(fn) {
  return fn();
}

try {
  sync(null);
  // Do something.
} catch (err) {
  console.log('Error: %s', err.message);
}

-- Console ------------------------------
Error: fn is not a function
```

可以看到，异常会沿着代码执行路径一直冒泡，知道遇到第一个 `try` 语句时被捕获住。但由于异步函数会打断代码执行路径，异步函数执行过程中以及执行之后产生的异常冒泡到执行路径被打断的位置时，如果一直没有遇到 `try` 语句，就作为一个全局异常抛出。以下是一个例子。

```javascript
function async(fn, callback) {
  // Code execution path breaks here.
  setTimeout(function () {
    callback(fn());
  }, 0);
}

try {
  async(null, function (data) {
    // Do something.
  });
} catch (err) {
  console.log('Error: %s', err.message);
}

-- Console ------------------------------ 
/Users/sanqi/Desktop/parent.js:4
    callback(fn());
             ^

TypeError: fn is not a function
    at Timeout._onTimeout (/Users/sanqi/Desktop/parent.js:4:14)
    at ontimeout (timers.js:436:11)
    at tryOnTimeout (timers.js:300:5)
    at listOnTimeout (timers.js:263:5)
    at Timer.processTimers (timers.js:223:10)
```

因为代码执行路径被打断了，我们就需要在异常冒泡到断点之前用 `try` 语句把异常捕获住，并通过回调函数传递被捕获的异常。于是我们可以像下边这样改造上边的例子。

```javascript
function async(fn, callback) {
  // Code execution path breaks here.
  setTimeout(function() {
    try {
      callback(null, fn());
    } catch (err) {
      callback(err);
    }
  }, 0);
}

async(null, function (err, data) {
  if (err) {
    console.log('Error: %s', err.message);
  } else {
    // Do something.
  }
});

-- Console ------------------------------
Error: fn is not a function
```

可以看到，异常再次被捕获住了。在 NodeJS 中，几乎所有异步 API 都按照以上方式设计，回调函数中第一个参数都是 `err`。因此我们在编写自己的异步函数时，也可以按照这种方式来处理异常，与 NodeJS 的设计风格保持一致。

有了异常处理方式后，我们接着可以想一想一般我们是怎么写代码的。基本上，我们的代码都是做一些事情，然后调用一个函数，然后再做一些事情，然后再调用一个函数，如此循环。如果我们写的是同步代码，只需要在代码入口点写一个 `try` 语句就能捕获所有冒泡上来的异常，示例如下。

```javascript
function main() {
  // Do something.
  syncA();
  // Do something.
  syncB();
  // Do something.
  syncC();
}

try {
  main();
} catch (err) {
  // Deal with exception.
}
```

但是，如果我们写的是异步代码，由于每次异步函数调用都会打断代码执行路径，只能通过回调函数来传递异常，于是我们就需要在每个回调函数里判断是否有异常发生，于是只用三次异步函数调用，就会产生下边这种代码。

```javascript
function main(callback) {
  // Do something.
  asyncA(function (err, data) {
    if (err) {
      callback(err);
    } else {
      // Do something.
      asyncB(function (err, data) {
        if (err) {
          callback(err);
        } else {
          // Do something.
          asyncC(function (err, data) {
            if (err) {
              callback(err);
            } else {
              // Do something.
              callback(null);
            }
          });
        }
      });
    }
  });
}

main (function (err) {
  if (err) {
    // Deal with exception.
  }
});
```

可以看到，回调函数已经让代码变得复杂了，而异步方式下对异常的处理更加剧了代码的复杂度。如果 NodeJS 的最大卖点最后变成这个样子，那就没人愿意用 NodeJS 了，因此接下来会介绍 NodeJS 提供的一些解决方案。

## 域

NodeJS 提供了 `domain` 模块，可以简化异步代码的异常处理。在介绍该模块之前，我们需要首先理解“域”的概念。简单地讲，一个域就是一个 JS 运行环境，在一个运行环境中，如果一个异常没有被捕获，将作为一个全局异常被抛出。NodeJS 通过 `process` 对象提供了捕获全局异常的方法，示例代码如下。

```javascript
process.on('uncaughtException', function (err) {
  console.log('Error: %s', err.message);
});

setTimeout(function (fn) {
  fn();
}, 0);

-- Console ------------------------------
Error: fn is not a function
```

虽然全局异常有个地方可以捕获了，但是对于大多数异常，我们希望尽早捕获，并根据结果决定代码的执行路径。我们用以下 HTTP 服务器代码作为例子：

```javascript
function async(request, callback) {
  // Do something.
  asyncA(request, function (err, data) {
    if (err) {
      callback(err);
    } else {
      // Do something.
      asyncB(request, function (err, data) {
        if (err) {
          callback(err);
        } else {
          // Do something.
          asyncC(request, function (err, data) {
            if (err) {
              callback(err);
            } else {
              // Do something.
              callback(null, data);
            }
          });
        }
      });
    }
  });
}

http.createServer(function (request, response) {
  async(request, function (err, data) {
    if (err) {
      response.writeHead(500);
      response.end();
    } else {
      response.writeHead(200);
      response.end(data);
    }
  });
});
```

以上代码将请求对象交给异步函数处理后，再根据处理结果返回响应。这里采用了使用回调函数传递异常的方案，因此 `async` 函数内部如果再多几个异步函数调用的话，代码就变成上边这样。为了让代码好看点，我们可以在每处理一个请求时，使用 `domain` 模块创建一个子域（JS 子运行环境）。在子域内运行的代码可以随意抛出异常，而这些异常可以通过子域对象的 `error` 事件统一捕获。于是以上代码可以做如下改造：

```javascript
function async(request, callback) {
  // Do something.
  asyncA(request, function (data) {
    // Do something.
    asyncB(request, function (data) {
      // Do something.
      asyncC(request, function (data) {
        // Do something.
        callback(data);
      });
    });
  });
}

http.createServer(function (request, response) {
  var d = domain.create();

  d.on('error', function () {
    response.writeHead(500);
    response.end();
  });

  d.run(function () {
    async(request, function (data) {
      response.writeHead(200);
      response.end(data);
    });
  });
});
```

可以看到，我们使用 `.create` 方法创建了一个子域对象，并通过 `.run` 方法进入需要在子域中运行的代码的入口点。而位于子域中的异步函数回调函数由于不再需要捕获异常，代码一下子瘦身很多。

### 陷阱

无论是通过 `process` 对象的 `uncaughtException` 事件捕获到全局异常，还是通过子域对象的 `error` 事件捕获到了子域异常，在 NodeJS 官方文档里都强烈建议**处理完异常后立即重启程序**，而不是让程序继续运行。按照官方文档的说法，发生异常后的程序处于一个不确定的运行状态，如果不立即退出的话，程序可能会产生严重内存泄漏，也可能表现得很奇怪。

但这里需要澄清一些事实。JS本身的 `throw..try..catch` 异常处理机制并不会导致内存泄漏，也不会让程序的执行结果出乎意料，但NodeJS并不是存粹的JS。NodeJS里大量的API内部是用C/C++实现的，因此NodeJS程序的运行过程中，代码执行路径穿梭于JS引擎内部和外部，而JS的异常抛出机制可能会打断正常的代码执行流程，导致C/C++部分的代码表现异常，进而导致内存泄漏等问题。

因此，使用 `uncaughtException` 或 `domain` 捕获异常，代码执行路径里涉及到了C/C++部分的代码时，如果不能确定是否会导致内存泄漏等问题，最好在处理完异常后重启程序比较妥当。而使用 `try` 语句捕获异常时一般捕获到的都是JS本身的异常，不用担心上述问题。

## 小结

本章介绍了 JS 异步编程相关的知识，总结起来有以下几点：

- 不掌握异步编程就不算学会 NodeJS

  

- 异步编程依托于回调来实现，而使用回调函数不一定就是异步编程

  

- 异步编程下的函数间数据传递、数组遍历和异常处理与同步编程有很大差别

  

- 使用 `domain` 模块简化异步代码的异常处理，并小心陷阱

