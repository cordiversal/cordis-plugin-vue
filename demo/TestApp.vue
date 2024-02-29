<script setup lang="ts">
  import {definePlugin} from "../src/vue-hooks";
  import {Context} from "cordis";
  import TestGrandson from "./TestGrandson.vue";
  import TestSon from "./TestSon.vue";
  import {} from "./types"
  import {Ref, unref} from "vue";

  const plugin : Ref<Context|null> = definePlugin((ctx:Context)=>{
    ctx.provide("testService");
  })

  function loadService(){
    unref(plugin).testService = true;
  }

  function unloadService(){
    unref(plugin).testService = null;
  }

</script>

<template>
  <div v-if="plugin">
    Parent Component Loaded!
    <button @click="loadService()">Load test service</button>
    <button @click="unloadService()">Unload test service</button>
    <TestSon></TestSon>
  </div>
  <div v-else>
    Loading main component....
  </div>
</template>

<style scoped>

</style>