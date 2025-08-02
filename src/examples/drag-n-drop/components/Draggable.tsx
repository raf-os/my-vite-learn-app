import { useDraggable } from "@dnd-kit/core";

interface IDraggable {
    children: React.ReactNode,
    id: string,
}

export default function Draggable({
    children,
    id
}: IDraggable) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform
    } = useDraggable({
        id: `draggable-${id}`,
    });

    const styleOverride = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <button
            ref={setNodeRef}
            style={{
                ...styleOverride
            }}
            className="bg-slate-800 text-neutral-50 text-sm font-bold px-2 py-1 rounded-full"
            {...listeners}
            {...attributes}
        >
            {children}
        </button>
    )
}