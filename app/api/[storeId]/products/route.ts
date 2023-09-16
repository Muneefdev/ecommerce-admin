import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get("categoryId") || undefined;
		const colorId = searchParams.get("colorId") || undefined;
		const sizeId = searchParams.get("sizeId") || undefined;
		const isFeatured = searchParams.get("isFeatured");

		if (!params.storeId) {
			return new NextResponse("Store ID is not provided.", { status: 400 });
		}

		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
				colorId,
				sizeId,
				isFeatured: isFeatured ? true : undefined,
				isArchived: false,
			},
			include: {
				images: true,
				category: true,
				color: true,
				size: true,
			},
			orderBy: {
				createdAt: "desc",
			}
		});

		return NextResponse.json({
			message: "Products fetched successfully",
			products: products,
		});
	} catch (error) {
		console.log("[GET_PRODUCT]: ", error);
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
		const {
			name,
			price,
			categoryId,
			colorId,
			sizeId,
			images,
			isFeatured,
			isArchived,
		} = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!name) {
			return new NextResponse("Name not provided.", { status: 400 });
		}

		if (!price) {
			return new NextResponse("Price not provided.", { status: 400 });
		}

		if (!categoryId) {
			return new NextResponse("Category ID not provided.", { status: 400 });
		}

		if (!colorId) {
			return new NextResponse("Color ID not provided.", { status: 400 });
		}

		if (!sizeId) {
			return new NextResponse("Size ID not provided.", { status: 400 });
		}

		if (!images || !images.length) {
			return new NextResponse("Images not provided.", { status: 400 });
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

		const product = await prismadb.product.create({
			data: {
				storeId: params.storeId,
				name,
				price,
				categoryId,
				colorId,
				sizeId,
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
				isFeatured,
				isArchived,
			},
		});

		return NextResponse.json({
			message: "Product created",
			product: product,
		});
	} catch (error) {
		console.log("[POST_PRODUCT]: ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
