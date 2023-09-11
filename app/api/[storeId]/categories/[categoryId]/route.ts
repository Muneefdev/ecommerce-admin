import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { categoryId: string } }
) {
	try {
		if (!params.categoryId) {
			return new NextResponse("Billboard ID is not provided.", {
				status: 400,
			});
		}

		const category = await prismadb.category.findUnique({
			where: {
				id: params.categoryId,
			},
		});

		return NextResponse.json({
			message: "Category fetched successfully",
			category: category,
		});
	} catch (error) {
		console.log("[GET_CATEGORY]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { name, billboardId } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!name) {
			return new NextResponse("Name not provided.", { status: 400 });
		}

		if (!billboardId) {
			return new NextResponse("Billboard not provided.", { status: 400 });
		}

		if (!params.categoryId) {
			return new NextResponse("CategoryId ID is not provided.", {
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

		const category = await prismadb.category.update({
			where: {
				id: params.categoryId,
			},
			data: {
				name,
				billboardId,
			},
		});

		return NextResponse.json({
			message: "Category updated",
			category: category,
		});
	} catch (error) {
		console.log("[PATCH_CATEGORY]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { categoryId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!params.categoryId) {
			return new NextResponse("Category ID is not provided.", {
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

		const category = await prismadb.category.delete({
			where: {
				id: params.categoryId,
			},
		});

		return NextResponse.json({
			message: "Category deleted",
			category: category,
		});
	} catch (error) {
		console.log("[DELETE_CATEGORY]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
