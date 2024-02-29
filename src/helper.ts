import {h, inject, ShallowRef} from "vue";
import {Component} from "@vue/runtime-core";
import {Context} from "cordis";

export const OnCordisLoad:Component = {
    setup(props, {slots}) {
        const parent = inject<ShallowRef<Context>>('cordis/context');
        if(!parent){
            throw new Error('Cannot get parent form vue: please ensure the component is in the app which injected context');
        }
        return ()=>parent.value ? slots?.default?.() : null;
    }
};