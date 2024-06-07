"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

interface ModalProps {
	title: string;
	description: string;
	open: boolean;
	onClose?: () => void;
	children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, description, open, onClose, children }) => {
	const onChange = (open: boolean) => {
		if (!open) {
			onClose?.();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<div>{children}</div>
			</DialogContent>
		</Dialog>
	);
};
