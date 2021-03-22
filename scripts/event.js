class MyEvent {
    constructor() {
        this.handlers = new Map();
        this.count = 0;
    }

    subscribe(handler) {
        this.handlers.set(++this.count, handler);
        return this.count;
    }

    unsubscribe(idx) {
        this.handlers.delete(idx);
    }

    // 1) who fired the event?
    // 2) additional data (event args)
    fire(sender, args) {
        this.handlers.forEach(
            handler => handler(sender, args) );
    }
}
