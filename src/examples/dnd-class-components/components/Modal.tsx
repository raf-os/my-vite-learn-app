import { useEffect, useState, useRef } from "react";
import { Observable } from "../classes/Observable";
import { X as XIcon } from "lucide-react";

export type TModalObservable = {
    data: (props: TModalArgs) => React.ReactNode,
    metadata?: TModalMetadata,
}

type TModalArgs = {
    requestClose: () => void,
    isTransitioning: boolean,
}

type TModalMetadata = {
    title?: string,
    preventOutsideClick?: boolean,
    hasCloseButton?: boolean,
    [key: string]: any,
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
    const [ messageJsx, setMessageJsx ] = useState<((props: TModalArgs) => React.ReactNode) | null>(() => null);
    const [ messageMetadata, setMessageMetadata ] = useState<TModalMetadata>({});
    const elRef = useRef<HTMLDivElement>(null);

    let style = { display: "none" } as React.CSSProperties;

    const onModalOpenRequest = (payload: TModalObservable) => {
        setMessageJsx(() => payload.data);
        setMessageMetadata(payload.metadata || {});
        setIsShowing(true);
        toggle(true);
    }

    const onModalCloseRequest = () => {
        setIsShowing(false);
    }

    const onTransitionEnd = () => {
        if (!isShowing) {
            toggle(false);
        }
    }

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!messageMetadata.preventOutsideClick) {
            if (e.target === elRef.current && isShowing) {
                onModalCloseRequest();
            }
        }
    }

    const toggle = (t: boolean) => { // No way that I have to do this, see if there's a better way
        if (elRef.current) {
            elRef.current.style = `visibility: ${t ? `visible` : `collapse`}`;
        }
    }

    useEffect(() => {
        return ModalSingleton.attach(onModalOpenRequest);
    }, []);

    useEffect(() => {
        if (elRef.current) {
            elRef.current.addEventListener("transitionend", onTransitionEnd);

            return () => elRef.current?.removeEventListener("transitionend", onTransitionEnd);
        }
    }, [isShowing]);

    return (
        <div
            className="modal-component"
            style={style}
            data-show={ isShowing ? "true" : "false" }
            ref={elRef}
            onClick={handleOutsideClick}
        >
            <div
                className="rounded-lg items-center max-w-[600px]"
                style={{
                        translate: isShowing ? "0 0" : "0 32px",
                        opacity: isShowing ? "100%" : "0",
                        transition: "translate 0.2s ease, opacity 0.2s ease",
                    }}
            >
                <div
                    className="flex items-center w-full rounded-t-lg bg-slate-700 p-2"
                >
                    <div
                        className="text-neutral-50 font-semibold grow-1 shrink-1 px-1"
                        data-slot="modal-title"
                    >
                        { messageMetadata.title || "Message" }
                    </div>
                    
                    { messageMetadata.hasCloseButton && (<div
                        className="closeButton"
                        onClick={onModalCloseRequest}
                    >
                        <XIcon />
                    </div>)}
                </div>

                <div
                    className="flex flex-col gap-2 items-center px-4 py-3 rounded-b-lg border-4 border-t-0 bg-neutral-50 border-slate-700"
                >
                    { messageJsx?.({requestClose: onModalCloseRequest, isTransitioning: !isShowing}) }
                </div>
            </div>
        </div>
    );
}