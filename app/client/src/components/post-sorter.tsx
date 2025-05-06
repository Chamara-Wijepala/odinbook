import { useState, useRef } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import { MdOutlineNewReleases } from 'react-icons/md';
import { FiArchive } from 'react-icons/fi';
import { FaRegHeart } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa';
import Dialog from './dialog';

export default function PostSorter({
	sort,
	setSort,
}: {
	sort: string;
	setSort: React.Dispatch<React.SetStateAction<string>>;
}) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		setSort(e.currentTarget.dataset.tag!);
		setIsDialogOpen(!isDialogOpen);
	}

	return (
		<div className="relative">
			<button
				ref={buttonRef}
				onClick={() => setIsDialogOpen(!isDialogOpen)}
				className="flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors px-4 py-2 rounded-full"
			>
				<span>
					{sort.slice(0, 1).toUpperCase()}
					{sort.slice(1)}
				</span>
				<FaAngleDown />
			</button>

			<Dialog
				isOpen={isDialogOpen}
				setIsOpen={setIsDialogOpen}
				buttonRef={buttonRef}
				className="top-12"
			>
				<p className="p-4 font-bold">Sort by</p>

				<div className="flex flex-col">
					<button
						data-tag="new"
						onClick={handleClick}
						className="p-4 hover:bg-slate-200 dark:hover:bg-slate-700 text-start flex items-center gap-2"
					>
						<MdOutlineNewReleases />
						<span>New</span>
					</button>
					<button
						data-tag="old"
						onClick={handleClick}
						className="p-4 hover:bg-slate-200 dark:hover:bg-slate-700 text-start flex items-center gap-2"
					>
						<FiArchive />
						<span>Old</span>
					</button>
					<button
						data-tag="likes"
						onClick={handleClick}
						className="p-4 hover:bg-slate-200 dark:hover:bg-slate-700 text-start flex items-center gap-2"
					>
						<FaRegHeart />
						<span>Likes</span>
					</button>
					<button
						data-tag="comments"
						onClick={handleClick}
						className="p-4 hover:bg-slate-200 dark:hover:bg-slate-700 text-start flex items-center gap-2"
					>
						<FaRegComment />
						<span>Comments</span>
					</button>
				</div>
			</Dialog>
		</div>
	);
}
