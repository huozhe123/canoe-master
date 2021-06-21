<template>
    <div class="el-tabs"
        :class="[
          'el-tabs--'+tabPosition
          {
            'el-tabs--card': type === 'card',
            'el-tabs-border-card': type === 'border-card'
          }
        ]"
        ref="tabs"
        >
      
    </div>
</template>

<script>

import {
  getCurrentInstance.
  nextTick.
  onMounted，
  onUpdated,
  provide,
  reactive,
  computed,
  ref,
  watch.
  toRefs
} from "vue"

export default {
    name: 'ElTabs',
    
    props: {
      modelValue: [String, Number], // 绑定值，选中选项卡的name
      type: {
        type: String,
        default: ''
      }, // 卡片样式
      closeable: Boolean,
      addable: Boolean,
      editable: Boolean,
      tabPosition: {
        type: String,
        default: 'top'
      },
      stretch: Boolean,
      beforeLeave: {
        type: Function,
        default: () => () => true
      }

    },

    emits: ['updaye:modelValue', 'tab-click', 'tab-remove', 'tab-add', 'tab-edit'],

    setup(props) {
      const tabList = reactive({})
      const tabElList = reactive({})

      const {
        scrollable,
        tabs,
        tabScroll,
        tabNav,
        direction,
        scrollToActive,
        handleClickLeft,
        handleClickRight,
      } = useTabScroll({
        tabElList
      })

      const {state, handleClick, handleClose} = useTabNav({
        tabElList,
        tabList,
        scrollToActive
      })

      const {activeBarStyle} = useTabBarStyle({tabList, state, direction})
       
       provide('elTabsInfo', {
         tabList,
         props,
         state
       })

       return {
         activeBarStyle,
         state,
         tabList,
         tabElList,
         scrollable,
         tabScroll,
         tabNav,
         tabs,
         handleClick,
         handleClose,
         handleClickLeft,
         handleClickRight
       }
    },
};

function useTabBarStyle({tabList, state, direction}) {
  const activeBarStyle = computed(() => {
    const {sizeName, textSizeName, posName, dirFlag} = direction.value
  })
}
</script>

<style lang="sass" scoped>
</style>
