<script lang="ts">
import {createVNode, defineComponent, renderSlot, h} from 'vue'
import {PathFlags} from '@/utils/vnode'

export default defineComponent({
  name: 'Overlay',
  props: {
    mask: {
      type: Boolean,
      default: true,
    },
    overlayClass: {
      type: [String, Array, Object],
    },
    zIndex: {
      type: Number,
    },
  },
  emits: ['click'],
  setup(props, {slots, emit}) {
    let mousedownTarget = false
    let mouseupTarget = false

    const onMaskClick = (e: MouseEvent) => {
      if (mousedownTarget && mouseupTarget) {
        emit('click', e)
      }
    }

    return () => {
      return props.mask 
      ? createVNode(
        'div',
        {
          class: ['el-overlay', props.overlayClass],
          style: {
            zIndex: props.zIndex,
          },
          onClick: onMaskClick,
          onMousedown: (e: MouseEvent) => {
            if(props.mask) {
              mousedownTarget = e.target === e.currentTarget
            }
          },
          onMouseup: (e: MouseEvent) => {
            if(props.mask) {
              mouseupTarget: e.target === e.currentTarget
            }
          }
        },
        [renderSlot(slot: 'default')],
        PathFlags.STYLE | PatchFlags.CLASS | PatchFlafg.PROPS,
        ['onClick', 'onMouseup', 'onMousedown'],
      )
      : h(
        'div',
        {
          style: {
            zIndex: props.zIndex,
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
        },
        [renderSlot(slots, 'default')],
      )
    }
  },
})

</script>