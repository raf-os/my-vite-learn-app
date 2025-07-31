export function ErrorBoundary({error}: {error: any}) {
	console.log(error);
	return (
		<p>Meteor happen</p>
	)
}

export default function App() {
	return (
		<p className="text-2xl">
			test
		</p>
	)
}