export class MapSet<K,V>{

    map : Map<K,Set<V>> = new Map();

    add(key:K,value:V){
        if(!this.map.has(key))
            this.map.set(key,new Set());
        this.map.get(key)!.add(value);
    }

    delete(key:K,value:V){
        if(!this.map.has(key))
            return;
        this.map.get(key)!.delete(value);
        if(this.map.get(key)!.size == 0)
            this.map.delete(key);
    }

    has(key:K,value:V){
        return this.map.has(key) && this.map.get(key)!.has(value);
    }

    get(key:K){
        return this.map.get(key);
    }

    clearKey(key:K){
        this.map.delete(key)
    }
}