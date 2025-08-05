import BaseDroppable from "./BaseDroppable";
import { useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";

export default function AppSpaceState() {
    const [ nodeSpace, setNodeSpace ] = useState<React.ReactNode[]>([]);

    useDndMonitor({
        onDragEnd(event) {
            console.log(event);
        }
    });

    return (
        <BaseDroppable
            uniqueID="main-app-droppable"
            className="w-full h-full p-4 bg-slate-200 rounded-box"
        >
            Thar be droppables here, lad
        </BaseDroppable>
    )
}