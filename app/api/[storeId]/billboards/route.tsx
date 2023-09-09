import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		const billboardData = await prismadb.billboard.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json({
			message: "Billboards fetched successfully",
			billboardId: billboardData,
		});
	} catch (error) {
		console.log("[GET BILLBOARDS]: ", error);
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
		const { label, imageUrl } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!label) {
			return new NextResponse("Label not provided.", { status: 400 });
		}

		if (!imageUrl) {
			return new NextResponse("Image URL not provided.", { status: 400 });
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

		const billboardData = await prismadb.billboard.create({
			data: {
				label,
				imageUrl,
				storeId: params.storeId,
			},
		});

		return NextResponse.json({
			message: "Billboard created",
			billboardId: billboardData,
		});
	} catch (error) {
		console.log("[POST BILLBOARDS]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
