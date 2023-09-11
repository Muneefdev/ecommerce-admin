"use client";

import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
	name: z.string().min(4, { message: "Must be at least 4 characters long." }),
	billboardId: z
		.string()
		.min(4, { message: "Must be at least 4 characters long." }),
});

type formType = z.infer<typeof formSchema>;

type CategoryFormProps = {
	initialData: Category | null;
	billboards: Billboard[];
};

export default function CategoryForm({
	initialData,
	billboards,
}: CategoryFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const params = useParams();

	const title = initialData ? "Edit Category" : "Create Category";
	const description = initialData
		? "Edit your Category."
		: "Add new Category.";
	const toastMessage = initialData ? "Category updated." : "Category created.";
	const action = initialData ? "Confirm changes" : "Create Category";

	const form = useForm<formType>({
		defaultValues: initialData || {
			name: "",
			billboardId: "",
		},
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (data: formType) => {
		try {
			setIsLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/categories/${params.categoryId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/categories`, data);
			}
			router.refresh();
			toast.success(toastMessage);
			router.push(`/${params.storeId}/categories`);
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(
				`/api/${params.storeId}/categories/${params.categoryId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/categories`);
			toast.success("categories deleted");
		} catch (error) {
			toast.error(
				"Make sure you removed all products using this category ."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={isOpen}
				isLoading={isLoading}
				onClose={() => setIsOpen(false)}
				onConfirm={onDelete}
			/>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						variant="destructive"
						onClick={() => setIsOpen(true)}
						size="icon"
						disabled={isLoading}
					>
						<Trash className="w-4 h-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											{...field}
											placeholder="Category name"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="billboardId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Billboard</FormLabel>
									<Select
										disabled={isLoading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a billboard"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{billboards.map((billboard) => (
												<SelectItem
													key={billboard.id}
													value={billboard.id}
												>
													{billboard.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						disabled={isLoading}
						className="ml-auto"
						type="submit"
						size="sm"
					>
						{isLoading ? "Saving..." : action}
					</Button>
				</form>
			</Form>
			<Separator />
		</>
	);
}
