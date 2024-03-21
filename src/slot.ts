import {Context, Service} from "cordis";
import {Component} from "@vue/runtime-core";
import {MapSet} from "./util";
import {computed, defineProps, ComputedRef, h, inject, Ref, shallowRef, ShallowRef, watch} from "vue";

export interface SlotUseConfig{
    singleton:boolean
}

declare module 'cordis'{
    interface Context{
        slot:SlotManager
    }
}

export class SlotManager extends Service{

    registry = new MapSet<string,Component>();

    hooks = new MapSet<string,{
        callback:(component:Component|Component[]|null)=>void,
        config:SlotUseConfig
    }>()
    constructor(ctx:Context) {
        super(ctx,'slot');
        ctx.provide('slot')
        ctx.slot = this;
    }

    update(name:string){
        console.info("update",name,this.hooks)
        this.hooks.get(name)?.forEach((update)=>{
            this.executeCallback(name,update.callback,update.config);
        });
    }

    register(name:string,component:Component){
        return this[Context.origin].effect(()=>{
            if(this.registry.has(name,component))
                return ()=>null;
            this.registry.add(name,component);
            this.update(name);
            return ()=>{
                this.registry.delete(name,component);
                this.update(name);
            }
        })
    }

    use(name:string,callback:(component:Component|Component[]|null)=>void,config:SlotUseConfig){
        let hook = {callback,config};
        return this[Context.origin].effect(()=> {
            this.hooks.add(name,hook);
            this.executeCallback(name,callback,config);
            return ()=>{
                this.hooks.delete(name,hook)
            }
        });
    }

    executeCallback(name:string,callback:(component:Component|Component[]|null)=>void,config:SlotUseConfig){
        let componentSet = this.registry.get(name);
        if(!componentSet?.size){
            callback(null);
            return;
        }
        let data : Component[] | Component | null;
        if(config.singleton){
            data = Array.from(componentSet!.values())?.[0];
        }else{
            data = Array.from(componentSet!.values())
        }
        callback(data);
    }
}

export const CordisSlot:Component = {
    props:['slot-name','singleton'],
    setup(props, {slots,attrs}){
        const parent = inject<ShallowRef<Context>>('cordis/context');
        if(!parent){
            throw new Error('Cannot get parent form vue: please ensure the component is in the app which injected context');
        }
        let slotName = props.slotName as string;
        let component: Ref<Component[] | Component | null>= shallowRef(null);
        const componentFinal:ComputedRef<any[]>= computed(()=>Array.isArray(component.value) ? component.value as Component[] : [component.value] as (Component|null)[])
        let parentValue:Context = parent.value;
        parentValue.slot.use(slotName,(_component)=>{
            component.value = _component!;
        },{
            singleton:!!props.singleton
        })

        return ()=>{
            console.info(componentFinal)
            return componentFinal.value.map(component=>h(component))
        }

    }
}