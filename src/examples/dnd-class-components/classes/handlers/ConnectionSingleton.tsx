import NodeConnection from "../NodeConnection";
import TemporaryNodeConnection from "../TemporaryConnection";
import { EventBus } from "../Observable";

type TConnection = (NodeConnection | TemporaryNodeConnection);

let connections: TConnection[] = [];

type ConnectionEventBus = {
    connectionAttach: void;
    connectionDetach: void;
    connectionUpdate: void;
}

export function createTemporaryNodeConnection(handleElement: HTMLDivElement) {
    return new TemporaryNodeConnection(handleElement);
}

const ConnectionSingleton = {
    events: new EventBus<ConnectionEventBus>(),

    attach(conn: TConnection) {
        if (conn instanceof NodeConnection) {
            connections = connections.filter(c => {
                if (c instanceof TemporaryNodeConnection) return true;
                return c.source.nodeID !== conn.source.nodeID;
            });
        }
        connections.push(conn);
        this.events.emit('connectionAttach', undefined);
    },

    detach(conn: TConnection) {
        connections = connections.filter(c => c !== conn);
        this.events.emit('connectionDetach', undefined);
    },

    getById(id: string) {
        return connections.find(conn => conn.id === id);
    },

    getByOwner(ownerId: string) {
        return connections.filter(conn => conn instanceof NodeConnection && (conn.source.ownerID === ownerId || conn.target.ownerID === ownerId));
    },

    removeByID(id: string) {
        connections = connections.filter(c => c.id !== id);
        this.events.emit('connectionDetach', undefined);
    },

    removeBySource(sourceId: string) {
        connections = connections.filter(c => c instanceof TemporaryNodeConnection || (c.source.nodeID !== sourceId));
        this.events.emit('connectionDetach', undefined);
    },

    onNodeBlockInstanceMove(id: string) {
        let hasChanged: boolean = false;
        connections.map((conn) => {
            if (conn instanceof TemporaryNodeConnection) return;
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