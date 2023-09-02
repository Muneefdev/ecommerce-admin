"use client";

import { useEffect, useState } from "react";

import StoreModal from "@/components/modals/store-modal";

export default function ModalProvider() {
	const [isMounted, setIsMounted] = useState(false);

	// to avoid hydration mismatch between SSR and CSR
	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return <StoreModal />;
}
