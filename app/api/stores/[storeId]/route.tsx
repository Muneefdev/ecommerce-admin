import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type RequestProps = {
	params: {
		storeId: string;
	};
};

export async function PATCH(req: Request, { params }: RequestProps) {
	try {
		const { userId } = auth();
		const updatedStore = await req.json();

		const { name } = updatedStore;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!name) {
			return new NextResponse("Name not provided.", { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse("Store ID is required.", { status: 400 });
		}

		const store = await prismadb.store.update({
			where: {
				id: params.storeId,
				userId,
			},
			data: {
				name,
			},
		});

		return NextResponse.json({
			message: "Store updated",
			store: store,
		});
	} catch (error) {
		console.log(`[STORE_PATCH] ${error}`);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: RequestProps) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!params.storeId) {
			return new NextResponse("Store ID is required.", { status: 400 });
		}

		const store = await prismadb.store.delete({
			where: {
            id: params.storeId,
            userId,
			},
		});

		return NextResponse.json({
			message: "Store deleted",
			store: store,
		});
	} catch (error) {
		console.log(`[STORE_DELETE] ${error}`);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
