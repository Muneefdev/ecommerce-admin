"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type AlertModalProps = {
	isOpen: boolean;
	onConfirm: () => void;
	onClose: () => void;
	isLoading: boolean;
};

export default function AlertModal({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
}: AlertModalProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<Modal
			title="Are you sure to delete?"
			description="This action cannot be undone."
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="pt-6 space-x-2 flex items-center justify-end w-full">
				<Button
					disabled={isLoading}
					onClick={onConfirm}
					variant="destructive"
				>
					{isLoading ? "Deleting..." : "Delete"}
				</Button>
				<Button variant="outline" disabled={isLoading} onClick={onClose}>
					Cancel
				</Button>
			</div>
		</Modal>
	);
}
