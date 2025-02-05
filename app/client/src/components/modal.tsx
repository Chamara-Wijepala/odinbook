import { forwardRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

type Props = {
	children: React.ReactNode;
	toggleModal(): void;
};

const Modal = forwardRef<HTMLDialogElement, Props>(
	({ children, toggleModal }, ref) => {
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
);

export default Modal;
