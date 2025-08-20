import type NodeConnection from "../NodeConnection";
import { Observable, EventBus } from "../Observable";

let connections: NodeConnection[] = [];

type ConnectionEventBus = {
    connectionAttach: void;
    connectionDetach: void;
    connectionUpdate: void;
}

const ConnectionSingleton = {
    events: new EventBus<ConnectionEventBus>(),

    attach(conn: NodeConnection) {
        connections = connections.filter(c => c.source.nodeID !== conn.source.nodeID);
        connections.push(conn);
        this.events.emit('connectionAttach', undefined);
    },

    detach(conn: NodeConnection) {
        connections = connections.filter(c => c !== conn);
        this.events.emit('connectionDetach', undefined);
    },

    removeByID(id: string) {
        connections = connections.filter(c => c.id !== id);
        this.events.emit('connectionDetach', undefined);
    },

    removeBySource(sourceId: string) {
        connections = connections.filter(c => c.source.nodeID !== sourceId);
        this.events.emit('connectionDetach', undefined);
    },

    onNodeBlockInstanceMove(id: string) {
        let hasChanged: boolean = false;
        connections.map(conn => {
            if (conn.source.ownerID === id || conn.target.ownerID === id) {
                hasChanged = true;
                conn.updatePositions();
            }
        });
        if (hasChanged) {
            this.events.emit('connectionUpdate', undefined);
        }
    },

    getConnections() {
        return connections;
    }
}

export default ConnectionSingleton;