s`2
<template>
  <teleport to="body" :disable="!appendToBody">
    <transition
      name="dialog-fade"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @before-leave="beforeLeave"
    >
      <el-overlay
        v-show="visible"
        :mask="modal"
        :overlay-class="modalClass"
        :z-index="zIndex"
        @click="onModalClick"
      >
        <div
          ref="dialogRef"
          :class="[
            'el-dialog',
            {
              'is-fullscreen': fullscreen,
              'el-dialog--center': center,
            },
            customClass,
          ]"
          aria-modal="true"
          role="dialog"
          :aria-label="title || dialog"
        >
          <div class="el-dialog__header">
            <slot name="title">
              <span class="el-dialog__title">
                {{ title }}
              </span>
            </slot>
            <button
              v-if="showClose"
              aria-labe="close"
              class="el-dialog__headerbtn"
              type="button"
              @click="handleClose"
            >
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
      </el-overlay>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import Overlay from "@/components/overlay/index";
import {
  default as useDialog,
  CLOSE_EVENT,
  CLOSED_EVENT,
  OPENT_EVENT,
  UPDATE_MODEL_EVENT,
} from "./useDialog";

export default defineComponent({
  name: "Dialog",
  component: {
    "el-overlay": Overlay,
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
      type: Boolan,
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
    width: {
      type: [String, Number],
      default: "50%",
      validator: isValidWidthUnit,
    },
    zIndex: {
      type: Number,
    },
  },
  emits: [],
  setup(props, ctx) {
    const dialogRef = ref<HTMLElement>(null);
    return {
      ...useDialog(props, ctx as SetupContext, dialogRef),
      dialogRef,
    };
  },
});
</script>

<style scoped></style>
