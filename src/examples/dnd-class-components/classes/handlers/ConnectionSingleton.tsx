import type NodeConnection from "../NodeConnection";
import { Observable } from "../Observable";

let connections: NodeConnection[] = [];

const ConnectionSingleton = {
    observable: new Observable(),

    attach(conn: NodeConnection) {
        this.removeBySource(conn.source.nodeID);
        connections.push(conn);
        this.observable.notify();
    },

    detach(conn: NodeConnection) {
        connections = connections.filter(c => c !== conn);
        this.observable.notify();
    },

    removeByID(id: string) {
        connections = connections.filter(c => c.id !== id);
        this.observable.notify();
    },

    removeBySource(sourceId: string) {
        connections = connections.filter(c => c.source.nodeID !== sourceId);
        this.observable.notify();
    },

    getConnections() {
        return connections;
    }
}

export default ConnectionSingleton;