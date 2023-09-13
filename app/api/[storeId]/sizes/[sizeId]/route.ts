import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { sizeId: string } }
) {
	try {
		if (!params.sizeId) {
			return new NextResponse("Size ID is not provided.", {
				status: 400,
			});
		}

		const size = await prismadb.size.findUnique({
			where: {
				id: params.sizeId,
			},
		});

		return NextResponse.json({
			message: "Sizes fetched successfully",
			size: size,
		});
	} catch (error) {
		console.log("[GET_SIZE]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; sizeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { name, value } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!name) {
			return new NextResponse("Name not provided.", { status: 400 });
		}

		if (!value) {
			return new NextResponse("Value not provided.", { status: 400 });
		}

		if (!params.sizeId) {
			return new NextResponse("Size ID is not provided.", {
				status: 400,
			});
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403 });
		}

		const size = await prismadb.size.update({
			where: {
				id: params.sizeId,
			},
			data: {
				name,
				value,
			},
		});

		return NextResponse.json({
			message: "Size updated",
			size: size,
		});
	} catch (error) {
		console.log("[PATCH_SIZE]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { sizeId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!params.sizeId) {
			return new NextResponse("Size ID is not provided.", {
				status: 400,
			});
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403 });
		}

		const size = await prismadb.size.delete({
			where: {
				id: params.sizeId,
			},
		});

		return NextResponse.json({
			message: "Size deleted",
			size: size,
		});
	} catch (error) {
		console.log("[DELETE_SIZE: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
