import NodeSpace from "./components/NodeSpace";

export default function DndClassComponents() {
    return (
        <div
            className="flex flex-col gap-2 w-full h-full grow-1 shrink-1"
        >
            <div
                className="flex grow-1 shrink-1 w-full p-8"
            >
                <div
                    className="grid-bg rounded-[8px] grow-1 shrink-1 relative overflow-hidden"
                    data-slot="app-space"
                >
                    <NodeSpace />
                </div>
            </div>
        </div>
    )
}