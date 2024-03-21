import {inject as vueInject, onMounted, onUnmounted, provide, ref, Ref, ShallowRef, shallowRef, watch} from "vue";
import {Context, ForkScope, Plugin} from "cordis";
export function definePlugin<C extends Context>(plugin:Plugin.Function<C>,inject?:string[]){
    let parent = vueInject<ShallowRef<C|null>>('cordis/context');
    let current:ShallowRef<C|null> = shallowRef<C|null>(null);
    if(!parent){
        throw new Error('Cannot get parent form vue: please ensure the component is in the app which injected context');
    }
    provide('cordis/context',current);
    let scope:ForkScope|null;
    onMounted(()=>{
        const reloadHook = (parent:C|null)=>{
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