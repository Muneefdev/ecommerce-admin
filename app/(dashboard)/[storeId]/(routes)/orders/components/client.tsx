"use client";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

type OrderClientProps = {
	data: OrderColumn[];
};

export default function OrderClient({ data }: OrderClientProps) {
	console.log("Order", data);
	return (
		<>
			<Heading
				title={`Orders (${data.length})`}
				description="Manage orders for you store"
			/>
			<Separator />
			<DataTable searchKey="product" columns={columns} data={data} />
		</>
	);
}
