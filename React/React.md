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

## [TODO] React Diff 算法

## [TODO] React组件如何更新虚拟DOM

    1. state 数据
    2. JSX 模板
    3. 数据 + 模板 => 虚拟 DOM（JS对象）
    4. 虚拟 DOM => 真实 DOM
    5. state 发生变化
    6. 数据 + 模板 => 虚拟 DOM
    7. 新旧虚拟 DOM 作对比，找区别
    8. 直接操作 DOM 改变内容

## [TODO] React生命周期

  React生命周期主要包括三个主要场景：

  - 装载（Mounting）：组件被插入 DOM 中
  - 更新（Updating）：组件重新渲染以更新 DOM
  - 卸载（Unmounting）：组件从 DOM 中移除

  不同的场景会调用不同的生命周期方法，包含`will`的方法在某个时间节点**之前**执行，包含`did`方法在某个时间节点**之后**执行。

  - ### 初始渲染（装载）

  **getDefaultProps**

  **getInitialState**

  **componentWillMount**

  **render**

  **componentDidMount**

  - ### 更新

  **componentWillReceiveProps**

  **shouldComponentUpdate**

  **componentWillUpdate**

  **render**

  **componentDidUpdate**

  - ### 卸载

  **componentWillUnmount**
