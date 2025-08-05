import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import BaseIOPresetDraggable from "./components/presets/BaseIOPresetDraggable";
import AppSpaceState from "./components/AppSpaceState";

// PROBABLY easier to use Unity or other tools/libraries to achieve this...

export default function NodeBasedCodingPage() {
    return (
        <DndContext
            modifiers={[
                restrictToWindowEdges
            ]}
        >
            <div
                className="w-full h-full flex grow-1 flex-nowrap px-4 pb-6"
            >
                <LeftPanel />
                <RightPanel />
            </div>
        </DndContext>
    )
}

function RightPanel() {
    return (
        <div
            className="grow-1 pl-2 flex flex-col"
        >
            <AppSpaceState />
        </div>
    )
}

function LeftPanel() {
    return (
        <div
            className="grow-0 w-1/4 flex flex-col border border-neutral-400 rounded-box"
        >
            <div
                className="w-full mb-2 p-2 bg-slate-200 rounded-t-box"
            >
                Presets go in here, I guess
            </div>
            <div
                className="flex flex-col gap-4 p-2 items-start"
            >
                <TestNode />
            </div>
        </div>
    )
}

function TestNode() {
    return (
        <BaseIOPresetDraggable
            title="TEST NODE"
            uniqueID="preset-testNode"
        >
            I be dragging
        </BaseIOPresetDraggable>
    )
}
