import BaseDroppable from "./BaseDroppable";
import { AppContext, type TAppContext } from "..";
import { useState, useEffect, cloneElement } from "react";
import { type IBaseIONodeProps } from "./presets/BaseIONode";

export default function AppSpaceState({ ctxOverride }: { ctxOverride: (props: TAppContext) => void }) {
    const [ nodeSpace, setNodeSpace ] = useState<React.ReactNode[]>([]);
    const [ isMounted, setIsMounted ] = useState<boolean>(false);

    const appendNode = (
        node: React.ReactElement<IBaseIONodeProps>,
        { coords = {x:0,y:0} }: { coords?: {x:number,y:number} }) => {
        const newNode = cloneElement(node, {
            key: node.props.uniqueID,
            initialCoords: coords
        });
        const newSpace = nodeSpace;
        newSpace.push(newNode);
        setNodeSpace(newSpace);
    }

    const detachNode = () => {
    }

    useEffect(() => {
        if (!isMounted) {
            ctxOverride({
                appendNode: appendNode,
                detachNode: detachNode
            });
            setIsMounted(true);
        }
    }, [!isMounted]);

    return (
        <BaseDroppable
            uniqueID="main-app-droppable"
            className="w-full h-full p-4 bg-slate-200 rounded-box"
            data={{
                ctx: "app"
            }}
        >
            { nodeSpace }
        </BaseDroppable>
    )
}