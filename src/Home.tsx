import { ComplexForm, TestInputField } from "./components/ComplexForm";
import { cn } from "@lib/utils";

export default function Home() {
	return (
		<div className="flex flex-col gap-4 w-full px-4 md:px-0 md:w-[800px]">
			<div>
				Form test
			</div>
			<ComplexForm>
				<div className="flex flex-col gap-3">
					<TestInputField name="item1" label="First Item" />
					<TestInputField name="item2" label="Second Item" />
					<Button type="submit">
						Submit
					</Button>
				</div>
			</ComplexForm>
		</div>
	)
}

function Button({
	className,
	type="button",
	children,
	...rest
}: React.ComponentPropsWithRef<'button'>) {
	return (
		<button
			{...rest}
			type={type}
			className={cn(
				"bg-blue-600 hover:bg-blue-800 text-md hover:cursor-pointer self-center px-3 py-1.5 rounded-md text-neutral-50 font-semibold",
				className
			)}
		>
			{children}
		</button>
	)
}
