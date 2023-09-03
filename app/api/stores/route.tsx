import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const store = await req.json();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!store.name) {
			return new NextResponse("Name not provided.", { status: 400 });
		}

		const storeData = await prismadb.store.create({
			data: {
				name: store.name,
				userId,
			},
		});

		return NextResponse.json({
			message: "Store created",
			storeId: storeData.id,
		});
	} catch (error) {
		console.log(`[POST STORES]: `, error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
