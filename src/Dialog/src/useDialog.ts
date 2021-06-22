import {computed, ref, watch, nextTick, onMounted, CSSProperties, Ref} from 'vue'


export default function(props, ctx, targetRef: Ref<HTMLElement>) {
  const visible = ref(false)
  const closed = ref(false)
  const dialogRef = ref(null)
  const rendered = ref(false)
  const modalRef = ref<HTMLElement>(null)

  watch(() => props.modelValue, (val) => {
    console.log('demo')
    if (val) {
      rendered.value = true
    }
  })
  return {
    visible,
    rendered,
  }
}