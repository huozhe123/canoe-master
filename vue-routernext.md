vue的重大改进随之而来带来了vue router的一系列改进

# 使用new Router代替createRouter
现在必须使用createRouter创建路由器，而不是new Router()
```html
import { createRouter } from 'vue-router'

const router = createRouter({
  // ...
})
```

# history选项代替mode
mode:“history”选项已经被一个更灵活的history选项取代。根据你所使用的模式，你必须用适当的函数来替换它:

    - "history": createWebHistory()
    - "hash": createWebHashHistory()
    - "abstract": createMemoryHistory()
	
```html
import { createRouter, createWebHistory } from 'vue-router'
// there is also createWebHashHistory and createMemoryHistory

createRouter({
  history: createWebHistory(),
  routes: [],
})

```

# 移除base选项
base选项现在作为createWebHistory(和其他histories)的第一个参数传递.
```html
import { createRouter, createWebHistory } from 'vue-router'
createRouter({
  history: createWebHistory('/base-directory/'),
  routes: [],
})
```
# 匹配所有路径
匹配所有路径vue2使用*，现在必须使用带有正则表达式的参数进行定义
- /:pathMatch(.*)
- /:pathMatch(.*)
- /:catchAll(.*)

```html
const routes = [
  // pathMatch is the name of the param, e.g., going to /not/found yields
  // { params: { pathMatch: ['not', 'found'] }}
  // this is thanks to the last *, meaning repeated params and it is necessary if you
  // plan on directly navigating to the not-found route using its name
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  // if you omit the last `*`, the `/` character in params will be encoded when resolving or pushing
  { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound },
]
```


