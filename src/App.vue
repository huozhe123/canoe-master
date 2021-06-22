<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <!-- <c-button :disabled="false" :circle="true" :size="`large`">点我</c-button> -->
  <!-- <demo :name="`demo`" :age="`18`"></demo> -->
  <Hello msg="123444" @change="helloClick"></Hello>
  <hr />
  <Dialog ref="dialog" v-model="visible">123</Dialog>
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
// import Dialog from '@/components/Dialog/index.vts'

export default defineComponent({
  name: "App",
  components: {
    Hello: Hello,
    Dialog,
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
    return {
      counter,
      helloClick,
      visible,
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
