import {createApp, ref, shallowRef} from "vue";
import TestApp from "./TestApp.vue";
import {Context} from "cordis";
import {CordisPlugin} from "../src";

const ctx = new Context();

createApp(TestApp)
    .use(CordisPlugin,{context:ctx})
    .mount("#app")
