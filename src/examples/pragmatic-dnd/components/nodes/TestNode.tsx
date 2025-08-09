import BaseNodePreset from "../BaseNodePreset";
import BaseNode, { type IBaseNode } from "../BaseNode";

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
        >
            test node
        </BaseNode>
    )
}