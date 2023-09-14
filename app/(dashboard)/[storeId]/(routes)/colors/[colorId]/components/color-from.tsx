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
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
	name: z.string().min(3, { message: "Must be at least 3 characters long." }),
	value: z
		.string()
		.min(4)
		.regex(/^#/, { message: "Must start with # valid hex code." }),
});

type formType = z.infer<typeof formSchema>;

type ColorFormProps = {
	initialData: Color | null;
};

export default function ColorForm({ initialData }: ColorFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const params = useParams();

	const title = initialData ? "Edit Color" : "Create Color";
	const description = initialData ? "Edit a Color." : "Add new Color.";
	const toastMessage = initialData ? "Color updated." : "Color created.";
	const action = initialData ? "Confirm changes" : "Create Color";

	const form = useForm<formType>({
		defaultValues: initialData || {
			name: "",
			value: "",
		},
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (data: formType) => {
		try {
			setIsLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/colors/${params.colorId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/colors`, data);
			}
			router.refresh();
			toast.success(toastMessage);
			router.push(`/${params.storeId}/colors`);
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
			router.refresh();
			router.push(`/${params.storeId}/colors`);
			toast.success("color deleted");
		} catch (error) {
			toast.error("Make sure you removed all product using this color.");
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
											placeholder="Color name"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<FormControl>
										<div className="flex items-center gap-x-4">
											<Input
												disabled={isLoading}
												{...field}
												placeholder="Color value"
											/>
											<div
												className="border p-4 rounded"
												style={{ backgroundColor: field.value }}
											/>
										</div>
									</FormControl>
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
