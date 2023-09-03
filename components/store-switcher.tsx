"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Store } from "@prisma/client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandInput,
	CommandSeparator,
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
	items: Store[];
}

export default function StoreSwitcher({
	className,
	items = [],
}: StoreSwitcherProps) {
	const storeModal = useStoreModal();
	const params = useParams();
	const router = useRouter();

	const formattedItems = items.map((item) => ({
		id: item.id,
		label: item.name,
	}));

	const activeStore = formattedItems.find(
		(item) => item.id === params.storeId
	);

	const [isOpen, setIsOpen] = useState(false);

	const onStoreSelect = (store: { id: string; label: string }) => {
		setIsOpen(false);
		router.push(`/${store.id}`);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					role="combobox"
					aria-expanded={isOpen}
					aria-label="Store Switcher"
					className={cn("w-[200px] justify-between", className)}
				>
					<StoreIcon className="mr-2 h-4 w-4" />
					{activeStore?.label ?? "Select a store"}
					<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search store..." />
						<CommandEmpty>No store found.</CommandEmpty>
						<CommandGroup heading="Stores">
							{formattedItems.map((store) => (
								<CommandItem
									key={store.id}
									onSelect={() => onStoreSelect(store)}
									className="text-sm"
								>
									<StoreIcon className="mr-2 h-4 w-4" />
									{store.label}
									<Check
										className={cn(
											activeStore?.id === store.id
												? "opacity-100"
												: "opacity-0",
											"ml-auto h-4 w-4 "
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
					<CommandSeparator />
					<CommandList>
						<CommandGroup>
							<CommandItem
								onSelect={() => {
									setIsOpen(false);
									storeModal.onOpen();
								}}
							>
								<Plus className="mr-2 h-5 w-5" />
								Create store
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
