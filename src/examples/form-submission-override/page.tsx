import { ComplexForm } from "@/components/ComplexForm";
import { ExpositionBlock } from "@/components/ExpositionBlock";
import { Input } from "@/components/Forms";
import { cn } from "@lib/utils";

export default function FormBehaviorOverridePage() {
	return (
		<div className="flex flex-col gap-4 w-full px-4 md:px-0 md:w-[800px]">
			<ExpositionBlock.Root>
				<ExpositionBlock.Header>
					Form submission behavior override
				</ExpositionBlock.Header>

				<ExpositionBlock.Content className="apply-code-blocks">
					<p>
						Overrides default behavior, allowing you to apppend metadata to each input field, by simply passing the results of the <span className="text-emphasis-code">register</span> function to the component.
						The results will then, be gathered once the submit button is pressed, but instead of an object with key:value pairs, you have something like this:
					</p>

					<pre>
						{
							'{\n'+
							'  name: string // Form element\'s name\n' +
							'  value: string // The actual value of said element\n' +
							'  ...key: any // Rest of the data can then be appended as key:value pairs\n' +
							'}'
						}
					</pre>

					<p>
						The same thing can be done with react-hook-forms with a little bit of setup, and this is probably a bit of over-engineering on my part.
					</p>

					<p>
						Outputs results to the browser's console once submitted.
					</p>
				</ExpositionBlock.Content>
			</ExpositionBlock.Root>
			<ComplexForm>
				<div className="flex flex-col gap-3">
					<Input name="item1" label="First Item" placeholder="default text" />
					<Input name="item2" label="Second Item" />
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
				"button-blue",
				className
			)}
		>
			{children}
		</button>
	)
}
