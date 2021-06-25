s`2
<template>
  <teleport to="body" :disable="!appendToBody">
    <transition name="dialog-fade">
      <Overlay v-show="rendered">
        <div ref="dialogRef" :class="['el-dialog']">
          <div class="el-dialog__header">
            <slot name="title">
              <span class="el-dialog__title">
                {{ title }}
              </span>
            </slot>
            <button v-if="showClose" type="button" @click="handleClose">
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </div>
          <template v-if="rendered">
            <div class="el-dialog__body">
              <slot></slot>
            </div>
          </template>
          <div v-if="$slots.footer" class="el-dialog__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </Overlay>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, SetupContext } from "vue";

import Overlay from "../../overlay/src/index.vue";

import { default as useDialog } from "./useDialog";

export default defineComponent({
  name: "Dialog",
  components: {
    Overlay: Overlay,
  },
  directives: {},
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    beforeClose: {
      type: Function as PropType<(...args: any[]) => unknown>,
    },
    destoryOnClose: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: "",
    },
    closeOnClickModal: {
      type: Boolean,
      default: "",
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    fullscreen: {
      type: Boolean,
      default: true,
    },
    lockScroll: {
      type: Boolean,
      default: true,
    },
    modal: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    openDelay: {
      type: Number,
      default: 0,
    },
    closeDelay: {
      type: Number,
      default: 0,
    },
    top: {
      type: String,
      default: "15vh",
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
    modalClass: String,
    zIndex: {
      type: Number,
    },
  },
  emits: [],
  setup(props, ctx) {
    console.log(1);
    const dialogRef = ref<HTMLElement>(null);
    return {
      ...useDialog(props, ctx as SetupContext, dialogRef),
      dialogRef,
    };
  },
});
</script>

<style scoped></style>
