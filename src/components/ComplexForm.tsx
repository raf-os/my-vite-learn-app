import { useRef, createContext, useContext, useEffect, useImperativeHandle } from "react";
import { cn } from "@lib/utils";

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

export function Label({
    children,
    className,
    ...rest
}: React.ComponentPropsWithRef<'label'>) {
    return (
        <label
        className={cn(
            "text-sm font-bold",
            className
        )}
            {...rest}
        >
            {children}
        </label>
    )
}

export function TestInputField({
    label="No Label",
    name,
    className
}: {
    label?: string,
    name: string,
    className?: string,
}) {
    const {register} = useFormElement();
    return (
        <div
            className="flex flex-col gap-0.5"
        >
            {label && (
                <Label>
                    {label}
                </Label>
            )}
            <input
                {...register({
                    name: name,
                    metadata: {
                        label: label
                    }
                })}
                className={cn(
                    "border border-gray-700 text-gray-500 focus:text-neutral-900 outline-0 ring-offset-1 ring-blue-600 focus:ring-3 rounded-md px-1.5 py-1",
                    className
                )}
            />
        </div>
    )
}
