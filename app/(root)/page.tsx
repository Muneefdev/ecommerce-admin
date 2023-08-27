import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
	return (
		<main>
			<UserButton afterSignOutUrl="/" />
		</main>
	);
}
