import { cn } from "@/lib/utils";
import BaseDraggable, { BaseDraggableContext } from "../BaseDraggable";
import { useContext } from "react";

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
    const listeners = useContext(BaseDraggableContext);
    const presetID = `PRESET-${uniqueID}`;

    return (
        <BaseDraggable
            uniqueID={presetID}
            className="p-4 bg-amber-200"
        >
            <div
                {...listeners}
                className="font-semibold cursor-pointer"
            >
                { title }
            </div>

            <div>
                { children }
            </div>
        </BaseDraggable>
    )
}