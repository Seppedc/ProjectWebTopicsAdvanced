<script setup>
import { ref } from 'vue'
import DetectHeadTilt from './DetectHeadTilt.vue';
import Test from './test.vue';

//defineProps<{ msg: string }>();

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <DetectHeadTilt></DetectHeadTilt>
  <Test></Test>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
