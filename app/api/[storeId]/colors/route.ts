import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		if (!params.storeId) {
			return new NextResponse("Color ID is not provided.", { status: 400 });
		}

		const color = await prismadb.color.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(color);
	} catch (error) {
		console.log("[GET_COLOR]: ", error);
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

		const color = await prismadb.color.create({
			data: {
				name,
				value,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(color);
	} catch (error) {
		console.log("[POST COLOR]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
