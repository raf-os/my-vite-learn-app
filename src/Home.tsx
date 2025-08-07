import Link from "./components/Link";

export default function Home() {
    return (
        <div
            className="flex flex-col w-[800px]"
        >
            <div
                className="text-xl mb-4 font-bold"
            >
                Content list
            </div>

            <div
                className="flex flex-col gap-3 bg-slate-200 px-4 py-3 rounded-box"
            >
                <Link to="/form-submission-override">
                    Form override test
                </Link>

                <Link to="/drag-n-drop">
                    Drag N Drop
                </Link>

                <Link to="/node-coding-ui">
                    Node-based Coding UI experiment (incomplete, abandoned)
                </Link>

                <Link to="/pragmatic-dnd">
                    Drag n drop, using pragmatic dnd instead
                </Link>
            </div>
        </div>
    )
}