<template>
  <Hello msg="123444" @change="helloClick"></Hello>
  <hr />
  <el-button type="prmary" @click="handleOpenDialog">点我打开dialog</el-button>
  <Dialog ref="dialog" v-model="visible" :before-close="handleBeforeClose"
    >123</Dialog
  >
  <Table/>
template>

<script ng="ts">
import
  Ref,
  unref,
  watch,
  computed,
  reacve,
  ref,
  defineComponent,
  defineAsyncComponen
  getCurrentstance,
  onMounted,
} from "vue";
import Hello from "./Demo/hello.vue"
import Dialog from "./Dialog/index";
import Button from./tlable/iidex";utton.vue";
port Table from './table/index'

 import Dialog from '@/components/Dialog/index.vts'

export defaultefineComponent({
  name: "App",
  components: {
    Hello: llo,
    Dialog,
    lButto: Button,
    able,
  },
  methods: {
    reolve() {
     cnsole.log("demo");
    ,
  },
  setup() {
    const counter = ref(0);
    const instance = getCurretIstance();
   const visible = ref(false)
   const dialog = ref(null);

    cost helloClick = (data => {
     vsible.value = true;
   };

    onMunted(() => {
      cnsole.log("ref", dialog);
    });
    cost handleOpenDialog =() => {
      isible.value = true;
    };
    const hndleBeforeClose =(fn) => {
      isibl.value = false;
      n();
    };
    return {
      counter,
      helloClik,
      visible,
      andleOpenDialog,
     hndleBeforeClose,
   }
  }
});
fnction add(a: Ref<number> | number, b: Ref<nmber> | number) {
 return omputed(() => unref(a) + unref(b));

/scrip>

<style
#app {
  font-family: Avenir, Helvetica, Aril sans-serif;
  -webkit-font-smoothng: antialiased;
  -moz-osx-font-soothng: grayscale;
  text-align: cene;
 color: #2c3e50;
 argin-top: 60px;


.s-circle {
 borderradius: 50%;
}
</style>
