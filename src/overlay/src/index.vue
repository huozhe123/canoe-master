<script lang="ts">
import { createVNode, defineComponent, renderSlot, h } from "vue";
import { PathFlags } from "../../utils/vnode";

export default defineComponent({
  name: "Overlay",
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
  emits: ["click"],
  setup(props, { slots, emit }) {
    let mousedownTarget = false;
    let mouseupTarget = false;

    return () => {
      return props.mask
        ? createVNode("div", {
            class: ["el-overlay", props.overlayClass],
            style: {
              zIndex: props.zIndex,
            },
            onMousedown: (e: MouseEvent) => {
              if (props.mask) {
                mousedownTarget = e.target === e.currentTarget;
              }
            },
            onMouseup: (e: MouseEvent) => {},
          })
        : h(
            "div",
            {
              style: {
                zIndex: props.zIndex,
                position: "fixed",
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px",
              },
            },
            [renderSlot(slots, "default")]
          );
    };
  },
});
</script>
