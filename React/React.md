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

## 为什么虚拟DOM会提高性能？

虚拟dom相当于在JS和真实的dom中间加了一个缓存，利用dom diff算法避免了没有必要的dom操作，从而提高性能。

用JS对象结构表示DOM树的结构；然后用这个树构建一个真正的DOM树，插到文档当中当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异把记录的差异应用到真正的DOM树上，视图就更新了。

## [TODO] React Diff 算法
