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

export function ComplexForm({children}: {children?: React.ReactNode}) {
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
        <form onSubmit={onSubmit}>
            <FormContext.Provider value={myFormContext}>
                {children}
            </FormContext.Provider>
        </form>
    )
}

export function useFormElement() {
    const ref = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const formContext = useContext(FormContext);

    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return inputRef.current?.value;
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

    const register = ({name}: {name: string}) => {
        return {
            ref: inputRef,
            name: name
        }
    }

    return {
        register,
    }
}

export function TestInputField({
    label="No Label",
    name
}: {
    label?: string,
    name: string
}) {
    const {register} = useFormElement();
    return (
        <div>
            {label && (<label>{label}</label>)}
            <input {...register({name: name})} className="border" />
        </div>
    )
}
