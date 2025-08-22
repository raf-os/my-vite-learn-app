import type { TModalObservable } from "../Modal";

const Modal: TModalObservable['data'] = ({ requestClose, isTransitioning }) => {
    return (
        <div className="flex flex-col gap-2 text-neutral-800">
            <p>Node-based programming using react class components. Drag nodes from the right side and drop them anywhere within this grid frame.</p>
            <p>Connect outputs from one node to inputs on another node.</p>
            <p>After doing much of this I realized a lot could be done with function components instead of classes. Oh well.</p>
            <button className="btn" disabled={isTransitioning} onClick={requestClose}>
                Got it.
            </button>
        </div>
    )
}

const ModalMetadata: TModalObservable['metadata'] = {
    title: "About: React node-based programming",
    hasCloseButton: true,
}

const AboutModal: TModalObservable = {
    data: Modal,
    metadata: ModalMetadata,
}

export default AboutModal;