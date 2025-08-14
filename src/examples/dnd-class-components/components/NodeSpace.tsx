import NodePanel from "./NodePanel";

export default function NodeSpace() {
    return (
        <div
            className="w-full h-full relative"
            data-slot="app-space"
        >
            <NodePanel />
        </div>
    )
}