"use client";

import {
	Dialog,
	DialogDescription,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type ModalProps = {
	title: String;
	description: String;
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
};

export default function Modal({
	title,
	description,
	isOpen,
	onClose,
	children,
}: ModalProps) {
	const onChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<div>{children}</div>
			</DialogContent>
		</Dialog>
	);
}
