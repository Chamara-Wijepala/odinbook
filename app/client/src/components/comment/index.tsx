import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { DateTime } from 'luxon';
import { BsThreeDots } from 'react-icons/bs';
import Dialog from '../dialog';
import type { CommentType } from '@odinbook/types';

export default function Comment({
	id,
	createdAt,
	updatedAt,
	content,
	author,
}: CommentType) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	return (
		<div className="p-2">
			<div className="flex gap-1 lg:gap-2 lg:items-center">
				{/* profile picture */}
				<div>
					{!author && (
						<div className="bg-slate-300 dark:bg-slate-800 rounded-full w-[20px] sm:w-[25px] aspect-square"></div>
					)}

					{author && (
						<Link to={`/users/${author.username}`}>
							<div className="bg-sky-500 rounded-full flex items-center justify-center gap-2 w-[20px] sm:w-[25px] aspect-square">
								<span className="text-xs">{author.firstName[0]}</span>
							</div>
						</Link>
					)}
				</div>

				{/* name and username */}
				<div>
					{!author && <p className="text-slate-500">deleted</p>}

					{author && (
						<div className="flex flex-col lg:flex-row lg:gap-2">
							<Link
								to={`/users/${author.username}`}
								className="hover:underline"
							>
								<p className="text-sm font-bold">
									{author.firstName} {author.lastName}
								</p>
							</Link>
							<Link
								to={`/users/${author.username}`}
								className="hover:underline text-slate-500"
							>
								<p className="text-slate-500 text-xs sm:text-sm">
									{author.username}
								</p>
							</Link>
						</div>
					)}
				</div>

				<span className="text-slate-500">·</span>

				{/* dates */}
				<div className="text-slate-500 pt-1 lg:pt-0">
					{createdAt === updatedAt ? (
						<p className="text-xs">
							{DateTime.fromISO(`${createdAt}`).toRelative()}
						</p>
					) : (
						<p className="text-xs">
							Updated {DateTime.fromISO(`${updatedAt}`).toRelative()}
						</p>
					)}
				</div>
			</div>

			{/* content */}
			<div className="py-2 text-slate-800 dark:text-slate-200">
				<p>{content}</p>
			</div>

			{/* toolbar */}
			<div>
				{/* dialog */}
				<div onClick={(e) => e.preventDefault()} className="relative">
					<button
						ref={buttonRef}
						onClick={() => setIsDialogOpen(!isDialogOpen)}
						className="w-6 h-6 flex rounded-full items-center justify-center hover:text-sky-600 hover:bg-sky-100 hover:dark:text-sky-300 hover:dark:bg-sky-900 transition-colors"
					>
						<BsThreeDots className="text-slate-800 dark:text-slate-200" />
					</button>

					<Dialog
						isOpen={isDialogOpen}
						setIsOpen={setIsDialogOpen}
						buttonRef={buttonRef}
						className=""
					>
						<div>update</div>
						<div>delete</div>
					</Dialog>
				</div>
			</div>
		</div>
	);
}

export function CommentSkeleton() {
	return <div>Comment Skeleton</div>;
}
