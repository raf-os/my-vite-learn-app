import BaseNodePreset from "../../classes/BaseNodePreset";
import BaseNodeInstance from "../../classes/BaseNodeInstance";
import type { TInstanceProps } from "../../types";

export default function TestNode() {
    const instanceProps: TInstanceProps<TestNodeInstance['props']> = {
        header: 'Test Node Instance',
        inputs: [{
            datatype: 'boolean',
            name: 'input-0',
        }],
        outputs: [{
            datatype: 'boolean',
            name: 'output-0'
        }],
        children: (
            <div>
                Test node instance.
            </div>
        ),
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