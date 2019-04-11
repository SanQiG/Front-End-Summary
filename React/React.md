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