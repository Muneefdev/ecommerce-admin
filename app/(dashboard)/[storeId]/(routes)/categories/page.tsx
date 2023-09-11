import { Metadata } from "next";
import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "./components/columns";
import { format } from "date-fns";
import CategoryClient from "./components/client";

export const metadata: Metadata = {
	title: "Categories",
	description: "Categories for your store",
};

export default async function CategoriesPage({
	params,
}: {
	params: { storeId: string };
}) {
	const categories = await prismadb.category.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			billboard: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formattedCategories: CategoryColumn[] = categories.map((category) => {
		return {
			id: category.id,
			name: category.name,
			billboardLabel: category.billboard.label,
			createdAt: format(category.createdAt, "dd/MM/yyyy"),
		};
	});

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<CategoryClient data={formattedCategories} />
			</div>
		</div>
	);
}
