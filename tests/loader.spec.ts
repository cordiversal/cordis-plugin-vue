import {describe,it,onTestFinished} from 'vitest'
import {h, markRaw} from "vue";
import {mount} from "@vue/test-utils"
import {Component} from "@vue/runtime-core";
import {CordisPlugin, definePlugin} from "../src";
import {Context} from "cordis";

declare module "cordis"{
    interface Context{
        test: { }
    }
    interface Events{
        close();
    }
}

describe('Loader', () => {
    it('Should children start when ready',()=>new Promise((done)=>{
        let children : Component = {
            setup(){
                console.info("Children load")
                definePlugin((ctx:Context)=>{
                    done(null);
                })
                return ()=>h('div',['OK'])
            }
        }
        let parent : Component = {
            setup(){
                console.info("Parent load")
                definePlugin((ctx:Context)=>{

                })
                return ()=>h('div',[h(children)]);
            }
        }
        document.body.innerHTML = `<div id="app"></div>`
        let vue = mount(h(parent),{
            global:{
                plugins:[{install:(app,config)=>CordisPlugin.install(app,{context:markRaw(new Context())})}]
            },
            attachTo:document.getElementById('app') as unknown as HTMLElement
        });
        onTestFinished(()=>vue.unmount())
    }))

    it('Should children dispose when dependency unloaded',()=>new Promise(async (done)=>{
        let children : Component = {
            setup(){
                definePlugin((ctx:Context)=>{
                    console.info("Children load")
                    ctx.emit('close');
                    ctx.on('dispose',()=>{
                        done(null);
                        console.info("Parent close")
                    })
                },['test'])
                return ()=>h('div',['OK'])
            }
        }
        let parent : Component = {
            setup(){
                definePlugin(async (ctx:Context)=>{
                    ctx.provide('test');
                    ctx.on('ready',()=>{
                        ctx.test = {};
                    })
                    ctx.on('close',()=>{
                        ctx.test = undefined;
                        delete ctx.test;
                    })
                })
                return ()=>h('div',[h(children)]);
            }
        }
        document.body.innerHTML = `<div id="app"></div>`
        let ctx = new Context();
        await ctx.start();
        let vue = mount(h(parent),{
            global:{
                plugins:[[CordisPlugin,{context:markRaw(ctx)}]]
            },
            attachTo:document.getElementById('app') as unknown as HTMLElement
        });
        onTestFinished(()=>vue.unmount())
    }))
});