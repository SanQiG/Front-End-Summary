## [VDOM](<https://github.com/SanQiG/Front-End-Summary/blob/master/React/VDOM.md>)

## [Redux](<https://github.com/SanQiG/Front-End-Summary/blob/master/React/Redux.md>)

## Vue 和 React 的区别

改变数据方式不同，Vue修改状态相比来说要简单的多，React需要使用setState来改变状态，并且使用这个API也有一些坑点。Vue的底层使用了依赖追踪，页面更新渲染已经是最优的了，但是React还是需要用户手动去优化这方面的问题。

React需要使用JSX，Vue使用了模板语法。

## React 优点是什么？

- JSX的引入，使得组件的代码更加可读，也更容易看懂组件的布局，或者组件之间是如何互相引用的
- 支持服务器端渲染，可改进SEO和性能
- 易于测试
- React只关注View层，所以可以和其他任何框架（Backbone.js，Angular.js）一起使用

## React 生命周期函数

React生命周期主要包括三个主要场景：

- 装载（Mounting）：组件被插入 DOM 中

- 更新（Updating）：组件重新渲染以更新 DOM

- 卸载（Unmounting）：组件从 DOM 中移除

不同的场景会调用不同的生命周期方法，包含`will`的方法在某个时间节点**之前**执行，包含`did`方法在某个时间节点**之后**执行。

### 初始渲染（装载）

| 生命周期函数           | 作用                         |
| ---------------------- | ---------------------------- |
| **getDefaultProps**    | 获取实例的默认属性           |
| **getInitialState**    | 获取每个实例的初始化状态     |
| **componentWillMount** | 组件即将被装载、渲染到页面上 |
| **render**             | 组件在这里生成虚拟的DOM节点  |
| **componentDidMount**  | 组件真正在被装载之后         |

### 更新

| 生命周期函数                  | 作用                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| **componentWillReceiveProps** | 组件将要接受到属性的时候调用                                 |
| **shouldComponentUpdate**     | 组件接受到新属性或者新状态的时候（可以返回false，接收数据后不更新，阻止render调用，后面的函数不会被继续执行了） |
| **componentWillUpdate**       | 组件即将更新不能修改属性和状态                               |
| **render**                    | 组件重新描绘                                                 |
| **componentDidUpdate**        | 组件已经更新                                                 |

### 卸载

| 生命周期函数             | 作用         |
| ------------------------ | ------------ |
| **componentWillUnmount** | 组件即将卸载 |

## shouldComponentUpdate(nextProps, nextState) 是做什么的（React 性能优化是哪个周期函数）？

当父组件被重新渲染时即render函数执行时，子组件就会默认被重新渲染，但很多时候是不需要重新渲染每一个子组件的。这时就可以使用`shouldComponentUpdate`来判断是否真的需要重新渲染子组件。仅仅一个判断，就可以节约很多的消耗。所以**对于父组件发生变化而子组件不变的情况，使用`shouldComponentUpdate`会提升性能**。

```react
shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.content === this.props.content) {
        return fasle;
    } else {
        return true;
    }
}
```

## React 生命周期中，最适合与服务器端进行数据交互的是哪个函数？

`componentDidMount`：在这个阶段，**实例和DOM已经挂载完成，可以进行相关的DOM操作**。

## 调用 setState 之后发生了什么？

- 将传递给setState的对象合并到组件的当前状态，触发所谓的调和（Reconciliation）过程。
- 然后生成新的元素树和旧的元素树使用Diff算法对比。
- 根据对比差异对界面进行**最小化重渲染**。

（在差异计算算法中，React能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了**按需更新**，而不是全部重新渲染。）

## setState 第二个参数的作用

**我们可以用该函数来监听渲染是否完成**。因为setState是一个异步的过程，所以说执行完setState之后不能立刻更改state里面的值。如果需要对state数据更改监听，setState提供第二个参数，就是用来监听state里面数据的更改，当数据更改完成，调用回调函数。

## 为什么建议传递给 setState 的参数是一个 callback 而不是一个对象

setState它是一个异步函数，他会合并多次修改，降低Diff算法的比对频率。这样也会提升性能。

React内部会把JavaScript事件循环中的消息队列的同一个消息中的setState都进行合并以后再重新渲染组件。

因为this.props和this.state的**更新是异步的，不能依赖它们的值去计算下一个state**。

## React 中 key 的作用

key是React用于追踪那些列表中元素被修改、被添加或者被移除的辅助标识。Diff算法中React会借助元素的key值来判断该元素时新近创建的还是被移动而来的元素，从而减少不必要的元素重新渲染。此外，React还需要借助key值来判断元素与本地状态的关联关系。

## React 中组件传值

父传子：父组件定义一个属性，子组件通过this.props接收

子传父：父组件定义一个属性，并将一个回调函数赋值给定义的属性，然后子组件进行调用传过来的函数，并将参数传进去，在父组件的回调函数中即可获得子组件传过来的值。

## 为什么要在 constructor 中绑定事件函数的this指向

把一个对象的方法赋值给一个变量会造成this的丢失，所以需要绑定this，把绑定放在构造函数中可以保证只绑定一次函数，如果放在render函数中绑定this的话每次渲染都会去绑定一次this，那样是很耗费性能的。

## 无状态组件

无状态组件就是使用定义函数的方式来定义组件，这种组件相比于使用类的方式来定义的组件（有状态组件），少了很多初始化过程，更加精简，所以要是可以使用无状态组件应当尽可能的使用无状态组件，会大幅提升效率。

## React 中 refs 的作用是什么？

refs是React提供给我们的安全访问DOM元素或者某个组件实例的API。

```react
class CustomForm extends Component {
    handleSubmit = () => {
        console.log("Input Value: ", this.input.value);
    }
    
    render() {
    	return (
        	<form onSubmit={this.handleSubmit}>
                <input 
                    type = "text"
                    ref = {(input) => this.input = input} />
                <button type="submit">Submit</button>
            </form>
        )    
    }
}
```

## 在构造函数中调用 super(props) 的目的是什么？

**在super()被调用之前，子类是不能使用this的，在ES6中，子类必须在constructor中调用super()**。传递props给super()的原因则是便于（在子类中）能在constructor访问this.props。

## 展示组件（Presentational component）和容器组件（Container component）之间有何不同

- **展示组件关心组件看起来是什么**。

  展示专门通过props接收数据和回调，并且几乎不会有自身的状态，但当展示组件拥有自身的状态时，通常也只关心UI状态而不是数据的状态。

- **容器组件则更关心组件是如何运作的**。

  容器组件会为展示组件或者其他容器组件提供数据和行为，它们会调用Flux actions，并将其作为回调提供给展示组件。容器组件经常是有状态的，因为它们是（其它组件的）数据源。

## 类组件（Class component）和函数式组件（Functional component）之间有何不同

- 类组件不仅允许你使用更多额外的功能，如组件自身的状态和生命周期钩子，也能使组件直接访问store并维持状态。
- 当组件仅是接收props，并将组件自身渲染到页面时，该组件就是一个`无状态组件`，可以使用一个纯函数来创建这样的组件。

## （组件的）状态（state）和属性（props）之间有何不同

- state是一种数据结构，用于组件挂载时所需数据的默认值。state可能会随着时间的推移而发生突变，但多数时候是作为用户事件行为的结果。
- props则是组件的配置。props由父组件传递给子组件，并且就子组件而言，props是不可变的（immutable）。组件不能改变自身的props，但是可以把其子组件的props放在一起（统一管理）。props也不仅仅是数据，回调函数也可以通过props传递。

## React 同构（SSR）时页面加载流程

1. 服务器运行React代码渲染出HTML
2. 浏览器加载这个无交互的HTML代码
3. 浏览器接收到内容展示
4. 浏览器加载JS文件
5. JS中React代码在浏览器中重新执行

## 应该在React组件的何处发起Ajax请求？

在React组件中，应该在componentDidMount中发起网络请求。这个方法会在组件第一次“挂载”（被添加到DOM）时执行，在组件的生命周期中仅会执行一次。更重要的是，你不能保证在组件挂载之前Ajax请求已经完成，如果是这样，也就意味着你将尝试在一个未挂载的组件上调用setState，这将不起作用。

## 何为受控组件

一个输入表单元素，它的值通过React的这种方式来控制，这样的元素就被称为受控元素。

在HTML中，类似`<input>`，`<textarea>`和`<select>`这样的表单元素会维护自身的状态，并基于用户的输入来更新。但在React中会有些不同，包含表单元素的组件将会在state中追踪输入的值，并且每次调用回调函数时，如onChange会更新state，重新渲染组件。

## 何为高阶组件（HOC）

高阶组件是一个以组件为参数并返回一个新组件的函数。

高阶组件运行你重用代码、逻辑和引导抽象。最常见的可能是Redux的connect函数。除了简单分享工具库和简单的组合，高阶组件最好的方式是共享React组件之间的行为。如果你发现你在不同的地方写了大量代码来做同一件事，就应该考虑将代码重构为可重用的高阶组件。

```javascript
function add(a, b) {
    return a + b;
}
```

现在如果我想给这个add函数添加一个输出结果的功能，那么你可能会考虑我直接用`console.log`不就实现了么。说的没错，但是如果我们想做的更加优雅并且容易复用和扩展，我们可以这样去做：

```javascript
function withLog(fn) {
    function wrapper(a, b) {
        const result = fn(a, b);
        console.log(result);
        return result;
    }
    return wrapper;
}
const withLogAdd = withLog(add);
withLogAdd(1, 2);
```

这个做法在函数式编程里称之为高阶函数，大家都知道React的思想中是存在函数式编程的，高阶组件和高阶函数就是同一个东西。我们实现一个函数，传入一个组件，然后在函数内部再实现一个函数去扩展传入的组件，最后返回一个新的组件，这就是高阶组件的概念，作用就是为了更好的复用代码。

## 除了在构造函数中绑定 this ，还有其它方式吗？

你可以使用属性初始值设定项来正确绑定回调，create-react-app也是默认支持的。在回调中你可以使用箭头函数，但问题是每次组件渲染时都会创建一个新的回调。

## 怎么阻止组件的渲染

在组件的render方法中返回null并不会影响触发组件的生命周期方法。

## React 事件机制

React其实自己实现了一套事件机制，首先我们考虑一下以下代码：

```javascript
const Test = ({list, handleClick}) => ({
    list.map((item, index) => (
    	<span onClick={handleClick} key={index}>{index}</span>
	))
})
```

事实当然不是，JSX上写的事件并没有绑定在对应的真实DOM上，而是通过事件代理的方式，**将所有的事件统一绑定在了document上**。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。

另外冒泡到document上的事件也不是原生浏览器事件，而是**React自己实现的合成事件（SyntheticEvent）**。因此我们如果不想要事件冒泡的话，调用`event.stopPropagation`是无效的，而应该调用`event.preventDefault`。

那么实现合成事件的好处有两点，分别是：

1. 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力
2. 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个*事件池*专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象。

## createElement和cloneElement有什么区别？

JSX语法就是用`React.createElement()`来构建React元素的。它接收三个参数，第一个参数可以是一个标签名。如div、span，或者React组件。第二个参数为传入的属性。第三个及以后的参数，皆作为组件的子组件。

```react
React.createElement(
	type,
    [props],
    [...children]
)
```

`React.cloneElement()`与`React.createElement()`相似，不同的是它传入的第一个参数是一个React元素，而不是标签名或组件。新添加的属性会并入原有的属性，传入到返回的新元素中，而旧的子元素将被替换。

```react
React.cloneElement(
	element,
    [props],
    [...children]
)
```

## React中有三种构建组件的方式

`React.createClass()`、ES6 class和无状态函数。

## React组件的划分业务组件和技术组件？

- 根据组件的职责通常把组件分为UI组件和容器组件
- UI组件负责UI的呈现，容器组件负责管理数据和逻辑
- 两者通过React-Redux提供connect方法联系起来

## 简述Flux思想

Flux的最大特点，就是数据的**单向流动**。

1. 用户访问View

2. View发出用户的action

3. Dispatcher收到Action，要求store进行相应的更新

4. Store更新后，发出一个“change”事件

5. View收到“change”事件后，更新页面

