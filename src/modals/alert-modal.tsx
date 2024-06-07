import BasicModal from "./basic-modal";

interface AlertModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
}

export default function AlertModal({ open, onClose, onConfirm, loading }: AlertModalProps) {
	return (
		<BasicModal
			title="¿Estás seguro?"
			description="Esta acción no se puede deshacer"
			open={open}
			onClose={onClose}
			loading={loading}
			onConfirm={onConfirm}
		/>
	);
}
