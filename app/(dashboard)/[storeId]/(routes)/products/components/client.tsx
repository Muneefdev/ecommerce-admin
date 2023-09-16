"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

type ProductClientProps = {
	data: ProductColumn[];
};

export default function ProductClient({ data }: ProductClientProps) {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Products (${data.length})`}
					description="Manage products for you store"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/products/new`)}
				>
					<Plus className="mr-2 h-4 w-4" />
					Add New
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<Heading title="API Calls" description="Api calls for Products" />
			<Separator />
			<ApiList entityIdName="productId" entityName="products" />
		</>
	);
}
