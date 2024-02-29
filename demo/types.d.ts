import {Context} from "cordis";

declare module "cordis"{
    interface Context{
        testService:boolean,
        testServiceSon:boolean
    }
}