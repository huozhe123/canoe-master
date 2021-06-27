<template>
  <Hello msg="123444" @change="helloClick"></Hello>
  <hr />
  <el-button type="prmary" @click="handleOpenDialog">点我打开dialog</el-button>
  <Dialog ref="dialog" v-model="visible" :before-close="handleBeforeClose"
    >123</Dialog
  >
</template>

<script lang="ts">
import {
  Ref,
  unref,
  watch,
  computed,
  reactive,
  ref,
  defineComponent,
  defineAsyncComponent,
  getCurrentInstance,
  onMounted,
} from "vue";
import Hello from "./Demo/hello.vue";
import Dialog from "./Dialog/index";
import Button from "./Button/src/button.vue";
// import Dialog from '@/components/Dialog/index.vts'

export default defineComponent({
  name: "App",
  components: {
    Hello: Hello,
    Dialog,
    ElButton: Button,
  },
  methods: {
    resolve() {
      console.log("demo");
    },
  },
  setup() {
    const counter = ref(0);
    const instance = getCurrentInstance();
    const visible = ref(false);
    const dialog = ref(null);

    const helloClick = (data) => {
      visible.value = true;
    };

    onMounted(() => {
      console.log("ref", dialog);
    });
    const handleOpenDialog = () => {
      visible.value = true;
    };
    const handleBeforeClose = (fn) => {
      visible.value = false;
      fn();
    };
    return {
      counter,
      helloClick,
      visible,
      handleOpenDialog,
      handleBeforeClose,
    };
  },
});
function add(a: Ref<number> | number, b: Ref<number> | number) {
  return computed(() => unref(a) + unref(b));
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.is-circle {
  border-radius: 50%;
}
</style>
