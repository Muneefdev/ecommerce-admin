import { Metadata } from "next";
import prismadb from "@/lib/prismadb";
import { SizeColumn } from "./components/columns";
import { format } from "date-fns";
import SizesClient from "./components/client";

export const metadata: Metadata = {
	title: "Sizes",
	description: "Sizes",
};

export default async function SizesPage({
	params,
}: {
	params: { storeId: string };
}) {
	const sizes = await prismadb.size.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formattedSizes: SizeColumn[] = sizes.map((size) => {
		return {
			id: size.id,
			name: size.name,
			value: size.value,
			createdAt: format(size.createdAt, "dd/MM/yyyy"),
		};
	});

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SizesClient data={formattedSizes} />
			</div>
		</div>
	);
}
