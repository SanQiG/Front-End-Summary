# TypeScript

## TS 增加了什么？

类型、支持 ES 的新特性、添加 ES 不具备的新特性、强大的开发工具、丰富的配置选项

## 自动类型判断

TS 拥有自动的类型判断机制

当对变量的声明和赋值是同时进行的，TS 编译器会自动判断变量的类型

所以如果你的变量的声明和赋值是同时进行的，可以省略掉类型声明

### 类型

| 类型    | 例子            | 描述                            |
| ------- | --------------- | ------------------------------- |
| number  | 1, -33, 2.5     | 任意数字                        |
| string  | 'hi', "hi"      | 任意字符串                      |
| boolean | true, false     | 布尔值                          |
| 字面量  | 其本身          | 限制变量的值就是该字面量的值    |
| any     | *               | 任意类型                        |
| unknown | *               | 类型安全的 any                  |
| void    | 空值(undefined) | 没有值                          |
| never   | 没有值          | 不能是任何值                    |
| object  | {name: 'ts'}    | 任意的 js 对象                  |
| array   | [1, 2, 3]       | 任意 js 数组                    |
| tuple   | [4, 5]          | 元素，ts 新增类型，固定长度数组 |
| enum    | enum{A, B}      | 枚举，ts 新增类型               |

### 字面量类型

```typescript
let a: 10;
a = 10;

// 可以使用 | 来连接多个类型（联合类型）
let b: 'male' | 'female';
b = 'male';
b = 'female';

let c: boolean | string;
c = true;
c = 'hello';
```

### any 与 unknown

```typescript
// any 表示的是任意类型，一个变量设置类型为 any 后相当于对该变量关闭了 ts 的类型检测
// 使用 ts 时不建议使用 any 类型
let d: any;

// 声明变量如果不指定类型，则 ts 解析器会自动判断变量的类型为 any（隐式的 any）
let d;
d = 10;
d = 'hello';
d = false;

// unknown 表示未知类型的值
let e: unknown;
e = 10;
e = true;
e = 'hello';

let s: string;
// d 的类型的 any，它可以复制给任意变量，unknown
s = d;

// unknown 实际上就是一个类型安全的 any
// unknown 类型的变量不能直接复制给其他变量
if (typeof e === 'string') {
  s = e;
}

// 类型断言，可以用来告诉解析器变量的实际类型，以下两种断言方式均可
s = e as string;
s = <string> e;
```

### void 和 never

```typescript
// void 用来表示空，以函数为例，就表示没有返回值的函数
function fn(): void {
}

// never 表示永远不会返回结果
function fn2(): never {
	throw new Error('报错了!');
}
```

### object

```typescript
// {} 用来指定对象中可以包含哪些属性
// 语法：{属性名: 属性值, 属性名: 属性值}
// 在属性名后加上 ? 表示属性是可选的
let b = { name: string, age?: number };
b = { name: 'sanki', age: 24 };

// [propName: string]: any 表示任意类型的属性
let c = { name: string, [prop: string]: any };
c = { name: 'sanki', age: 24, gender: 1 };

let d: (a: number, b: number) => number;
d = function (n1, n2) {
  return n1 + n2;
}
```

### 数组

```typescript
// string[] 表示字符串数组
let e: string[];
ee = ['a', 'b', 'c'];

let f: Array<number>;
ff = [1, 2, 3];
```

### 元组

```typescript
// 元组，元祖就是固定长度的数组
let h: [string, number];
h = ['hello', 123];
```

### 枚举

```typescript
enum Gender {
  Male,
  Female
}

let i: { name: string, gender: Gender };
i = {
  name: 'sanki',
  gender: Gender.Male
}

console.log(i.gender === Gender.Male);
```

### 类型的别名

```typescript
type myType = 1 | 2 | 3 | 4 | 5;
let k: myType;
let l: myType;
```

## 编译选项

`tsconfig.json` 是 ts 编译器的配置文件，ts 编译器可以根据它的信息来对代码进行编译。

```json
/*
 * "include" 用来指定哪些 ts 文件需要被编译
 * "exclude" 不需要被编译的文件目录
 *   - 默认值：['node_modules', 'bower_components', 'jspm_packages']
 * "compilerOptions" 编译器的选项
 *   - "target": 指定 ts 被编译为的 es 的版本 ['es3', 'es5', 'es6', 'es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'esnext']
 *   - "module": 指定要使用的模块化规范 ['none', 'commonjs', 'amd', 'system', 'umd', 'es6', 'es2015', 'es2020', 'esnext']
 *   - "lib": 指定项目中要使用的库
 *   - "outDir": 指定编译后文件所在的目录
 *   - "outFile": 将代码合并成一个文件，在·设置 outFile 后，所有的全局作用域中的代码会合并到同一个文件中
 *   - "allowJs": 是否对 js 文件进行编译，默认是 false
 *   - "checkJs": 是否检查 js 代码是否符合语法规范，默认是 false
 *   - "removeComments": 是否移除注释，默认是 false
 *   - "noEmit": 不生成编译后的文件，默认是 false
 *   - "noEmitOnError": 当有错误时不生成编译后的文件，默认是 false
 *   - "strict": 所有严格检查的总开关
 *   - "alwaysStrict": 设置编译后的文件是否使用严格模式，默认是 false
 *   - "noImplicitAny": 不允许隐式的 any 类型
 *   - "noImplicitThis": 不允许隐式的 this
 *   - "strictNullChecks": 严格地检查空值(好用!!!)
 */
{
  "include": [
    "./src/**/*"
  ],
  "exclude": [
    // "./src/hello/**/*"
  ],
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    // "lib": [],
    "outDir": "./dist",
    // "outFile": "./dist/app.js",
    "allowJs": true,
    "checkJs": true,
    "removeComments": true,
    "noEmit": false,
    "noEmitOnError": true,
    "strict": true,
    "alwaysStrict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true
  }
}
```

## 面向对象

