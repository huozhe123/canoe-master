import {computed, ref, watch, nextTick, onMounted, CSSProperties, Ref} from 'vue'
import {isNumber} from '../../utils/util'

export default function(props, ctx, targetRef: Ref<HTMLElement>) {
  const visible = ref(false)
  const closed = ref(false)
  const dialogRef = ref(null)
  const rendered = ref(false)
  const modalRef = ref<HTMLElement>(null)
  const openTimer = ref<TimeoutHandle>(null)
  const closeTimer = ref<TimeoutHandle>(null)

  watch(() => props.modelValue, (val) => {
    console.log('demo')
    if (val) {
      rendered.value = true
    } else {
      close()
    }
  })

  function doClose() {
    rendered.value = false
  }

  function close() {
    if (props.closeDelay && props.closeDelay > 0) {
      closeTimer.value = window.setTimeout(() => {
        closeTimer.value = null
        doClose()
      }, props.closeDelay)
    } else {
      doClose()
    }
  }

  function handleClose() {
    console.log('beforeClose', props.beforeClose)
    if(props.beforeClose) {
      props.beforeClose(hide)
    } else {
      close()
    }
  }
  
function onModalClick() {
  console.log('onModalClick', props.closeOnClickModal)
  if(props.closeOnClickModal) {
    handleClose()
  }
}

function hide(shouldCancel: boolean) {
  if(shouldCancel) return
  closed.value = true
  visible.value = false
}

const normalizeWidth = () => {
  if(isNumber(props.width)){
    return `${props.width}px`
  } else {
    return props.width
  }
}

const style = computed(() => {
  const style = {} as CSSProperties
  console.log('props.width', props.top)
  if(!props.fullscreen) {
    style.marginTop = props.top
    if(props.width) {
      style.width = normalizeWidth()
    }
  }
  return style
})

  return {
    visible,
    rendered,
    onModalClick,
    style,
  }
}