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

		const size = await prismadb.size.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log("[GET SIZE]: ", error);
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

		const size = await prismadb.size.create({
			data: {
				name,
				value,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log("[POST SIZE]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
