import { ComplexForm, TestInputField } from "./components/ComplexForm"

export default function Home() {
	return (
		<div>
			<ComplexForm>
				<TestInputField name="item1" label="First Item" />
				<TestInputField name="item2" label="Second Item" />
				<button type="submit">submit</button>
			</ComplexForm>
		</div>
	)
}