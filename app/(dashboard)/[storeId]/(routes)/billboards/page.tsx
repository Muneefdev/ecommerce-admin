import { Metadata } from "next";
import BillboardClient from "./components/client";

export const metadata: Metadata = {
	title: "Billboards",
	description: "Store billboards",
};

export default function BillboardsPage() {
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<BillboardClient />
			</div>
		</div>
	);
}
