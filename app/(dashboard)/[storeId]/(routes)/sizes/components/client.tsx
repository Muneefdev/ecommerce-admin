"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

type SizesClientProps = {
	data: SizeColumn[];
};

export default function SizesClient({ data }: SizesClientProps) {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Sizes (${data.length})`}
					description="Manage Sizes for you store"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
					<Plus className="mr-2 h-4 w-4" />
					Add New
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			{/* <Heading title="API Calls" description="Api calls for Sizes" />
			<Separator />
			<ApiList entityIdName="sizeId" entityName="sizes" /> */}
		</>
	);
}
