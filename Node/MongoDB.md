# 1. 安装（macOS）

MongoDB 下载地址：https://www.mongodb.com/download-center#community

也可以使用 curl 命令来下载安装：

```shell
# 进入 /usr/local
cd /usr/local

# 下载
sudo curl -O https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-4.2.6.tgz

# 解压
sudo tar -zxvf mongodb-macos-x86_64-4.2.6.tgz

# 重命令为 mongodb 目录
sudo mv mongodb-macos-x86_64-4.2.6/ mongodb
```

安装完成后，可以把 MongoDB 的二进制命令文件目录添加到 PATH 路径中：

```shell
export PATH=/usr/local/mongodb/bin:$PATH
```

**注意：如果使用了zsh，则需要将该配置添加到 `~/.zshrc` 文件中。**

最后，输入 `mongod --version` 测试是否安装成功。

# 2. 启动和关闭数据库

## 启动

MongoDB 默认使用 `/data/db` 作为数据存储目录，但如果 mac 已更新到 Catalina 系统，则根文件夹不再可写。第一种解决方案是先将安全模式关闭，再创建 `/data/db` 文件夹，最后再打开电脑的安全模式；鉴于第一种方案太麻烦，因此也可以在每次启动 MongoDB 数据库时都指定 MongoDB 数据库路径：

```shell
sudo mongod --dbpath=/Users/user/data/db
```

## 关闭

`Ctrl + c`

# 3. 连接和退出数据库

## 连接

在启动 MongoDB 数据库时，再打开一个终端输入：

```shell
mongo
```

## 退出

`Ctrl + c`

# 4. 基本概念

- 可以有多个数据库
- 一个数据库中可以有多个集合（数据表）
- 一个集合中可以有多个文档（记录）
- 文档结构没有任何限制
- 不需要先创建数据库、表、设计表结构，当插入文档的时候，只需要指定往哪个数据库的哪个集合操作就可以了，一切都由 MongoDB 自动完成建库建表

```json
{
	"db": {
		"collection": [
			{"name": "Jack", "age": 20},
			{"name": "Pony", "age": 22},
			{"name": "Sasha", "age": 23}
		]
	}
}
```

# 5. 基本命令

|                 命令                 |                 含义                 |
| :----------------------------------: | :----------------------------------: |
|              `show dbs`              |            查看所有数据库            |
|                 `db`                 |          查看当前操作数据库          |
|         `use DATABASE_NAME`          | 切换到指定的数据库（如果没有会新建） |
|          `show collections`          |             查看已有集合             |
| `db.users.insert({"name": "SANKI"})` |           向集合中插入文档           |
|          `db.users.find()`           |           查询集合中的文档           |

MongoDB 中默认的数据库为 test，如果没有创建新的数据库，集合将存放在 test 数据库中。

**注意：在 MongoDB 中，集合只有在内容插入后才会创建！也就说，创建集合（数据表）后要再插入一个文档（记录），集合才会真正创建。**

# 6. 在 Node 中如何操作 MongoDB 数据库

## 官方 MongoDB 包

https://github.com/mongodb/node-mongodb-native

## 第三方 mongoose 包

https://mongoosejs.com/

### 起步

安装：`npm i mongoose`

DEMO：

```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));
```

### 官方指南

**设计 Scheme 发布 Model**

```js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 1. 连接数据库
// 指定连接的数据库不需要存在，当插入第一条数据之后就会自动被创建出来
mongoose.connect('mongodb://127.0.0.1:27017/test')

// 2. 设计文档结构（表结构）
// 字段名称就是表结构中的属性名称
// 约束的目的是为了保证数据的完整性，不要有脏数据
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String
  }
})

// 3. 将文档结构发布为模型
// mongoose.model 方法用来将一个架构发布为 model
// 第一个参数：传入一个答大写名词单数字符串用来表示数据库名称
//           mongoose 会自动将大写名词的字符串生成小写复数的集合名称
//           例如这里的 User 最终会变味 users 集合名称
// 第二个参数：文档结构
// 返回值：模型构造函数
const User = mongoose.model('User', userSchema)

// 当有了模型构造函数之后，就可以使用这个构造函数对 users 集合中的数据进行增删改查操作
```

**增加数据**

```js
const admin = new User({
  username: 'admin',
  password: '123456',
  email: 'admin@admin.com'
})

admin.save().then(value => {
  console.log(value)
}, reason => {
  console.error(reason)
})
```

**查询数据**

```js
// ⭐️ 查询所有，返回数组
User.find().then(value => {
  console.log(value)
}, reason => {
  console.error(reason)
})

// ⭐️ 按条件查询所有，返回数组
User.find({
  username: 'admin'
}).then(value => {
  console.log(value)
}, reason => {
  console.error(reason)
})

// ⭐️ 按条件查询单个，返回一个对象
User.findOne({
  username: 'admin'
}).then(value => {
  console.log(value)
}, reason => {
  console.error(reason)
})
```

**删除数据**

```js
// ⭐️ 根据指定条件删除一个
User.deleteOne({
  username: 'sanki'
}).then(value => {
  console.log(value)
}, reason => {
  console.error(reason)
})
Model.findOneAndRemove(conditions [, options] [, callback])

// ⭐️ 根据指定条件删除所有
Model.deleteMany(conditions [, callback])

// ⭐️ 根据id删除一个
Model.findByIdAndRemove(id [, options] [, callback])
```

**更新数据**

```js
// ⭐️ 根据指定条件更新一个
Model.findOneAndUpdate([conditions] [, update] [, options] [, callback])
Model.updateOne(conditions, doc [, options] [, callback])

// ⭐️ 根据条件更新所有
Model.update(conditions, doc [, options] [, callback])
Model.updateMany(conditions, doc [, options] [, callback])

// ⭐️ 根据id更新一个
Model.findByIdAndUpdate(id [, update] [, options] [, callback])
```

