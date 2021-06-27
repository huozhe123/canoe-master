- Composition API

- <script setup>以及其他新的单文件组件特性

- emits选项

- TS类型改进

- Vite官方整合

- fragement

- <Teleport>

- <Suspense>

# Composition API

## 简介

- 定义
	一组低侵入性（不影响现有Options API的使用）、函数式的API，使我们更灵活地组合组织逻辑代码。
	这些API并没有引入新的概念，使用他们主要就是代替Options API来更好地表示组件内逻辑。
	
- 动机
	1. 逻辑重用和代码组织
		vue2.x中强制使用Options API(data,computed,methods,watch)来组织代码，处理单个逻辑时，需要不断地“跳转”到相关代码的选项块，这种碎片化使得理解和维护复杂组件变得困难。Composition API则允许我们灵活地组织代码，将相关的逻辑提取和重用。
	2. 更好的类型推断
		vue2依靠一个简单的this上下文来暴露 property，我们使用 this 的方式是比较微妙的。composition api更多地利用了天然对类型友好的普通变量与函数，我们撰写的代码会完美享用类型推导
	
## 安装

```bash
npm install @vue/composition-api
# or
yarn add @vue/composition-api
```

在使用 `@vue/composition-api` 前，必须先通过 `Vue.use()` 进行安装。之后才可使用新的 [**组合式 API**](https://composition-api.vuejs.org/zh) 进行组件开发。

```js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
```

```js
// 使用 API
import { ref, reactive } from '@vue/composition-api'
```

> :bulb: 当迁移到 Vue 3 时，只需简单的将 `@vue/composition-api` 替换成 `vue` 即可。你现有的代码几乎无需进行额外的改动。


## 基本例子

```html
<template>
  <button @click="increment">
    Count is: {{ state.count }}, double is: {{ state.double }}
  </button>
</template>

<script>
import { reactive, computed } from 'vue'

export default {
  setup() {
    const state = reactive({
      count: 0,
      double: computed(() => state.count * 2)
    })

    function increment() {
      state.count++
    }

    return {
      state,
      increment
    }
  }
}
</script>
```


## setup

>理解：setup()函数是一个新的组件选项，可以理解为Composition API的入口。

- 执行时机：beforeCreate生命周期之前
- 参数
	1. {Data} props
	
	   - props是响应式的，当父级组件发生变更时，子组件所有的props都将自动更新为最新值。
	   - 解构props会消除props的响应式，如果真的需要解构可以使用toRefs函数来安全完成此操作
	   ```html
		import { toRefs } from 'vue'

		setup(props) {
		  const { title } = toRefs(props)

		  console.log(title.value)
		}
	   ```
	2. {SetupContext} context
	   - context是一个普通js对象，不具有响应性，因此可以安全地使用解构
	   - context包含3个属性，其中attrs和slots是有状态的对象，在组件更新时始终会更新，这意味着应该避免对他们进行解构，并始终以attrs.x或slots.x的方式引用，请注意，与props不同，attrs和slots是非响应式的，如果你打算在attrs或slots更新时做些什么，则应在onUpdate钩子函数中操作。
	   
	   ```html
	    export default {
		  setup(props, { attrs, slots, emit }) {
			...
		  }
		}
	   ```
	
- 参数的类型声明
	```html
	interface Data {
	  [key: string]: unknown
	}
	
	interface SetupContext {
	  attrs: Data
	  slots: Slots
	  emit: (event: string, ...args: unknown[]) => void
	}
	
	function setup(props: Data, context: SetupContext): Data
	```
- 返回值
1. setup()返回一个对象，可以在组件的<template>中访问该对象的属性
  
	  ```html
	  <!-- MyBook.vue -->
		<template>
		  <div>{{ readersNumber }} {{ book.title }}</div>
		</template>

		<script>
		  import { ref, reactive } from 'vue'

		  export default {
			setup() {
			  const readersNumber = ref(0)
			  const book = reactive({ title: 'Vue 3 Guide' })

			  // expose to template
			  return {
				readersNumber,
				book
			  }
			}
		  }
		</script>
	```

	2. setup()返回h函数，该函数可以直接使用同一作用域中声明的state
	
	```html
	// MyBook.vue

	import { h, ref, reactive } from 'vue'

	export default {
	  setup() {
		const readersNumber = ref(0)
		const book = reactive({ title: 'Vue 3 Guide' })
		// Please note that we need to explicitly expose ref value here
		return () => h('div', [readersNumber.value, book.title])
	  }
	}
	```
- async setup
如果需要在setup中使用请求等异步操作，在setup前加async后，会导致当前组件空白不显示
解决:
1.使用<Suspense>标签
在使用组件的外层嵌套一个<Suspense>标签。
异步组件：
```html
// 这里写异步的组件
async setup() {
 // 内容
}
```
调用异步组件的父组件：
```html
<Suspense>
	<async-component></async-component>
</Suspense>
```
2. 将异步代码抽象成一个独立的函数
>注意点：
>
>1. 由于在执行setup时还未创建组件实例，因此在setup()函数中无法访问this。这意味着，除了props之外，你将无法访问组件中声明的任何属性——data/methods/computed
>2. 在setup函数中定义的变量和方法最后都是需要 return 出去的 不然无法再模板中使用

## 生命周期函数

在setup()内调用生命周期钩子函数，需要加"on"前缀 

Options API生命周期函数和Composition API之间的对应关系：

| **Options API**   | Hook inside `setup` |
| ----------------- | ------------------- |
| `beforeCreate`    | Not needed*         |
| `created`         | Not needed*         |
| `beforeMount`     | `onBeforeMount`     |
| `mounted`         | `onMounted`         |
| `beforeUpdate`    | `onBeforeUpdate`    |
| `updated`         | `onUpdated`         |
| `activated`       | `onActivated`       |
| `deactivated`     | `onDeactivated`     |
| `beforeDestroy`   | `onBeforeUnmount`   |
| `destroyed`       | `onUnmounted`       |
| `errorCaptured`   | `onErrorCaptured`   |
| `renderTracked`   | `onRenderTracked`   |
| `renderTriggered` | `onRenderTriggered` |

> 注意：这些生命周期函数只能在setup()中使用，否则会报错。

这些函数接受一个回调，该回调将在组件调用该钩子函数时执行：
```html
// MyBook.vue

export default {
  setup() {
    // mounted
    onMounted(() => {
      console.log('Component is mounted!')
    })
  }
}
```

## reactive

reactive()作用同vue2组件的data选项，他接收一个对象或者数组作为参数，并返回该值的响应式代理。

>注意：
>
>1. 由于reactive采用Proxy代理的方式，来实现引用类型的响应式，所以不能接收基本数据类型值。
>2. reactive会返回对象的响应式代理，这种响应式转换是深层的，会影响所有的嵌套对象。

```html
<template>
  <div>
    <p>{{data.message}}</p>
    <button @click="updateData">更新数据</button>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup() {
    const data = reactive({ message: "hello world" })
    const updateData = () => {
      data.message = "hello world " + new Date().getTime()
    }
    return { data, updateData }
  },
}
</script>

```

reactive()接收数组
```html
const data = reactive([1,2,3])
const updateData = () => {
  data = [2,3,4] // 失败，直接赋值丢失了响应性
  data.push(...[2,3,4]) // 成功
}
return { data, updateData }
```


## computed

作用同vue2的computed选项。
computed()函数接受两种类型的参数：第一种是一个getter函数, 第二种是一个带get和set的对象。

- 类型声明
```html
// read-only
function computed<T>(getter: () => T): Readonly<Ref<Readonly<T>>>

// writable
function computed<T>(options: { get: () => T; set: (value: T) => void }): Ref<T>
```

- 传入getter函数创建一个computed
```html
const count = ref(1)
const plusOne = computed(() => count.value + 1) // 创建一个计算属性，依赖count

console.log(plusOne.value) // 2

plusOne.value++ // error
```

- 使用具有get和set函数的对象来创建可写的ref对象。
```html
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

## watchEffect

watchEffect()接收一个回调函数，并且立即执行。watchEffect()不需要指定监听的属性，他会自动收集依赖，并在其依赖变更时重新运行该函数。

> watchEffect类似于2.x的watch选项，但它不需要分离被监听的数据源和副作用回调。
> 与watch API相比：
>
> 1. 不需要手动传入依赖
> 2. 每次初始化时会执行一次回调函数来自动获取依赖
> 3. 无法获取到原值，只能得到变化后的值

- 参数
	1. 一个副作用函数(effect)，同时effect也有一个函数参数`onInvalidate`，用于清除effect产生的副作用。
		```html
		const count = reactive({info: {age: 18}})
		const effect = () => console.log(count.info.age)
		watchEffect(effect) // 内部依赖count，会在count变更时自动执行该回调
		// -> logs 0

		setTimeout(() => {
		  count.info.age++
		  // -> logs 1
		}, 100)
		```
		onInvalidate被调用的时机：
		- 当effect函数即将重新执行时
		```html
		watchEffect(onInvalidate => {
		  const token = performAsyncOperation(id.value) // 模拟异步副作用
		  onInvalidate(() => {
			// id has changed or watcher is stopped.
			// invalidate previously pending async operation
			token.cancel()
		  })
		})
		```
		
		- 当侦听器被停止时(如组件被销毁)
	2. 一个对象，类型是WatchEffectOptions，该参数可以配置副作用刷新时机和侦听器调试行为。
- 返回值 (作用：停止侦听)
	watchEffect返回值是一个函数，用于停止侦听，这个函数可以在setup函数中显示调用，也可以在组件被销毁时隐式调用。
	```html
	
	setup() {
	  const stopHandle = watchEffect(() => {
		/* ... */
	  })
	 
	  // 之后
	  stopHandle()
	}

	```

- 副作用刷新时机

	```html
	<template>
	  <div>{{ count }}</div>
	</template>

	<script>
	  export default {
		setup() {
		  const count = ref(0)
		
		  setTimeout(() => count.value = 1, 1000)
		  watchEffect(() => {
			console.log(count.value)
		  })

		  return {
			count
		  }
		}
	  }
	</script>
	```
在这个例子中：
	- count会在初始运行时同步打印出来
	- 更改count时，将在组件更新前(onBeforeUpdate生命周期之前)执行副作用

	如果需要在组件更新后重新运行侦听器副作用，我们可以传递带有`flush`选项的附加options对象(默认为'pre')

	```html
	// fire before component updates
	watchEffect(
	  () => {
		/* ... */
	  },
	  {
		flush: 'post'
	  }
	)
	```

- 侦听器调试
`onTrack` 和 `onTrigger` 选项可用于调试侦听器的行为。
	- onTrack 将在响应式 property 或 ref 作为依赖项被追踪时被调用。
	- onTrigger 将在依赖项变更导致副作用被触发时被调用。
	这两个回调都将接收到一个包含有关所依赖项信息的调试器事件。建议在以下回调中编写 debugger 语句来检查依赖关系：

	```html
	watchEffect(
	  () => {
		/* 副作用 */
	  },
	  {
		onTrigger(e) {
		  debugger
		}
	  }
	)
	```

- 类型声明

	```html
	function watchEffect(
	  effect: (onInvalidate: InvalidateCbRegistrator) => void,
	  options?: WatchEffectOptions
	): StopHandle

	interface WatchEffectOptions {
	  flush?: 'pre' | 'post' | 'sync'  // default: 'pre'
	  onTrack?: (event: DebuggerEvent) => void
	  onTrigger?: (event: DebuggerEvent) => void
	}

	interface DebuggerEvent {
	  effect: ReactiveEffect
	  target: any
	  type: OperationTypes
	  key: string | symbol | undefined
	}

	type InvalidateCbRegistrator = (invalidate: () => void) => void

	type StopHandle = () => void
	```

## watch
watch完全等同于2.x的watch选项。watch需要侦听特定的数据源，并在回调函数中执行副作用。默认情况下，它也是惰性的，即只有当被侦听的源发生变化时才执行回调。

与watchEffect相比，watch允许我们：
	- 懒执行副作用；
	- 更具体地说明什么状态应该触发侦听器重新运行；
	- 可以访问侦听状态变化前后的值。

- 参数
	1. 第一个参数是要监听的数据对象，可以是单个变量、数组（多个数据源时使用）、函数；
	2. 一个回调函数，当监听的数据改变时会执行。它有2个参数，第一个是改变后的数据，第二个是改变前的数据。
	3. 一个对象，类型是`WatchEffectOptions`，该参数可以配置副作用刷新时机和侦听器调试行为（同watchEffect）。

- 侦听单个数据源
侦听器数据源可以是返回值的 getter 函数，也可以直接是 ref：
```html
// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

- 侦听多个数据源
```html
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

- 与watchEffect共享的行为
`watch`与`watchEffect`共享停止侦听，清除副作用 (相应地 onInvalidate 会作为回调的第三个参数传入)、副作用刷新时机和侦听器调试行为。

## createApp

createApp函数，用于创建vue对象.



## ref

`ref()`接受一个内部值，并返回一个响应式且可变的`ref`对象，`ref`对象使用`.value`访问内部值。当`ref`类型的数据发生变化，界面会自动更新
其作用同reactive，但他可接收基本数据类型值。

```html
<template>
  <span>{{count}}</span>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
	const count = ref(0)
	console.log(count.value) // 0

	count.value++
	console.log(count.value) // 1
	return {
		count
	}
  }
}
</script>
```
在js里需要通过`.value`访问内部值，而在`template`中不用写.value


- 类型声明

```html
interface Ref<T> {
  value: T
}

function ref<T>(value: T): Ref<T>
```

有时我们需要为`ref`的内部值指定复杂类型，这时可以在调用`ref`时覆盖默认类型推断，通过传入一个泛型参数来做到。

```html
const foo = ref<string | number>('foo') // foo's type: Ref<string | number>

foo.value = 123 // ok!
```

- 模板ref

为了获取模板内元素或组件实例的引用，我们可以像往常一样声明`ref`并从`setup()`返回。

```html
<template> 
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null) // 这里ref变量必须和组件内实例的引用同名，且必须从setup()返回

      onMounted(() => {
        // DOM元素将在初始渲染后分配给ref
        console.log(root.value) // <div>这是根元素</div>
      })

      return {
        root
      }
    }
  }
</script>
```

1. jsx中的用法
	```html
	export default {
	  setup() {
		const root = ref(null)

		return () =>
		  h('div', {
			ref: root
		  })

		// with JSX
		return () => <div ref={root} />
	  }
	}
	```
2. v-for中的用法
	模板引用在 `v-for` 内部使用时没有特殊处理，需要自己手动处理。
	
	```html
	<template>
	  <div v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
		{{ item }}
	  </div>
</template>
	
	<script>
    import { ref, reactive, onBeforeUpdate } from 'vue'
	
	  export default {
		setup() {
		  const list = reactive([1, 2, 3])
	  const divs = ref([])
	
		  // 确保在每次更新之前重置ref
		  onBeforeUpdate(() => {
			divs.value = []
	  })
	
		  return {
			list,
			divs
		  }
		}
	  }
	</script>
	```
- ref自动解包

在众多情况下，我们可以减少`.value`的使用

1. `watch`直接接受ref作为监听对象，并在回调函数中返回解包后的值。
```html
const counter = ref(0)
watch(counter, count => {
	console.log(count) // some as `counter.value`
})
```
2. ref在模板中自动解包
```html
<template>
	<button @click="counter += 1">
		Counter is {{ counter }}
	</button>
</template>
```
3. 使用reactive解包嵌套的ref
```html
import { ref, reactive } from 'vue'
const foo = ref('bar')
const data = reactive({ foo, id: 10 })
data.foo // 'bar'
```



>注意点：
>
>2. `ref`本质是拷贝，修改响应数据不会影响原数据
```html
import {ref} from 'vue'
export default {
  name:'App'
  setup(){
    let obj = {name : 'alice', age : 12}
    let newObj= ref(obj.name)
    function change(){
      newObj.value = 'Tom'
      console.log(obj,newObj)
    }
    return {newObj,change}
  }
```
上述代码，当change执行的时候，响应式数据发生改变，而原始数据obj并不会改变。
>3. `ref`数据发生改变，界面会自动更新
>3. 对于`ref`对象需要使用`.value`访问其内部值
>4. `reactive()`函数可以代理一个对象，但是不能代理基本类型值，如string/number/boolean等，因此我们可以使用ref()函数来间接对基本类型值进行处理。

## toRef

`toRef`是将某个响应式对象中的某一个属性转化成为`ref`类型的数据，修改这个数据会影响到原始数据。其接受两个参数，第一个参数为obj对象;第二个参数为对象中的属性名

```html
const state = reactive({
  foo: 1,
  bar: 2
})

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

当你想把props中某一个属性传递给复合函数，就可以用`toRef`

```html
export default {
  setup(props) {
    useSomeFeature(toRef(props, 'foo'))
  }
}
```

> 注意点：
>
>1. 和ref的区别在于：`toRef`的本质是引用，与原始数据关联，`ref`本质是拷贝，修改响应式数据不会影响原始数据。
>2. 如果修改通过`toRef`创建的响应式数据，并不会触发UI界面的更新
```html
import {toRef} from 'vue'
export default {
  name:'App'
  setup(){
    let obj = {name : 'alice', age : 12}
    let newObj= toRef(obj, 'name')
    function change(){
      newObj.value = 'Tom'
      console.log(obj,newObj)
    }
    return {newObj,change}
  }
}
```
上述代码，当change执行的时候，响应式数据发生改变，原始数据obj并不会改变，但是UI界面不会更新
## toRefs

将对象的每个属性都变成`ref`类型数据，并和原始数据关联
其接收一个对象作为参数，他会遍历对象身上的所有属性，挨个调用`toRef`

```html
const state = reactive({
  foo: 1,
  bar: 2
})

const stateAsRefs = toRefs(state)
/*
Type of stateAsRefs:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// ref 和 原始property “链接”
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

当从复合函数返回`reactive`对象的时候，`toRefs`非常有用，这样可以在不丢失响应性的情况下对返回的对象进行解构。

```html
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // 逻辑运行状态

  // 返回时转换为ref
  return toRefs(state)
}

export default {
  setup() {
    // 可以在不失去响应性的情况下解构
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar
    }
  }
}
```

## isRef

此函数用于判断一个值是否是`ref`类型

```html
const unwrapped = isRef(foo) ? foo.value : foo
```

## customRef

自定义一个`ref`，可以显式地控制依赖追踪和触发响应。它接收一个工厂函数，该函数接收 `track` 和 `trigger` 函数作为参数，并应返回一个带有 get 和 set 的对象。

- 类型定义
```html
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
```
- 示例

`v-model` 使用自定义 `ref` 实现 `debounce` 的示例：
```html
<input v-model="text" />
```

```html
function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

export default {
  setup() {
    return {
      text: useDebouncedRef('hello')
    }
  }
}
```

## shallowRef

通常我们使用 `ref()` 函数时，目的是为了引用基本数据类型的值，例如：ref(false)。但我们仍然可以引用非基本类型值，例如一个对象：
```html
const refObj = ref({ foo: 1 })
```
此时，refObj.value 是一个对象，这个对象依然是响应的，例如如下代码会触发响应：
```html
refObj.value.foo = 2
```
shallowRef() 顾名思义，它只代理 ref 对象本身，也就是说只有 .value 是被代理的，而 .value 所引用的对象并没有被代理：
```html
const refObj = shallowRef({ foo: 1 })

refObj.value.foo = 3 // 无效
```

## triggerRef

`shallowRef()` 函数不会代理 `.value` 所引用的对象，因此我们修改对象值的时候不会触发响应，这时我们可以通过 `triggerRef()` 函数强制触发响应。

```html
const refVal = shallowRef({ foo: 1 })
effect(() => {
    console.log(refVal.value.foo)
})

refVal.value.foo = 2 // 无效
triggerRef(refVal)  // 强制 trigger
```

## getCurrentInstance

作用：获取到当前组件实例。

`getCurrentInstance`代表全局上下文，它的proxy属性相当于vue2的this。

```js
import { getCurrentInstance } from 'vue'

const MyComponent = {
  setup() {
    const {proxy} = getCurrentInstance()
  }
}
```

> getCurrentInstance只在setup或者生命周期函数中运行
> 如需在setup或生命周期函数外使用， 请先在setup中调用getCurrentInstance()获取该实例让然后再使用。

```js
const MyComponent = {
  setup() {
    const internalInstance = getCurrentInstance() // works

    const id = useComponentId() // works

    const handleClick = () => {
      getCurrentInstance() // doesn't work
      useComponentId() // doesn't work

      internalInstance // works
    }

    onMounted(() => {
      getCurrentInstance() // works
    })

    return () =>
      h(
        'button',
        {
          onClick: handleClick
        },
        `uid: ${id}`
      )
  }
}

// also works if called on a composable
function useComponentId() {
  return getCurrentInstance().uid
}
```
## toRaw
返回 `reactive` 或 `readonly` 代理的原始对象。这是一个转义口，可用于临时读取而不会引起代理访问/跟踪开销，也可用于写入而不会触发更改。不建议保留对原始对象的持久引用。请谨慎使用。
```html
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true

```

## isRaw
## isReactive
## isReadonly
## markRaw

标记一个对象，使其永远不能被reactive或readonly，返回对象本身。
```js
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 嵌套在其他响应式对象中时也可以使用
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

## nextTick
## onBeforeMount
## onServerPrefetch
## proxyRefs

## provide / inject

- 使用场景
	常用于高阶插件和组件库开发，provide()和 inject()可以实现嵌套组件之间的数据传递。
	父级组件上使用procide()函数向下传递数据。
	子级组件使用inject()获取上级传递下来的数据。
	
- provide()
	1. 参数
		- property的name(<String> 类型)
		- property的value
		
	2. 使用provide()	
	
		```html
		<!-- src/components/MyMap.vue -->
		<template>
		  <MyMarker />
		</template>

		<script>
		import { provide } from 'vue'
		import MyMarker from './MyMarker.vue

		export default {
		  components: {
			MyMarker
		  },
		  setup() {
			provide('location', 'North Pole')
			provide('geolocation', {
			  longitude: 90,
			  latitude: 135
			})
		  }
		}
		</script>
		```
	
- inject()	
	1. 参数
		- 要注入的property的名称
		- 一个默认值(可选)
	
	2. 使用inject()
	
	```html
	<!-- src/components/MyMarker.vue -->
	<script>
	import { inject } from 'vue'

	export default {
	  setup() {
		const userLocation = inject('location', 'The Universe')
		const userGeolocation = inject('geolocation')

		return {
		  userLocation,
		  userGeolocation
		}
	  }
	}
	</script>
	```
- 响应式
	为了给provide和inject的值增加响应式，可以使用ref或reactive
	
	```html
	<!-- src/components/MyMap.vue -->
	<template>
	  <MyMarker />
	</template>

	<script>
	import { provide, reactive, ref } from 'vue'
	import MyMarker from './MyMarker.vue

	export default {
	  components: {
		MyMarker
	  },
	  setup() {
		const location = ref('North Pole')
		const geolocation = reactive({
		  longitude: 90,
		  latitude: 135
		})

		provide('location', location)
		provide('geolocation', geolocation)
	  }
	}
	</script>
	```
	现在，这两个property有任何更改，MyMarker组件都会自动更新。
	
- 修改响应式property
	如果要在inject数据的组件内部更改注入的数据，建议provide提供一个方法来负责改变数据。
	```html
	<!-- src/components/MyMap.vue -->
	<template>
	  <MyMarker />
	</template>

	<script>
	import { provide, reactive, ref } from 'vue'
	import MyMarker from './MyMarker.vue

	export default {
	  components: {
		MyMarker
	  },
	  setup() {
		const location = ref('North Pole')
		const geolocation = reactive({
		  longitude: 90,
		  latitude: 135
		})

		const updateLocation = () => {
		  location.value = 'South Pole'
		}

		provide('location', location)
		provide('geolocation', geolocation)
		provide('updateLocation', updateLocation)
	  }
	}
	</script>
	```
	
	```html
	<!-- src/components/MyMarker.vue -->
	<script>
	import { inject } from 'vue'

	export default {
	  setup() {
		const userLocation = inject('location', 'The Universe')
		const userGeolocation = inject('geolocation')
		const updateUserLocation = inject('updateLocation')

		return {
		  userLocation,
		  userGeolocation,
		  updateUserLocation
		}
	  }
	}
	</script>
	```
	如果要确保provide传递的数据不会被注入的组件更改，建议对provide的值使用readonly
	
	```html
	<!-- src/components/MyMap.vue -->
	<template>
	  <MyMarker />
	</template>

	<script>
	import { provide, reactive, readonly, ref } from 'vue'
	import MyMarker from './MyMarker.vue

	export default {
	  components: {
		MyMarker
	  },
	  setup() {
		const location = ref('North Pole')
		const geolocation = reactive({
		  longitude: 90,
		  latitude: 135
		})

		const updateLocation = () => {
		  location.value = 'South Pole'
		}

		provide('location', readonly(location))
		provide('geolocation', readonly(geolocation))
		provide('updateLocation', updateLocation)
	  }
	}
	</script>
	```
> 注意点：
>
>1. provide和inject只能在setup()中调用。

## readonly

获取一个对象(响应式或纯对象)或ref并返回原始代理的只读代理，只读代理是深层的，访问的任何嵌套property也是只读的。
```js
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // 适用于响应性追踪
  console.log(copy.count)
})
// 变更original 会触发侦听器依赖副本
original.count++

// 变更副本将失败并导致警告
copy.count++ // 警告!
```

## shallowReactive

创建一个响应式对象，该代理跟踪其自身property的响应性，但不执行嵌套对象的深度响应式转换（暴露原始值）。

```html
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 改变状态本身的性质是响应式的
state.foo++
// ...但是不转换嵌套对象
isReactive(state.nested) // false
state.nested.bar++ // 非响应式
```


## shallowReadonly

创建一个代理，使其自身的property为只读的，但不执行嵌套对象的深度只读转换（暴露原始值）
```html
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 改变状态本身的property将失败
state.foo++
// ...但适用于嵌套对象
isReadonly(state.nested) // false
state.nested.bar++ // 适用
```

## toRaw

返回reactive或readonly代理的原始对象。这是一个转义口，可用于临时读取而不会引起代理访问/	跟踪开销，也可用于写入而不会触发更改。不建议v保留原始对象的持久引用。
请谨慎引用。

```html
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

## triggerRef
## unref

如果参数是一个ref则返回它的value，否则返回参数本身。

- 实现
```html
function unref<T>(r: Ref<T> | T): T {
	return isRef(r) ? r.value : r
}
```

- 接收ref作为函数参数
```js
如果函数同时接收传入值和Ref作为函数参数，在使用时不用在意.value
function add(
	a: Ref<number> | number,
	b: Ref<number> | number
) {
	return computed(() => unref(a) + unref(b))
}

const a = ref(1)
const c = add(a, 5)
```

- 返回由ref组成的对象
1. 可以直接使用ES6解构其中的ref进行使用
2. 根据使用方式，当想要自动解包的功能时，可以使用`reactive`将其转换为对象

```html
import { ref, reactive } from 'vue'
function useMouse() {
	return {
		x: ref(0),
		y: ref(0),
	}
}
const { x } = useMouse()
const mouse = reactive(useMouse())

mouse.x === x.value // true
```



## useCssModule

## isProxy

检查对象是reactive还是readonly创建的代理。

## isReactive

检查对象是否是reactive创建的响应式proxy。

```js
import { reactive, isReactive } from 'vue'
export default {
  setup() {
    const state = reactive({
      name: 'John'
    })
    console.log(isReactive(state)) // -> true
  }
}
```

如果proxy是readonly创建的，但还包装了由reactive创建的另外一个proxy，它也会返回true。

```js
import { reactive, isReactive, readonly } from 'vue'
export default {
  setup() {
    const state = reactive({
      name: 'John'
    })
    // 从普通对象创建的只读代理
    const plain = readonly({
      name: 'Mary'
    })
    console.log(isReactive(plain)) // -> false

    // 从响应式代理创建的只读代理
    const stateCopy = readonly(state)
    console.log(isReactive(stateCopy)) // -> true
  }
}
```

## isReadonly

检查对象是否是由readonly创建的只读对象。

# 自定义Hook

实现一个自定义的hooks。
```html
// page.vue
import useCount from './useCount'
export default {
	setup() {
		const { num, double, plus } = useCount(1)
		return { num, double, plus }
	}
}
// useCount.js
import { ref, computed } from 'vue'
export defaiult (value) => {
	const num = ref(value)
	const double = computed(() => num.value * 2)
	const plus = (val) => num.value + val
	return { num. double, plus }
}
```
useCount.js就是一个自定义的hooks，得益于vue3的全局API，我们可以轻松做到代码拆分，vue3的setup聚合了所有的逻辑，容易产生面条代码，合理使用自定义hooks，可以有效减少面条代码，提高代码可维护性。

# Fragment

在vue3中支持多根节点组件，即fragment。

```html
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

# Suspense

Suspense是一项实验性的新功能，不推荐应用于生产应用程序

什么是suspense组件？
suspense组件用于在等待某些异步组件时，渲染一些后备内容。
使用异步组件的场合非常多，尤其是以下情况：
1、在页面加载之前显示加载动画‘
2、显示占位符内容
3、处理延迟加载的图像

以前在vue2中，我们必须使用条件（v-if或v-else）来检查数据是否已加载和显示后备内容，但现在vue3有了内置的
Suspense，使我们不必在加载和渲染相应内容时再去额外处理了。

怎么使用suspense?
<suspense>组件有两个插槽，
1、将异步组件包装在<template #default>标记中
2、在我们的异步组件旁边添加一个兄弟组件，标签为<template #fallback>
3、将上述两个组件包装在<suspense>组件中

通过使用插槽，suspense将会渲染后备内容，直到默认设置为准备就绪。然后它将自动切换来显示我们的异步组件。

```html
<template>
  <Suspense>
    <template #default>
      <todo-list />
    </template>
    <template #fallback>
      <div>
        Loading...
      </div>
    </template>
  </Suspense>
</template>

<script>
export default {
  components: {
    TodoList: defineAsyncComponent(() => import('./TodoList.vue'))
  }
}
</script>
```

# Teleport

某些情况下，我们希望渲染的内容独立于父组件(如弹框),甚至是独立于当前挂载到DOM元素中(默认都是挂载到id为app的DOM元素)
​Teleport是vue3新增的组件，能够在不改变组件内部元素父子关系的情况下，将子元素“传送”到其他节点下加载。

> 注意，目标元素必须在组件挂载之前就存在,也就是说，目标元素不能被组件本身渲染，理想情况下应该在整个Vue组件树之外。
```html
<template>
    <div class="container" style="width:100px;height:100px;overflow:hidden;">
      <div class="dialog" style="width:500px;height:400px">
        ...
      </div>
    </div>
</template>
```
dialog直接挂载在container下，超出部分将不可见。加一层<Teleport>，我们可以轻松将dialog展示出来。
```html
<template>
    <div class="container" style="width:100px;height:100px;overflow:hidden;">
      <Teleport to="body">
        <div class="dialog" style="width:500px;height:400px">
        ...
      </div>
      </Teleport>
    </div>
</template>
```
此时，dialog在逻辑上属于该组件，而从技术角度（即：样式要求）来看，这部分移动到<body>上，将其从组件中分离出来。
​
- 同一目标上使用多个teleport
多个<teleport>组件可以将它们的内容挂载到同一目标元素。顺序是：append，后挂载的组件位于较早挂载的组件之后
```html
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>

<!-- result-->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```
出于复杂度和SSR的考虑，将多个teleport的顺序限制为简单的append。

Props
- to - string
该属性为必填属性，他可以是：
1. 元素的ID
2. 元素的class
3. 数据属性选择器
4. 动态绑定值
```html
<teleport to="#some-id" />
<teleport to=".some-class" />
<teleport to="[data-portal]" />
<teleport :to="target"/> // target: 'body'
```
如果在<teleport>挂载时，此元素不存在于DOM中，则在开发期间将给出警告：
​
- disabled - boolean
该属性为可选属性，可以用来禁用teleport的功能，这意味着其插槽内容不会移动到任何地方，而是在当前组件的位置呈现。
动态修改disabled的值，可以让元素在指定目标和原位置之间移动。
```html
<teleport to="#popup" :disabled="displayVideoInline">
  <video src="./my-movie.mp4">
</teleport>
```
请注意，这将移动实际的DOM 节点，而不是被销毁和重新创建，并且它还将保持任何组件实例的活动状态。所有有状态的 HTML 元素 (即播放的视频) 都将保持其状态。

# Tree-Shaking	
​
Tree-Shaking指在打包构建过程中移除没有被引用的代码。
vue3一共开放了113个API，我们可以通过如下方式引用：
```html
import { ref, reactive, h, onMounted } from 'vue';
```
通过ES6 modules的引入的方式，能够被AST静态语法分析感知，从而可以只提取用到的代码片段，最终达到Tree-Shaking的效果，这样就使得vue3最终打包出来的包更小，
加载更快。

​- 2.x语法
2.x中，所有全局API都暴露在单个Vue对象上。
​```html
import Vue from 'vue'

Vue.nextTick(() => {})
const obj = Vue.observable({})
```
在3.x中，它们只能通过命名导入进行访问
​```html
import Vue, { nextTick, observable } from 'vue'

Vue.nextTick // undefined

nextTick(() => {})
const obj = observable({})
```
​
- 动机
随着Vue的API的增长，官方一直在权衡功能和包的大小，希望将vue的大小开销保持在最低限度，但是也不想因为包大小限制而限制它的功能。
所以借助ES6 modules的静态分析，bundlers和minifiers可以消除bundle中未使用的ES模块，vue3重构了全局和局部API。
- 缺点
用户不能再导入单个Vue变量，然后使用它的API，但是考虑最小的包大小，这应该是一个值得的权衡。	
​	
​更多用法，参考

## <script setup> - sfc组合式API语法糖（实验性功能）

在setup()中声明的变量如果需要被模板使用，那么需要在setup尾部显式return返回。如果使用的变量不多，那么还可以勉强接受，但是当你的变量和方法
逐渐增加时，这无疑是一件繁琐的事情
总的来说：此语法的主要目标是通过将<script setup>的上下文直接暴露给模板来减少SFC内部 Composition API 使用的冗长性。

- 基本示例
```html
<script setup>
  // 导入的组件可以直接在模板中使用，不需要进行注册
  import Foo from './Foo.vue'
  import { ref } from 'vue'

  // 编写composition api代码，就像在setup()中一样，但是不需要手动return任何内容
  const count = ref(0)
  const inc = () => {
    count.value++
  }
</script>

<template>
  <Foo :count="count" @click="inc" />
</template>
```
当sfc中的<script>标记具有setup属性时，将会对其进行编译，在<script setup>中声明的顶级变量都直接暴露给模板上下文。

- 访问props，emit等

如何执行标准的Vue操作,如访问props，发射自定义事件，访问上下文对象
1. 使用setup()参数
```html
<script setup="props, context">
	// context has attrs, slots, and emit
</script>
```
2. 从vue导入对应api来访问
	- defineProps - 它允许我们为组件定义props
	- defineEmit - 定义组件可以发出的事件
	- useContext - 可以访问组件的slots和attrs
```html
<template>
 <button @click="$emit('change', 'about data...')"> Click Me </button>
</template>
<script setup>
  import { defineProps, defineEmit, useContext } from 'vue'

  const props = defineProps({
    foo: String,
  })
  const emit = defineEmit(['change', 'delete'])
  
  // Type-only props/emit declarations
  const props1 = defineProps<{
	  foo: string
	  bar?: number
  }>()
  const emit1 = defineEmit<(e: 'update' | 'delete', id: number) => void>()

  const { slots, attrs } = useContext()
  
</script>
```

- 访问组件和指令
组件直接导入就可以在模板内使用
```html
<script setup>
  import Foo from './Foo.vue'
  import MyComponent from './MyComponent.vue'
</script>

<template>
  <Foo />
  <!-- kebab-case also works -->
  <my-component />
</template>
```
指令跟组件一样，导入自动注册
```html
<script setup>
  import { directive as clickOutside } from 'v-click-outside'
</script>

<template>
  <div v-click-outside />
</template>
```

- 创建异步setup
直接在<script setup>中使用一个顶级的await
```html
<script setup>
  const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```
这样，setup将是异步的。

- 同时使用<script setup>和普通<script>
某些情况下，必须在模块范围内执行代码，可以通过添加一个普通的<script>来完成。
```html
<script>
  performGlobalSideEffect()

  // this can be imported as `import { named } from './*.vue'`
  export const named = 1
</script>

<script setup>
  // code here
</script>
```
更多内容查看 https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md


# <style>中的v-bind - sfc状态驱动的css变量 （实验性）
此特性允许在CSS中使用JS变量。


这是先前版本的改进替代品(<style vars>)
先前版本有几个值得注意的问题需要改进：
1. 需要手动声明变量，以暴露可以使用的变量
2. 在non-scoped下，css变量会泄露到子组件中
...

这次改进就是要解决上述问题：


- 基本示例
```html
<template>
  <div class="text">hello</div>
</template>

<script>
  export default {
    data() {
      return {
        color: 'red',
        font: {
          size: '2em'
        }
      }
    }
</script>

<style>
  .text {
    color: v-bind(color);

    /* expressions (wrap in quotes) */
    font-size: v-bind('font.size');
  }
</style>
```

总结：
1. 不需要显示声明什么属性作为css变量注入(从css中v-bind()的使用推断)
2. 在scoped/non-scoped模式中有相同的行为
3. 普通css变量的使用不受影响






















