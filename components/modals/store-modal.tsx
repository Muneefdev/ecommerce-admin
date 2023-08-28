"use client";

import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

export default function StoreModal() {
	const isOpen = useStoreModal((state) => state.isOpen);
	const onClose = useStoreModal((state) => state.onClose);

	return (
		<Modal
			title="Create store"
			description="Add new store to manage products and categories"
			isOpen={isOpen}
			onClose={onClose}
		>
			Future Create Store Form
		</Modal>
	);
}
