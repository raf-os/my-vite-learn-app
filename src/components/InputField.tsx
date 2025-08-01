import { useImperativeHandle, useRef, forwardRef } from "react";

interface IInputFieldProps extends React.ComponentPropsWithoutRef<'input'> {
    ref: React.RefObject<unknown>;
}

export function InputField({
    name,
    ref,
    ...rest
}: IInputFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return inputRef.current?.value;
            }
        }
    });

    return (
        <input
            ref={inputRef}
            {...rest}
        />
    )
}