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
  emits: ["click"],
  setup(props, { slots, emit }) {
    let mousedownTarget = false;
    let mouseupTarget = false;
    return () => {
      return h(
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
        },
        [renderSlot(slots, "default")]
      );
    };
  },
});
</script>
