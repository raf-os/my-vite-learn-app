import BaseNodePreset from "../../classes/BaseNodePreset";
import BaseNodeInstance from "../../classes/BaseNodeInstance";
import type { TInstanceProps } from "../../types";

export default function TestNode() {

    const instanceProps: TInstanceProps<TestNodeInstance['props']> = {
        header: 'Test Node Instance',
        children: 'Test node instance, y\'all',
    }

    return (
        <BaseNodePreset
            header="Test Node"
            instanceType={TestNodeInstance}
            instanceProps={instanceProps}
        >
            This is a test node.
        </BaseNodePreset>
    )
}

export class TestNodeInstance extends BaseNodeInstance {

}