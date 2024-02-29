<script setup lang="ts">
import {definePlugin} from "../src/vue-hooks";
import {Context} from "cordis";
import TestGrandson from "./TestGrandson.vue";
import TestSon from "./TestSon.vue";
import {} from "./types"
import {Ref, unref} from "vue";

const plugin : Ref<Context|null> = definePlugin((ctx:Context)=>{},[
    'testServiceSon'
])
</script>

<template>
  <div v-if="plugin">
    Grand Son Component Loaded!
  </div>
  <div v-else>
    Grand Son Component Loading......
  </div>
</template>

<style scoped>

</style>