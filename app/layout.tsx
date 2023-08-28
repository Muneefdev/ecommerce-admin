import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import ModalProvider from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

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
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<nav className="text-center text-6xl p-8 mb-8 bg-slate-600 text-white drop-shadow-md">
						Main Navbar
					</nav>
					<ModalProvider />
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
