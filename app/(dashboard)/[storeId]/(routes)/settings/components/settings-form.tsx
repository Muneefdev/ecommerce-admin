"use client";

import AlertModal from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
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
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { z } from "zod";

type SettingsFormProps = {
	store: Store;
};

const formSchema = z.object({
	name: z
		.string()
		.min(4, { message: "Store name must be at least 4 characters long." }),
});

type formType = z.infer<typeof formSchema>;

export default function SettingsForm({ store }: SettingsFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const params = useParams();
	const origin = useOrigin();

	const form = useForm<formType>({
		defaultValues: store,
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (data: formType) => {
		try {
			setIsLoading(true);
			await axios.patch(`/api/stores/${params.storeId}`, data);
			router.refresh();
			toast.success("Store updated");
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/stores/${params.storeId}`);
			router.refresh();
			toast.success("Store deleted");
		} catch (error) {
			toast.error("Something went wrong");
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
				<Heading
					title="Settings"
					description="Manage your store settings."
				/>
				<Button
					variant="destructive"
					onClick={() => setIsOpen(true)}
					size="icon"
					disabled={isLoading}
				>
					<Trash className="w-4 h-4" />
				</Button>
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
									<FormLabel>Store Name</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											{...field}
											placeholder="Store Name"
										/>
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
						{isLoading ? "Saving..." : "Confirm changes"}
					</Button>
				</form>
			</Form>
			{/* <Separator />
			<ApiAlert
				title="NEXT_PUBLIC_API_URL"
				description={`${origin}/api/${params.storeId}`}
				variant="public"
			/> */}
		</>
	);
}
