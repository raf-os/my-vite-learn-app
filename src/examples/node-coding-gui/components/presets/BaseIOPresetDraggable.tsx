import BaseDraggable, { DraggableHandlerWrapper, type IBaseDraggableProps } from "../BaseDraggable";
import { type IBaseIONodeProps } from "./BaseIONode";
import { useDragDropMonitor } from "@dnd-kit/react";
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

    //const { appendNode } = useContext(AppContext);

    useDragDropMonitor({ // The app screams about not being within a DragDropProvider, but it definitely is
        onDragEnd(event) { // The lack of documentation is astounding. Yes this is the experimental branch but it was the same with @dnd-kit/core
            if (event.operation.source?.id === uniqueID && event.operation.target?.data.ctx === "app") {
                // valid
                console.log(event);
            }
        }
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