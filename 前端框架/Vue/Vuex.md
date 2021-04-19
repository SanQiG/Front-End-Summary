# Vuex

## State

State 提供唯一地公共资源，所有共享的数据都要统一放到 Store 的 State 中进行存储。

```javascript
const store = new Vuex.Store({
  state: { count: 0 }
});
```

组件访问 State 中数据的第一种方式：

```js
this.$store.state.全局数据名称
```

组件访问 State 中数据的第二种方式：

```js
// 1. 从 vuex 中按需导入 mapState 函数
import { mapState } from 'vuex'
```

通过刚才导入的 mapState 函数，将组件需要的全局数据，映射为当前组件的 computed 计算属性

```js
// 2. 将全局数据，映射为当前组件的计算属性
computed: {
  ...mapState(['count'])
}
```

## Mutation

Mutation 用于变更 Store 中的数据。

1. **只能通过 mutation 变更 Store 数据**，不可以直接操作 Store 中的数据。

2. 通过这种方式虽然操作起来稍微繁琐一点，但是可以集中监控所有数据的变化。

第一种方式：

   ```js
// 定义 Mutation
const store = new Vuex.store({
  state: {
    count: 0
  },
  mutations: {
    add(state, step) {
      // 变更状态
      state.count += step;
    }
  }
})

// 触发 Mutation
methods: {
  handlel() {
    this.$store.commit('add', 3)
  }
}
   ```

this.$store.commit()是触发 mutation 的第一种方式，触发 mutations 的第二种方式：

```js
// 1. 从 vuex 中按需导入 mapMutation 函数
import { mapMutations } from 'vuex'
```

通过刚才导入的 mapMutation 函数，将需要的 mutation 函数，映射为当前组件的 methods 方法：

```js
// 2. 将指定的 mutations 函数，映射为当前组件的 methods 函数
methods: {
  ...mapMutations(['add', 'addN']),
  xxx() {
    this.add();
  },
  xxx1() {
    this.addN(2);
  }
}
```

## Action

Action 用于处理异步任务。

如果通过异步操作变更数据，必须通过 Action，而不能使用 Mutation，但是在 Action 中还是要通过触发 Mutation 的方式间接变更数据，**不能直接修改 state 中的数据**。

```js
// 定义 Action
const store = new Vuex.store({
  mutations: {
    add(state) {
      state.count++
    }
  },
  actions: {
    addAsync(context) {
      setTimeout(() => {
        context.commit('add')
      }， 1000)
    }
  }
})

// 触发 Action
methods: {
  handle() {
    this.$store.dispatch('addAsync')
  }
}
```

**commit 的作用就是调用某个 mutation**

**dispatch 的作用就是用来触发 action**

this.$store.dispatch() 是触发 actions 的第一种方式，触发 actions 的第二种方式：

```js
// 1. 从 vuex 中按需导入 mapActions 函数
import { mapActions } from 'vuex'
```

通过刚才导入的 mapActions 函数，将需要的 actions 函数，映射为当前组件的 methods 方法：

```js
methods: {
  ...mapActions(['addAsync', 'addNAsync'])
}
```

## Getter

getter 用于对 state 中的数据进行加工处理形成新的数据。

1. Getter 可以对 Store 中已有的数据加工处理之后形成新的数据，类似 Vue 的计算属性
2. Store 中数据发生变化，Getter 的数据也会跟着变化

```js
// 定义 getter
const store = new Vuex.Store({
	state: {
    count: 0
  },
  getters: {
    showNum: state => `当前最新的数量是${state.count}`
  }
})
```

第一种方式：

```js
this.$store.getters.名称
```

第二种方式：

```js
import { mapGetters } from 'vuex'

coputed: {
  ...mapGetters(['showNum'])
}
```

