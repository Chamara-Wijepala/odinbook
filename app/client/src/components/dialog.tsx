import { useEffect, useRef } from 'react';

type Props = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	buttonRef: React.MutableRefObject<HTMLButtonElement | null>;
	className: string;
	children: React.ReactNode;
};

export default function Dialog({
	isOpen,
	setIsOpen,
	buttonRef,
	className,
	children,
}: Props) {
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	// close dialog if user clicks outside dialog, the toggle dialog button, or
	// the escape key
	function closeDialog(e: MouseEvent | KeyboardEvent) {
		if (!dialogRef.current || !buttonRef.current) return;

		if (e instanceof KeyboardEvent && e.key === 'Escape') {
			dialogRef.current.close();
			setIsOpen(false);
			return;
		}

		const target = e.target as Node;
		if (
			!dialogRef.current.contains(target) &&
			!buttonRef.current.contains(target)
		) {
			dialogRef.current.close();
			setIsOpen(false);
		}
	}

	useEffect(() => {
		const controller = new AbortController();

		if (isOpen) {
			window.addEventListener('mousedown', closeDialog, {
				signal: controller.signal,
			});
			window.addEventListener('keydown', closeDialog, {
				signal: controller.signal,
			});
		}

		return () => {
			if (!isOpen) controller.abort();
		};
	}, [isOpen]);

	useEffect(() => {
		isOpen ? dialogRef.current?.show() : dialogRef.current?.close();
	}, [isOpen]);

	return (
		<dialog
			ref={dialogRef}
			className={`absolute z-50 overflow-hidden m-0 rounded-lg shadow-lg bg-slate-100 dark:bg-slate-800 dark:text-white ${className}`}
		>
			{children}
		</dialog>
	);
}
