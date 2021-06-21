<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <!-- <c-button :disabled="false" :circle="true" :size="`large`">点我</c-button> -->
  <!-- <demo :name="`demo`" :age="`18`"></demo> -->
  <Hello msg="123444" @change="helloClick"></Hello>
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
} from "vue";
import Hello from "@components/Demo/hello.vue";
import Dialog from "@components/Dialog/index.ts";
// import Dialog from '@/components/Dialog/index.vts'

export default defineComponent({
  name: "App",
  components: {
    Hello: Hello,
  },
  methods: {
    resolve() {
      console.log("demo");
    },
  },
  setup() {
    const counter = ref(0);
    const instance = getCurrentInstance();
    console.log(instance);

    const helloClick = (data) => {
      console.log("change", data);
    };
    return {
      counter,
      helloClick,
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
