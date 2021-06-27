<script lang="ts">
import { createVNode, defineComponent, renderSlot, h } from "vue";

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
  emits: ["click1"],
  setup(props, context) {
    let mousedownTarget = false;
    let mouseupTarget = false;
    const onMaskClick = (e: MouseEvent) => {
      if (mousedownTarget && mouseupTarget) {
        context.emit("click1", e);
      }
      mousedownTarget = mouseupTarget = false;
    };
    return () => {
      return createVNode(
        "div",
        {
          style: {
            zIndex: 10001,
            position: "fixed",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          onClick: onMaskClick,
          onMousedown: (e: MouseEvent) => {
            if (props.mask) {
              mousedownTarget = e.target === e.currentTarget;
            }
          },
          onMouseup: (e: MouseEvent) => {
            if (props.mask) {
              mouseupTarget = e.target === e.currentTarget;
            }
          },
        },
        [renderSlot(context.slots, "default")]
      );
    };
  },
});
</script>
