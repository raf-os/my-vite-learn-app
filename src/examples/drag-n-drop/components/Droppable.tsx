import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface IDroppable {
    children: React.ReactNode,
    id: string,
}

export default function Droppable({
    children,
    id
}: IDroppable) {
    const { isOver, setNodeRef } = useDroppable({
        id: `droppable-${id}`,
    });

    return (
        <div
            className={cn(
                "flex items-center justify-center border border-slate-200 bg-slate-100 text-slate-400 w-32 h-24 rounded-box select-none",
                isOver && "bg-blue-400 text-blue-200"
            )}
            ref={setNodeRef}
        >
            {children}
        </div>
    )
}