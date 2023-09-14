import { Metadata } from "next";
import prismadb from "@/lib/prismadb";
import { ColorColumn } from "./components/columns";
import { format } from "date-fns";
import SizesClient from "./components/client";
import ColorsClient from "./components/client";

export const metadata: Metadata = {
	title: "Colors",
	description: "Colors",
};

export default async function ColorsPage({
	params,
}: {
	params: { storeId: string };
}) {
	const colors = await prismadb.color.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formattedColors: ColorColumn[] = colors.map((color) => {
		return {
			id: color.id,
			name: color.name,
			value: color.value,
			createdAt: format(color.createdAt, "dd/MM/yyyy"),
		};
	});

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ColorsClient data={formattedColors} />
			</div>
		</div>
	);
}
