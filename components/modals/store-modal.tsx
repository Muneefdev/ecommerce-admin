"use client";

import { useState } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import Modal from "@/components/ui/modal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	name: z.string().min(1),
});

type FormType = z.infer<typeof formSchema>;

export default function StoreModal() {
	const isOpen = useStoreModal((state) => state.isOpen);
	const onClose = useStoreModal((state) => state.onClose);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const form = useForm<FormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (data: FormType) => {
		try {
			setIsSubmitting(true);
			const res = await axios.post("/api/stores", data);
			toast.success("Store created");
			router.push(`/${res.data.id}`);
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsSubmitting(false);
			onClose();
		}
	};

	return (
		<Modal
			title="Create store"
			description="Add a new store to manage products and categories."
			isOpen={isOpen}
			onClose={onClose}
		>
			<div>
				<div className="space-y-4 py-2 pb-4">
					<div className="space-y-2">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													disabled={isSubmitting}
													placeholder="E-Commerce"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="pt-6 space-x-2 flex items-center justify-end w-full">
									<Button disabled={isSubmitting} type="submit">
										{isSubmitting ? "Creating..." : "Create"}
									</Button>
									<Button
										type="button"
										disabled={isSubmitting}
										variant="outline"
										onClick={onClose}
									>
										Cancel
									</Button>
								</div>
							</form>
						</Form>
					</div> 
				</div>
			</div>
		</Modal>
	);
}
