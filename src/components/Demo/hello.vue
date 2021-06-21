<template>
    <p class="text">{{msg}}</p>
    <button @click="$emit('change', 'hello')">emit发送{{newObj}}</button>
</template>


<script setup>
import {ref, defineProps, defineEmit, useContext, watchEffect, reactive, toRef} from 'vue'
// props emit

const props = defineProps({
  msg: String,
})
const color = ref('red')
const age = ref(18)

const emit = defineEmit(['change', 'delete'])
const {slots, attrs} = useContext()
</script>

<style scoped>
.text {
  color: v-bind(color)
}
</style>
