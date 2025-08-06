import BaseIOPresetDraggable from "../presets/BaseIOPresetDraggable";
import {createNodeInstance} from "../presets/BaseIONode";

export function TestDevNodePreset() {
    return (
        <BaseIOPresetDraggable
            uniqueID="TestDevNode"
            header="Test Node"
            spawnNode={TestDevNodeSpawn}
        >
            {`<<<`}(TEST NODE BODY){`>>>`}
        </BaseIOPresetDraggable>
    )
}

export function TestDevNodeSpawn() {
    return createNodeInstance({
        header: "Test Node (spawn)",
        name: "testNode",
        className: "bg-amber-400 p-4"
    });
}