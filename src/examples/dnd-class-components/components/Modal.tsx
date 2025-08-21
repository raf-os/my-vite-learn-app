import { useEffect, useState, useRef } from "react";
import { Observable } from "../classes/Observable";

type TModalObservable = {
    data: React.ReactNode,
}

export const ModalSingleton = {
    observable: new Observable<[TModalObservable]>(),

    attach(callback: (data: TModalObservable) => void) {
        this.observable.subscribe(callback);

        return () => {
            this.observable.unsubscribe(callback);
        }
    },

    create(data: TModalObservable) {
        this.observable.notify(data);
    }
}

export default function Modal() {
    const [ isShowing, setIsShowing ] = useState<boolean>(false);
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [ messageJsx, setMessageJsx ] = useState<React.ReactNode>(null);
    const elRef = useRef<HTMLDivElement>(null);

    const style = {
    } as React.CSSProperties;

    const onModalOpenRequest = (payload: TModalObservable) => {
        setMessageJsx(payload.data);
        setIsShowing(true);
        setIsOpen(true);
    }

    const onModalCloseRequest = () => {
        setIsShowing(false);
    }

    useEffect(() => {
        return ModalSingleton.attach(onModalOpenRequest);
    }, []);

    useEffect(() => {
        if (elRef.current) {
            const onTransitionEnd = () => {
                if (!isShowing) {
                    setIsOpen(false);
                }
            }

            elRef.current.addEventListener("transitionend", onTransitionEnd);

            return () => elRef.current?.removeEventListener("transitionend", onTransitionEnd);
        }
    }, [isShowing]);

    return isOpen ? (
        <div
            className="modal-component"
            style={style}
            data-show={ isShowing ? "true" : "false" }
            ref={elRef}
        >
            <div
                className="bg-neutral-50 border border-neutral-400 rounded-box items-center max-w-[600px]"
            >
                <div
                    className="flex flex-col gap-2 items-center px-4 py-3"
                >
                    { messageJsx }
                    <button
                        onClick={onModalCloseRequest}
                        disabled={!isShowing}
                        className="bg-blue-500 hover:bg-blue-700 disabled:bg-neutral-500 text-neutral-50 px-3 py-2 font-bold rounded-box"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}