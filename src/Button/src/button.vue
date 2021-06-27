<template>
  <button
    class="el-button"
    :class="classes"
    :type="nativeType"
    :disabled="buttonDisabled"
  >
    <i class="el-icon-loading" v-if="loading" data-testid="loadingIcon"></i>
    <i :class="icon" v-else-if="icon" data-testid="icon"></i>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import {
  computed,
  Ref,
  readonly,
  isReactive,
  isProxy,
  createApp,
  watchEffect,
  shallowRef,
  customRef,
  defineComponent,
  isRef,
  onMounted,
  ref,
  reactive,
  toRefs,
  toRef,
} from "vue";
import { PropType } from "vue";

type ButtonType =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "text";
type ButtonSize = "medium" | "large" | "small" | "mini";
type ButtonNativeType = "button" | "submit" | "reset" | "menu";

export default defineComponent({
  name: "c-button",
  props: {
    size: {
      type: String as PropType<ButtonSize>,
      validator(val: string): boolean {
        return ["medium", "small", "mini", ""].includes(val);
      },
    },
    type: {
      type: String as PropType<ButtonType>,
      validator(val: string): boolean {
        return [
          "primary",
          "success",
          "warning",
          "danger",
          "info",
          "text",
        ].includes(val);
      },
    },
    nativeType: {
      type: String as PropType<ButtonNativeType>,
      default: "button",
    },
    plain: Boolean,
    round: Boolean, // 是否是圆角按钮
    circle: Boolean, // 按钮是否是圆形
    loading: Boolean, // 按钮是否显示加载状态
    disabled: Boolean, // 按钮是否是禁用状态
    icon: String, // 按钮前面的图标
  },
  setup(props: any) {
    const { size, disabled } = toRefs(props);
    const buttonDisabled = useButtonDisabled(disabled);
    const buttonSize = useButtonSize(size);

    const classes = useClasses({
      props: props,
      size: buttonSize,
      disabled: buttonDisabled,
    });
    return {
      buttonDisabled,
      classes,
    };
  },
});

const useButtonSize = (size: Ref) => {
  return computed(() => {
    // TODO 此处可用防御式编程
    return "large";
  });
};

const useButtonDisabled = (disabled: Ref) => {
  return computed(() => {
    return disabled.value;
  });
};

const useClasses = ({ props, size, disabled }) => {
  return computed(() => {
    return [
      size.value ? `el-button--${size.value}` : ``,
      props.type ? `el-button--${props.type}` : ``,
      {
        "is-plain": props.plain,
        "is-round": props.round,
        "is-circle": props.circle,
        "is-loading": props.loading,
        "is-disabled": disabled.value,
      },
    ];
  });
};
</script>

<style scoped>
.el-button {
  display: inline-block;
  line-height: 12px;
  white-space: npwrap;
  cursor: pointer;
  background: #409eff;
  border: none;
  color: #ffffff;
  outline: none;
  box-sizing: border-box;
  padding: 12px 20px;
  border-radius: 4px;
}
</style>
