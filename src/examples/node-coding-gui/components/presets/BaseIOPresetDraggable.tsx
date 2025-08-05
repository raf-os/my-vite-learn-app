import { cn } from "@/lib/utils";
import BaseDraggable, { DraggableHandlerWrapper } from "../BaseDraggable";
import { useDndMonitor } from "@dnd-kit/core";

export interface IBaseIODraggableProps {
    uniqueID: string,
    title: string,
    children?: React.ReactNode,
}

export default function BaseIOPresetDraggable({
    uniqueID,
    title,
    children,
}: IBaseIODraggableProps) {
    const presetID = `PRESET-${uniqueID}`;

    return (
        <BaseDraggable
            uniqueID={presetID}
            className="p-4 bg-amber-200 rounded-box"
        >
            <DraggableHandlerWrapper
                className="font-semibold flex"
            >
                { title }
            </DraggableHandlerWrapper>

            <div>
                { children }
            </div>
        </BaseDraggable>
    )
}