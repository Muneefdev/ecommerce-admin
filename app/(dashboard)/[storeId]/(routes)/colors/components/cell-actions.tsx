"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";
import { ColorColumn } from "./columns";

type CellActionProps = {
	data: ColorColumn;
};

export function CellAction({ data }: CellActionProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const params = useParams();

	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id);
		toast.success("Copied to clipboard");
	};

	const onUpdate = (id: string) => {
		router.push(`/${params.storeId}/colors/${id}`);
	};

	const onDelete = async (id: string) => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/${params.storeId}/colors/${id}`);
			router.refresh();
			toast.success("Color deleted");
		} catch (error) {
			toast.error("Make sure you removed all products using this color.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={() => onDelete(data.id)}
				isLoading={isLoading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="h-8 w-8 p-0" variant="ghost">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => onCopy(data.id)}>
						<Copy className="h-4 w-4 mr-2" />
						Copy Id
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => onUpdate(data.id)}>
						<Edit className="h-4 w-4 mr-2" />
						Update
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className="h-4 w-4 mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
