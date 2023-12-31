"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { HTMLAttributes } from "react";

export default function MainNav({
	className,
	...props
}: HTMLAttributes<HTMLElement>) {
	const params = useParams();
	const pathName = usePathname();

	const routes = [
		{
			href: `/${params.storeId}`,
			label: "Dashboard",
			isActive: pathName === `/${params.storeId}`,
		},
		{
			href: `/${params.storeId}/billboards`,
			label: "Billboards",
			isActive: pathName === `/${params.storeId}/billboards`,
		},
		{
			href: `/${params.storeId}/categories`,
			label: "Categories",
			isActive: pathName === `/${params.storeId}/categories`,
		},
		{
			href: `/${params.storeId}/sizes`,
			label: "Sizes",
			isActive: pathName === `/${params.storeId}/sizes`,
		},
		{
			href: `/${params.storeId}/colors`,
			label: "Colors",
			isActive: pathName === `/${params.storeId}/colors`,
		},
		{
			href: `/${params.storeId}/products`,
			label: "Products",
			isActive: pathName === `/${params.storeId}/products`,
		},
		{
			href: `/${params.storeId}/orders`,
			label: "Orders",
			isActive: pathName === `/${params.storeId}/orders`,
		},
		{
			href: `/${params.storeId}/settings`,
			label: "Settings",
			isActive: pathName === `/${params.storeId}/settings`,
		},
	];

	return (
		<div
			className={cn("flex items-center space-x-4 lg:space-x-6", className)}
		>
			{routes.map((route) => (
				<Link
					href={route.href}
					key={route.href}
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						route.isActive
							? "text-black dark:text-white"
							: "text-muted-foreground"
					)}
				>
					{route.label}
				</Link>
			))}
		</div>
	);
}
