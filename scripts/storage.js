class Storage{
    constructor(storage = {}) {
        if(this.constructor.name === 'Storage'){
            throw 'abstract';
        }
        this.storage = storage;
    };

    set(key, value){
        this.storage[key] = value;
    }
    get(key){
        return this.storage[key];
    }
    clear(){
        this.storage = {};
    }
}

class PersistentStorage extends Storage{
    constructor() {
        super(window.localStorage);
        if(this.constructor.instance){
            return this.constructor.instance;
        }
        this.constructor.instance = this;
    }

    set(key, value) {
        this.storage.setItem(key, value);
        console.debug(`SAVE TO LOCAL STORAGE: '${key}': '${value}'`);
    }

    get(key){
        return this.storage.getItem(key);
    }

    clear() {
        this.storage.clear();
    }
}

class MemoryStorage extends Storage{
    constructor() {
        super();
        if(this.constructor.instance){
            return this.constructor.instance;
        }
        this.constructor.instance = this;
    }

    set(key, value) {
        this.storage[key] = value;
        console.debug(`SAVE TO MEMORY STORAGE: '${key}': '${value}'`);
    }

    get(key){
        return this.storage[key];
    }

    clear() {
        this.storage = {};
    }
}
