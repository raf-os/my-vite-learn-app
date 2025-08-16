import BaseNodePreset from "../../classes/BaseNodePreset";
import BaseNodeInstance from "../../classes/BaseNodeInstance";
import { BaseIONodeOutput } from "../../classes/BaseIONode";
import type { TInstanceProps } from "../../types";

export default function TestNode() {

    const instanceProps: TInstanceProps<TestNodeInstance['props']> = {
        header: 'Test Node Instance',
        children: (
            <>
            <div>
                Test node instance.
            </div>

            <div>
                <BaseIONodeOutput _id="12345" type="output" label="sample output" dataType="boolean" />
            </div>
            </>
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