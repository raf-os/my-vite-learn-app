import BaseDraggable, { type IBaseDraggableProps, DraggableHandlerWrapper } from "../BaseDraggable";
import { useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { cn } from "@/lib/utils";

export interface IBaseIONodeProps extends IBaseDraggableProps {
    uniqueID: string,
    header: React.ReactNode,
    name: string,
    children?: React.ReactNode,
    initialCoords?: TCoordinates,
    data?: Record<string, any>
}

type TCoordinates = {
    x: number,
    y: number,
}

export function createNodeInstance(props: Omit<IBaseIONodeProps, 'uniqueID'>): React.ReactElement<IBaseIONodeProps> {
    const uID = uuid();
    return <BaseIONode uniqueID={uID} {...props} />;
}

export default function BaseIONode({
    uniqueID,
    header,
    name,
    children,
    data,
    ref,
    initialCoords = {x:0, y:0},
    className
}: IBaseIONodeProps) {
    const [ coordinates, setCoordinates ] = useState<TCoordinates>(initialCoords);

    const nodeID = `node[${name}]:${uniqueID}`;
    const fullData = {
        Type: "NODE",
        ...data
    }

    const style = {
        left: coordinates.x,
        top: coordinates.y,
    }

    return (
        <BaseDraggable
            uniqueID={nodeID}
            data={fullData}
            ref={ref}
            className={cn(
                "absolute",
                className
            )}
            style={style}
        >
            <DraggableHandlerWrapper>
                { header }
            </DraggableHandlerWrapper>
            
            <div>
                { children }
            </div>
        </BaseDraggable>
    )
}