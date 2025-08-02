import { useRef, createContext, useContext, useEffect, useImperativeHandle } from "react";

interface IFormContext {
    registerRef: (ref: BaseFormElementRef) => void;
    unRegisterRef: (ref: BaseFormElementRef) => void;
}

type BaseFormElementRef = React.RefObject<{
    getValue: () => any;
}>

const FormContext = createContext<IFormContext>({
    registerRef() {},
    unRegisterRef() {}
});

export function ComplexForm({children, className}: React.ComponentPropsWithRef<'form'>) {
    // Probably some serious over-engineering going on here
    const componentList = useRef<BaseFormElementRef[]>([]);

    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submitting");

        componentList.current?.map(c => {
            console.log(c.current.getValue());
        });
    }

    const appendRefToList = (ref: BaseFormElementRef) => {
        if (!ref.current) return;
        componentList.current = [
            ...componentList.current,
            ref
        ];
    }

    const removeRefFromList = (ref: BaseFormElementRef) => {
        if (ref) {
            componentList.current = componentList.current.filter(v => {
                return ref.current!=v.current;
            });
        }
    }

    const myFormContext: IFormContext = {
        registerRef(ref) {
            appendRefToList(ref);
        },
        unRegisterRef(ref) {
            removeRefFromList(ref);
        }
    }

    return (
        <form className={className} onSubmit={onSubmit}>
            <FormContext.Provider value={myFormContext}>
                {children}
            </FormContext.Provider>
        </form>
    )
}

export function useFormElement() {
    const ref = useRef<any>(null); // Using "any" type as a temporary hack
    const tempFieldMetadata = useRef<Record<string, any>>({});
    const inputRef = useRef<HTMLInputElement>(null);
    const formContext = useContext(FormContext);

    useImperativeHandle(ref, () => {
        return {
            getValue() {
                const curInput = inputRef.current;
                const fieldMetadata = tempFieldMetadata.current;
                return curInput?
                    {
                        name: curInput.name,
                        value: curInput.value,
                        ...fieldMetadata
                    } : null;
            },
        }
    });

    useEffect(() => {
        if (inputRef.current) {
            formContext.registerRef(ref);
        }
        return () => {
            formContext.unRegisterRef(ref);
        }
    }, []);

    /**
     * Registers field with the form controller and returns properties to be given to the input DOM element.
     * @param name Field name, same as the html property
     * @param metadata Key:Value pair object of miscellaneous metadata
     */
    const register = ({
        name,
        metadata
    }: {
        name: string,
        metadata?: Record<string, any>
    }) => {
        if (metadata) {
            tempFieldMetadata.current = metadata;
        }
        return {
            ref: inputRef,
            name: name
        }
    }

    return {
        register,
    }
}

