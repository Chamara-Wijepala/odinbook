import { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';

export default function Dialog() {
	const [isOpen, setIsOpen] = useState(false);
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	function toggleDialog() {
		if (!dialogRef.current) return;

		if (dialogRef.current.hasAttribute('open')) {
			dialogRef.current.close();
			setIsOpen(false);
		} else {
			dialogRef.current.show();
			setIsOpen(true);
		}
	}

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
		if (isOpen) {
			window.addEventListener('mousedown', closeDialog);
			window.addEventListener('keydown', closeDialog);
		}

		return () => {
			if (isOpen) {
				window.removeEventListener('mousedown', closeDialog);
				window.removeEventListener('keydown', closeDialog);
			}
		};
	}, [isOpen]);

	return (
		<div className="relative">
			<button
				ref={buttonRef}
				onClick={toggleDialog}
				className="w-6 h-6 flex items-center justify-center"
			>
				<BsThreeDotsVertical />
			</button>

			<dialog
				ref={dialogRef}
				// On -translate-x-[calc(100%-20px)] the 20px is the width of the button
				// up top. It's used to align the dialog's right side with the button.
				className="absolute -translate-x-[calc(100%-20px)] bg-slate-100 dark:bg-slate-800 dark:text-white rounded-lg overflow-hidden shadow-lg"
			>
				<ul className="font-semibold">
					<li>
						<button className="py-4 px-6 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
							<FaRegEdit />
							<span>Update</span>
						</button>
					</li>
				</ul>
			</dialog>
		</div>
	);
}
