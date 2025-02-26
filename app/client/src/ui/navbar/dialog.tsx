import { useState, useEffect, useRef } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import useLogout from '../../hooks/useLogout';

export default function Dialog() {
	const [isOpen, setIsOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const { logout, logoutFromAllDevices } = useLogout();

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
		<div onClick={(e) => e.preventDefault()} className="relative">
			<button
				ref={buttonRef}
				onClick={toggleDialog}
				className="flex items-center" // fix alignment issue with toggle theme button
			>
				<IoLogOutOutline className="w-8 h-8" />
			</button>

			<dialog
				ref={dialogRef}
				className="absolute mx-0 top-0 -translate-y-[calc(100%+0.5rem)] z-50 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-lg shadow-lg overflow-hidden"
			>
				<ul className="text-nowrap font-semibold">
					<li>
						<button
							onClick={logoutFromAllDevices}
							className="w-full py-4 px-6 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
						>
							Log out from all devices
						</button>
					</li>
					<li>
						<button
							onClick={logout}
							className="w-full py-4 px-6 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
						>
							Log out
						</button>
					</li>
				</ul>
			</dialog>
		</div>
	);
}
