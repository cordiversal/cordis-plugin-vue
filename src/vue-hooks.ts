import {inject as vueInject, onMounted, onUnmounted, provide, ref, Ref, ShallowRef, shallowRef, watch} from "vue";
import {Context, ForkScope, Plugin} from "cordis";
export function definePlugin(plugin:Plugin.Function,inject?:string[]){
    let parent = vueInject<ShallowRef<Context|null>>('cordis/context');
    let current:ShallowRef<Context|null> = shallowRef<Context|null>(null);
    if(!parent){
        throw new Error('Cannot get parent form vue: please ensure the component is in the app which injected context');
    }
    provide('cordis/context',current);
    let scope:ForkScope|null;
    onMounted(()=>{
        const reloadHook = (parent:Context|null)=>{
            if(scope){
                scope.dispose();
                scope = null;
                current.value = null;
            }
            if(parent){
                scope = parent.plugin({
                    inject,
                    apply(ctx,config){
                        plugin(ctx,config);
                        current.value = ctx;
                        ctx.on('dispose',()=>{
                            current.value = null;
                        })
                    }
                })
            }
        };
        watch(parent!,reloadHook);
        reloadHook(parent!.value);
    })
    onUnmounted(()=>{
        if(scope){
            scope.dispose();
            scope = null;
            current.value = null;
        }
    })

    return current;
}