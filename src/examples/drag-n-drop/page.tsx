import { DndContext, type DragEndEvent} from "@dnd-kit/core";
import { useState } from "react";

import Droppable from "./components/Droppable";
import Draggable from "./components/Draggable";

export default function DragNDropPage() {
    const containers = ['A', 'B', 'C'];
    const [ parent, setParent ] = useState<string | null>(null);
    const draggableMarkup = (
        <Draggable id="fat-nuts">
            The Dragger
        </Draggable>
    )

    return (
        <div className="w-full md:w-[800px]">
            <div>
                WHERE WE DROPPIN, BOYS?
            </div>

            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex flex-col gap-4 items-center border border-neutral-400 p-8 rounded-box">
                    { parent === null ? draggableMarkup : null }

                    <div className="flex gap-4">
                        {containers.map((id) => (
                            <Droppable key={id} id={id}>
                                { parent === `droppable-${id}` ? draggableMarkup : `DROP [${id}]` }
                            </Droppable>
                        ))}
                    </div>
                </div>
                
                
            </DndContext>
        </div>
    );

    function handleDragEnd(event: DragEndEvent) {
        const {over} = event;

        setParent(over ? String(over.id) : null);
    }
}