import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Admin Dashboard",
	description: "Admin Dashboard",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="flex justify-center items-center h-full">
			{children}
		</main>
	);
}
