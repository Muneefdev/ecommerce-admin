import prismadb from "@/lib/prismadb";

type DashboardPageProps = {
	params: {
		storeId: string;
	};
};

export default async function DashboardPage({ params }: DashboardPageProps) {
	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
		},
	});

	return (
		<>
			<div>Active store {store?.name}</div>
		</>
	);
}
