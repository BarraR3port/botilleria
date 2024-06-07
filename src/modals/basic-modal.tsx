"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";

interface BasicModalProps {
	type?: "cancelAndConfirm";
	open: boolean;
	title: string;
	loading: boolean;
	description: string;
	onClose?: () => void;
	onConfirm?: () => void;
}

export default function BasicModal({ open, onClose, onConfirm, loading, title, description, type }: BasicModalProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) {
		return null;
	}

	return (
		<Modal title={title} description={description} open={open} onClose={onClose}>
			<div className="pt-6 space-x-2 flex items-center justify-end w-full">
				{type === "cancelAndConfirm" && (
					<Button variant="secondary" onClick={onClose} disabled={loading}>
						Cancelar
					</Button>
				)}
				<Button onClick={onConfirm} loading={loading}>
					Confirmar
				</Button>
			</div>
		</Modal>
	);
}
