"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

type BillboardClientProps = {
	data: BillboardColumn[];
};

export default function BillboardClient({ data }: BillboardClientProps) {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Billboards (${data.length})`}
					description="Manage billboards for you store"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/billboards/new`)}
				>
					<Plus className="mr-2 h-4 w-4" />
					Add New
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="label" columns={columns} data={data} />
			<Heading title="API Calls" description="Api calls for Billboards" />
			<Separator />
			<ApiList entityIdName="billboardId" entityName="billboards" />
		</>
	);
}
