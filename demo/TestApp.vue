<script setup lang="ts">
  import {definePlugin,CordisSlot} from "../src";
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
    <div>
      Service Test
      <button @click="loadService()">Load test service</button>
      <button @click="unloadService()">Unload test service</button>
      <TestSon></TestSon>
    </div>
    <div>
      Slot Test
      <CordisSlot slot-name="test"/>
    </div>
  </div>
  <div v-else>
    Loading main component....
  </div>
</template>

<style scoped>

</style>