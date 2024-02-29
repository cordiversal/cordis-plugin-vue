<script setup lang="ts">
import {definePlugin,OnCordisLoad} from "../src";
import {Context} from "cordis";
import TestGrandson from "./TestGrandson.vue";
import TestSon from "./TestSon.vue";
import {} from "./types"
import {Ref, unref} from "vue";

const plugin : Ref<Context|null> = definePlugin((ctx:Context)=>{
  ctx.provide("testServiceSon");
},['testService'])

function loadService(){
  unref(plugin).testServiceSon = true;
}

function unloadService(){
  unref(plugin).testServiceSon = null;
}

</script>

<template>
  <OnCordisLoad>
    Son Component Loaded!
    <button @click="loadService()">Load testServiceSon</button>
    <button @click="unloadService()">Unload testServiceSon</button>
    <TestGrandson></TestGrandson>
  </OnCordisLoad>
</template>

<style scoped>

</style>