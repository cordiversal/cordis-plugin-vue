import {Context} from "cordis";
import {createApp, Ref, Plugin as VuePlugin, shallowRef} from "vue";

export const CordisPlugin: VuePlugin<{context:Context}> = {
    install(app,options){
        let context_reference = shallowRef();
        app.provide('cordis/context',context_reference);
        options.context.plugin((ctx:Context)=>{
            context_reference.value = ctx;
            ctx.on('dispose',()=>{
                context_reference.value = null
            });
        })
    }
}

export * from './vue-hooks';
export * from './helper';