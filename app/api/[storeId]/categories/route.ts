import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		if (!params.storeId) {
			return new NextResponse("Store ID is not provided.", { status: 400 });
		}

		const categories = await prismadb.category.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json({
			message: "Categories fetched successfully",
			categories: categories,
		});
	} catch (error) {
		console.log("[GET CATEGORIES]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
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
			return new NextResponse("Billboard ID not provided.", { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse("Store ID is not provided.", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				userId,
				id: params.storeId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403 });
		}

		const category = await prismadb.category.create({
			data: {
				name,
				billboardId,
				storeId: params.storeId,
			},
		});

		return NextResponse.json({
			message: "Category created",
			category: category,
		});
	} catch (error) {
		console.log("[POST CATEGORIES]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
