import BaseNodePreset from "../BaseNodePreset";
import BaseNode from "../BaseNode";

export default function TestNodePreset() {
    return (
        <BaseNodePreset
            header="Test Node Preset"
            nodeSpawn={<TestNode />}
        >
            This is a test node.
        </BaseNodePreset>
    )
}

export const TestNode: React.FC = (props) => {
    return (
        <BaseNode
            {...props}
            header="Test Node"
            inputs={[
                {
                    label: 'input'
                },
            ]}
            outputs={[
                {
                    label: 'Yes'
                }, {
                    label: 'No'
                },
            ]}
        >
            test node
        </BaseNode>
    )
}