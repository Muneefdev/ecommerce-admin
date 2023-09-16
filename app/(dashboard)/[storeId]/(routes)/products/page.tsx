import { Metadata } from "next";
import prismadb from "@/lib/prismadb";
import { ProductColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import ProductClient from "./components/client";

export const metadata: Metadata = {
	title: "Products",
	description: "Store Products",
};

export default async function ProductsPage({
	params,
}: {
	params: { storeId: string };
}) {
	const products = await prismadb.product.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
			color: true,
			size: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formattedProducts: ProductColumn[] = products.map((product) => {
		return {
			id: product.id,
			name: product.name,
			isFeatured: product.isFeatured,
			isArchived: product.isArchived,
			price: formatter.format(product.price.toNumber()),
			category: product.category.name,
			size: product.size.name,
			color: product.color.value,
			createdAt: format(product.createdAt, "dd/MM/yyyy"),
		};
	});

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductClient data={formattedProducts} />
			</div>
		</div>
	);
}
