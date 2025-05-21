import { useEffect, useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

export default function Modal({
	isOpen,
	setIsOpen,
	children,
}: {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	children: React.ReactNode;
}) {
	const ref = useRef<HTMLDialogElement | null>(null);

	useEffect(() => {
		if (!ref.current) return;
		isOpen ? ref.current.showModal() : ref.current.close();
	}, [isOpen]);

	return (
		<dialog
			ref={ref}
			onClick={(e) => {
				if (e.currentTarget === e.target) {
					setIsOpen((prev) => !prev);
				}
			}}
			className="p-0 w-fit rounded-lg backdrop:bg-black backdrop:opacity-25 bg-white dark:bg-slate-800 dark:text-white"
		>
			<div className="p-4">
				<button onClick={() => setIsOpen((prev) => !prev)}>
					<IoCloseOutline className="w-6 h-6" />
				</button>
				{children}
			</div>
		</dialog>
	);
}
