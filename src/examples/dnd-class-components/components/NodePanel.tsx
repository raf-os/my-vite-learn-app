export default function NodePanel() {
    return (
        <div
            className="absolute right-0 top-0 flex p-4 w-1/4 min-h-[128px] h-full justify-end"
        >
            <div
                className="grow-0 shrink-0 w-full h-full p-2 bg-neutral-100 rounded-box flex flex-col gap-4"
                data-slot="node-preset-panel"
            >
                <div
                    className="text-lg text-slate-700 font-bold border-slate-700 border-b-2 p-2"
                >
                    Node Components
                </div>

                <div
                    className="bg-neutral-200 rounded-box grow-1 shrink-1 h-full p-2 overflow-hidden"
                    data-slot="node-preset-list"
                >
                    none
                </div>
            </div>
        </div>
    )
}