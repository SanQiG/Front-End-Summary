## React中keys的作用

keys是React用于追踪那些列表中元素被修改、被添加或者被移除的辅助标识。

```react
render() {
    return (
    	<ul>
            {this.state.todoItems.map(({item, key}) => {
                return <li key={key}>{item}</li>
            })}
        </ul>
    )
}
```

在开发过程中，我们需要保证某个元素的key在其同级元素中具有唯一性。在React Diff算法中React会借助元素的key值来判断该元素是新创建的还是被移动而来的元素，从而减少不必要的元素重新渲染。此外，React还需要借助key值来判断元素与本地状态的关联关系，因此我们绝不可忽视转换函数中Key的重要性。

## 调用setState之后发生了什么？

在代码中调用setState函数之后，React会传入的参数对象与组件当前的状态合并，然后触发所谓的调和过程。经过调和过程，React会以相对高效的方式根据新的状态构建React元素树并且着手重新渲染整个UI界面。在React得到元素树之后，React会自动计算出新的树与老树的节点差异，然后根据差异对界面进行最小化重渲染。在差异计算算法中，React能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。

## React生命周期

  React生命周期主要包括三个主要场景：

- 装载（Mounting）：组件被插入 DOM 中
- 更新（Updating）：组件重新渲染以更新 DOM
- 卸载（Unmounting）：组件从 DOM 中移除

  不同的场景会调用不同的生命周期方法，包含`will`的方法在某个时间节点**之前**执行，包含`did`方法在某个时间节点**之后**执行。

### 初始渲染（装载）

  **getDefaultProps**：获取实例的默认属性

  **getInitialState**：获取每个实例的初始化状态

  **componentWillMount**：组件即将被装载、渲染到页面上

  **render**：组件在这里生成虚拟的DOM节点

  **componentDidMount**：组件真正在被装载之后

### 更新

  **componentWillReceiveProps**：组件将要接受到属性的时候调用

  **shouldComponentUpdate**：组件接受到新属性或者新状态的时候（可以返回false，接收数据后不更新，阻止render调用，后面的函数不会被继续执行了）

  **componentWillUpdate**：组件即将更新不能修改属性和状态

  **render**：组件重新描绘

  **componentDidUpdate**：组件已经更新

### 卸载

  **componentWillUnmount**：组件即将卸载

## shouldComponentUpdate是做什么的（React性能优化是哪个周期函数）？

shouldComponentUpdate这个方法用来判断是否需要调用render方法重新描绘dom。因为dom的描绘非常消耗性能，如果我们能在shouldComponentUpdate方法中能够写出更优化的dom diff算法，可以极大的提高性能。

## 为什么虚拟DOM会提高性能？（必考）

虚拟dom相当于在JS和真实的dom中间加了一个缓存，利用dom diff算法避免了没有必要的dom操作，从而提高性能。

1. 用JS对象结构表示DOM树的结构；然后用这个树构建一个真正的DOM树，插到文档当中。
2. 当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异。
3. 把2所记录的差异应用到步骤1所构建的真正的DOM树上，视图就更新了。

## React Diff 算法原理（常考，大厂必考）

- 把树形结构按照层级分解，只比较同级元素。
- 把列表结构的每个单元添加唯一的key属性，方便比较。
- React只会匹配相同class的component（这里的class指的是组件的名字）。
- 合并操作，调用component的setState方法的时候，React将其标记为dirty。到每一个事件循环结束，React检查所有标记dirty的component重新绘制。
- 选择性子树渲染。开发人员可以重写shouldComponentUpdate提高diff的性能。

## React中refs的作用是什么？

refs是React提供给我们的安全访问DOM元素或者某个组件实例的句柄。我们可以为元素添加ref属性然后在回调函数中接受该元素在DOM树中的句柄，该值会作为回调函数的第一个参数返回：

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

上述代码中input域包含了一个ref属性，该属性声明的回调函数会接受input对应的DOM元素，我们将其绑定到this指针以便在其他的类函数中使用。另外值得一提的是，refs并不是类组件的专属，函数式组件同样能够利用闭包暂存其值：

```react
function CustomForm({handleSubmit}) {
    let inputElement;
    return (
    	<form onSubmit={() => handleSubmit(inputElement.value)}>
        	<input
                type = "text"
                ref = {(input) => inputElement = input} />
            <button type="submit">Submit</button>
        </form>
    );
}
```

## 展示组件（Presentational component）和容器组件（Container component）之间有何不同

- 展示组件关心组件看起来是什么。展示专门通过props接收数据和回调，并且几乎不会有自身的状态，但当展示组件拥有自身的状态时，通常也只关心UI状态而不是数据的状态。
- 容器组件则更关心组件是如何运作的。容器组件会为展示组件或者其他容器组件提供数据和行为，它们会调用Flux actions，并将其作为回调提供给展示组件。容器组件经常是有状态的，因为它们是（其它组件的）数据源。

## 类组件（Class component）和函数式组件（Functional component）之间有何不同

- 类组件不仅允许你使用更多额外的功能，如组件自身的状态和生命周期钩子，也能使组件直接访问store并维持状态。
- 当组件仅是接收props，并将组件自身渲染到页面时，该组件就是一个`无状态组件`，可以使用一个纯函数来创建这样的组件。

## （组件的）状态（state）和属性（props）之间有何不同

- state是一种数据结构，用于组件挂载时所需数据的默认值。state可能会随着时间的推移而发生突变，但多数时候是作为用户事件行为的结果。
- props则是组件的配置。props由父组件传递给子组件，并且就子组件而言，props是不可变的（immutable）。组件不能改变自身的props，但是可以把其子组件的props放在一起（统一管理）。props也不仅仅是数据--回调函数也可以通过props传递。

