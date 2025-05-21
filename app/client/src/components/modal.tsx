import { useEffect, useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

export default function Modal({
	isOpen,
	children,
}: {
	isOpen: boolean;
	children: React.ReactNode;
}) {
	const ref = useRef<HTMLDialogElement | null>(null);

	function toggleModal() {
		if (!ref.current) return;
		isOpen ? ref.current.showModal() : ref.current.close();
	}

	useEffect(() => {
		toggleModal();
	}, [isOpen]);

	return (
		<dialog
			ref={ref}
			onClick={(e) => {
				if (e.currentTarget === e.target) {
					toggleModal();
				}
			}}
			className="p-0 w-fit rounded-lg backdrop:bg-black backdrop:opacity-25 bg-white dark:bg-slate-800 dark:text-white"
		>
			<div className="p-4">
				<button onClick={toggleModal}>
					<IoCloseOutline className="w-6 h-6" />
				</button>
				{children}
			</div>
		</dialog>
	);
}
