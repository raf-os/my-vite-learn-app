export class Observable<TArgs extends any[] = any[], TReturn extends any = void> {
    private observers: ((...args: TArgs) => TReturn)[] = [];

    constructor() {
        this.observers = [];
    }

    subscribe(func: (...args: TArgs) => TReturn) {
        this.observers.push(func);
    }

    unsubscribe(func: (...args: TArgs) => TReturn) {
        this.observers = this.observers.filter((observer) => observer !== func);
    }

    notify(...args: TArgs) {
        this.observers.forEach((observer) => observer(...args));
    }
}