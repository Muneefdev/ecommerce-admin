import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/billboard-form";

export default async function BillboardPage({
	params,
}: {
	params: { billboardId: string };
}) {
	const billboard = await prismadb.billboard.findUnique({
		where: {
			id: params.billboardId,
		},
	});

	// if (!billboard) {
	// 	return <div>Billboard not found</div>;
	// }

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<BillboardForm initialData={billboard}/>
			</div>
		</div>
	);
}
