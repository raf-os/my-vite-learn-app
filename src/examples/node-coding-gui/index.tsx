import { createContext, useState } from "react";

import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import { TestDevNodePreset } from "./components/nodes/TestDevNode";
import AppSpaceState from "./components/AppSpaceState";

// PROBABLY easier to use Unity or other tools/libraries to achieve this...

export type TAppContext = {
    appendNode: (...args: any) => void,
    detachNode: (...args: any) => void,
}

const defaultAppContext: TAppContext = {
    appendNode: () => {},
    detachNode: () => {}
}

export const AppContext = createContext<TAppContext>({
    appendNode: () => {},
    detachNode: () => {},
});

export default function NodeBasedCodingPage() {
    const [ context, setContext ] = useState<TAppContext>(defaultAppContext);

    return (
        <DndContext
            modifiers={[
                restrictToWindowEdges
            ]}
        >
            <AppContext.Provider value={context}>
                <div
                    className="w-full h-full flex grow-1 flex-nowrap px-4 pb-6"
                >
                    <LeftPanel />
                    <RightPanel ctxOverride={setContext} />
                </div>
            </AppContext.Provider>
        </DndContext>
    )
}

function RightPanel({ ctxOverride }: { ctxOverride: (props: TAppContext) => void }) {
    return (
        <div
            className="grow-1 pl-2 flex flex-col relative"
        >
            <AppSpaceState ctxOverride={ctxOverride} />
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
        <TestDevNodePreset />
    )
}
