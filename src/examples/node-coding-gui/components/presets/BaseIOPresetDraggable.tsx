import { cn } from "@/lib/utils";
import { useDndMonitor } from "@dnd-kit/core";
import BaseDraggable, { DraggableHandlerWrapper, type IBaseDraggableProps } from "../BaseDraggable";
import { type IBaseIONodeProps } from "./BaseIONode";
import { useContext } from "react";
import { AppContext } from "../..";

export interface IBaseIODraggableProps extends IBaseDraggableProps {
    uniqueID: string,
    header: React.ReactNode,
    children?: React.ReactNode,
    data?: Record<string, any>,
    spawnNode: () => React.ReactElement<IBaseIONodeProps>
}

export default function BaseIOPresetDraggable({
    uniqueID,
    header,
    children,
    data,
    spawnNode
}: IBaseIODraggableProps) {
    const presetID = `PRESET[${uniqueID}]`;
    const fullData = {
        Type: "PRESET",
        ...data
    }

    const { appendNode } = useContext(AppContext);

    useDndMonitor({
        onDragEnd(event) {
            // this is a pain in the ass
            if (event.active.id === presetID && event.over?.data.current?.ctx === "app") {
                console.log(event);
                const coords = {
                    x: event.delta.x - event.over.rect.left,
                    y: event.delta.y - event.over.rect.top,
                }
                appendNode(spawnNode(), { coords: coords });
            }
        },
    });

    return (
        <BaseDraggable
            uniqueID={presetID}
            data={fullData}
            className="p-4 bg-amber-200 rounded-box"
        >
            <DraggableHandlerWrapper
                className="font-semibold"
            >
                { header }
            </DraggableHandlerWrapper>

            <div>
                { children }
            </div>
        </BaseDraggable>
    )
}