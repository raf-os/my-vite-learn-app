export class Observable<TArgs extends any[] = any[]> {
    private observers: ((...args: TArgs) => void)[] = [];

    subscribe(func: (...args: TArgs) => void) {
        this.observers.push(func);
    }

    unsubscribe(func: (...args: TArgs) => void) {
        this.observers = this.observers.filter((observer) => observer !== func);
    }

    notify(...args: TArgs) {
        this.observers.forEach((observer) => observer(...args));
    }
}

type EventHandler<T = any> = (payload: T) => void;

export class EventBus<Events extends Record<string, any>> {
    private listeners: {
        [K in keyof Events]?: Set<EventHandler<Events[K]>>
    } = {};

    on<K extends keyof Events>(eventName: K | K[], callback: EventHandler<Events[K]>): void {
        const eventNames = Array.isArray(eventName) ? eventName : [eventName];
        for (const event of eventNames) {
            if (!this.listeners[event]) {
                this.listeners[event] = new Set();
            }
            this.listeners[event]!.add(callback);
        }
    }

    off<K extends keyof Events>(eventName: K | K[], callback: EventHandler<Events[K]>): void {
        const eventNames = Array.isArray(eventName) ? eventName : [eventName];
        for (const event of eventNames) {
            this.listeners[event]?.delete(callback);
        }
    }

    emit<K extends keyof Events>(eventName: K, payload: Events[K]): void {
        this.listeners[eventName]?.forEach(handler => handler(payload));
    }
}
