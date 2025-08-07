import { useRef, useEffect, useState } from "react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export default function PragmaticDNDTestPage() {
    return (
        <div
            className="flex flex-col gap-4 w-full h-full grow-1 shrink-1"
        >
            <div
                className="grow-0 shrink-0 w-full text-center"
            >
                DND using pragmatic dnd
            </div>

            <div
                className="flex grow-1 shrink-1 w-full p-8"
            >
                <div
                    className="grid-bg rounded-[8px] grow-1 relative overflow-hidden"
                    data-slot="app-space"
                >
                    <NodeSpaceWrapper>
                        <div
                            className="absolute left-0 top-0 flex p-4 w-full h-full justify-end"
                        >
                            <NodeListPanel />
                        </div>
                    </NodeSpaceWrapper>
                </div>
            </div>
        </div>
    )
}

interface IBaseNodePreset extends React.ComponentPropsWithoutRef<'div'> {}

function BaseNodePreset({
    children,
    style,
    ...rest
}: IBaseNodePreset) {
    const ref = useRef<HTMLDivElement>(null);
    const [ isDragging, setIsDragging ] = useState<boolean>(false);

    const styleOverride = {
        ...style,
        opacity: isDragging?"50%":"100%"
    }

    useEffect(() => {
        if (ref.current) {
            const element = ref.current;

            return draggable({
                element: element,
                getInitialData: () => ({ type: "preset" }),
                onDragStart: () => setIsDragging(true),
                onDrop: ({ location }) => {
                    setIsDragging(false);
                    console.log(location.current.dropTargets);
                },
            });
        }
    }, []);

    return (
        <div
            className="bg-amber-300 rounded-box p-2"
            style={styleOverride}
            ref={ref}
            {...rest}
        >
            { children }
        </div>
    )
}

function NodeListPanel() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const el = ref.current;

            return dropTargetForElements({
                element: el,
                getData: () => ({ type: "node-panel" }),
            });
        }
    })

    return (
        <div
            className="top-4 right-4 w-1/4 min-h-[128px] h-full p-2 bg-neutral-100 rounded-box flex flex-col gap-4"
            ref={ref}
        >
            <div
                className="text-lg text-slate-700 font-bold border-slate-700 border-b-2 p-2"
            >
                Node List
            </div>

            <div
                className="bg-neutral-200 rounded-box grow-1 shrink-1 h-full p-2 overflow-hidden"
                data-slot="node-preset-list"
            >
                <BaseNodePreset>
                    test node
                </BaseNodePreset>
            </div>
        </div>
    )
}

interface INodeSpaceWrapperProps extends React.ComponentPropsWithoutRef<'div'> {
}

function NodeSpaceWrapper({
    children,
    ...rest
}: INodeSpaceWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [ isOver, setIsOver ] = useState(false);

    useEffect(() => {
        if (ref.current) {
            const el = ref.current;

            return dropTargetForElements({
                element: el,
                getData: () => ({ type: "node-space" }),
                onDragEnter: () => setIsOver(true),
                onDragLeave: () => setIsOver(false),
                onDrop: () => setIsOver(false),
            });
        }
    }, []);

    return (
        <div
            className="w-full h-full"
            
            ref={ref}
            {...rest}
        >
            <div
                style={{
                    opacity: "25%",
                    backgroundColor: isOver?"green":"red",
                    height: "100%"
                }}
            >
                Drop target
            </div>
            { children }
        </div>
    )
}