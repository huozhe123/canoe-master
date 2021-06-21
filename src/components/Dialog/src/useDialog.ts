import {computed, ref, watch, nextTick, onMounted, CSSProperties} from 'vue'

import isServer from '@/utils/isServer'
import {UPDATE_MODEL_EVENT} from '@/utils/constants'
import PopupManager from '@/utils/popup-manager'
import {clearTimer, isNumber} from '@/y'

export default function(props: useDialogProps, ctx: SetupContext, targetRef: Ref<HTMLElement>) {
  const visible = ref(false)
  const closed = ref(false)
  const dialogRef = ref(null)
  const openTimer = ref<TimeoutHandle>(null)
  const closeTimer = ref<TimerHandle>(null)
  const rendered = ref(false)
  const zIndex = ref(props.zIndex || PopupManager.nextZIndex())
  const modalRef = ref<HTMLElement>(null)

  const normalizeWidth = () => {
    if(isNumber(props.width)) {
      return `${props.width}px`
    } else {
      return props.width
    }
  }

  const style = computed(() => {
    const style = {} as CSSProperties
    if (!props.fullScreen) {
      style.marginTop = props.top
      if (props.width) {
        style.width = normalizeWidth()
      }
    }
    return style
  })

  function afterEnter() {
    ctx.emit(OPENED_EVENT)
  }

  function afterLeave() {
    ctx.emit(CLOSED_EVENT)
    ctx.emit(UPDATE_MODAL_EVENT, false)
    if (props.destoryOnClose) {
      rendered.value = false
    }
  }

  function beforeLeave() {
    ctx.emit(CLOSED_EVENT)
  }

  function open() {
    clearTimer(closeTimer)
    clearTimeout(openTimer)
    if(props.openDelay && props.openDelay > 0) {
      openTimer.value = window.setTimeout(() => {
        openTimer.value = null
        doOpen()
      }, props.openDelay)
    } else {
      doOpen()
    }
  }

  function close() {
    clearTimer(openTimer)
    clearTimer(closeTimer)

    if (props.closeDelay && props.closeDelay > 0) {
      closeTimer.value = window.setTimeout(() => {
        closeTimer.value = null
        doClose()
      }, props.closeDelay)
    } else {
      doClose()
    }
  }

  function hide(shouldCancel: boolean) {
    if (shouldCancel) return
    closed.value = true
    visible.value = false
  }

  function handleClose() {
    if (props.beforeClose) {
      props.beforeClose()
    } else {
      close()
    }
  }

  function onModalClick() {
    if (props.closeOnClickModal) {
      handleClose()
    }
  }

  function doOpen() {
    if(isServer) {
      return
    }
    visible.value = false
  }

  function doClose() {
    useLockScreen(visible)
  }

  if (props.lockScreen) {
    useLockScreen(false)
  }
  if (props.closeOnPressEscape) {
    useModal({
      handleClose,
    }, visible)
  }

  useRestoreActive(visible)
  watch(() => props.modalValue, val => {
    if (val) {
      closed.value = false
      open()
      rendered.value = true
      ctx.emit(OPEN_EVENT)
      zIndex.value = props.zIndex ? zIndex.value++ : PopupManager.nextZIndex()
      nextTick(() => {
        if(targetRef.value) {
          targetRef.value.scrollTop = 0
        }
      })
    } else {
      if (visible.value) {
        close()
      }
    }
  })

  onMounted(() => {
    if(props.modalValue) {
      visible.value = true
      rendered.value = true
      open()
    }
  })

  return {
    afterEnter,
    afterLeave,
    beforeLeave,
    handleClose,
    closed,
    dialogRef,
    style,
    rendered,
    modalRef,
    visible,
    zIndex,
  }
}