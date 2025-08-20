import { createContext } from "react";
import InstanceIOHandler from "../classes/handlers/InstanceIOHandler";

export interface INodeInstanceContext {
    ioHandler?: InstanceIOHandler,
}

export const defaultNodeInstanceContext: INodeInstanceContext = {}

export const NodeInstanceContext = createContext(defaultNodeInstanceContext);