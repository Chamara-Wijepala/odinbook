import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { DateTime } from 'luxon';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaRegComment } from 'react-icons/fa';
import Dialog from '../dialog';
import PostDialogItems from './post-dialog-items';
import PostLikes from '../post-likes';

type Props = {
	postId: string;
	authorId: string;
	firstName: string;
	lastName: string;
	username: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	likedBy: string[];
	commentCount: number;
};

export default function Post({
	postId,
	authorId,
	firstName,
	lastName,
	username,
	content,
	createdAt,
	updatedAt,
	likedBy,
	commentCount,
}: Props) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	return (
		<Link to={`/post/${postId}`} draggable="false">
			{/* set bottom padding to 2 so the control group will fit better */}
			<div className="bg-white hover:bg-slate-50 dark:bg-slate-900 hover:dark:bg-slate-800 transition-colors shadow-md p-4 pb-2 rounded-lg">
				<div className="flex gap-2">
					<div
						onClick={(e) => e.preventDefault()} // stop event bubbling
						className="flex gap-2"
					>
						{/* profile */}
						<Link to={`/users/${username}`}>
							<div>
								<div className="bg-sky-500 rounded-full flex items-center justify-center gap-2 w-[40px] sm:w-[50px] aspect-square">
									<span>{firstName[0]}</span>
								</div>
							</div>
						</Link>

						<div className="text-sm sm:text-base flex items-center flex-wrap gap-x-1 h-fit">
							{/* names */}
							<Link to={`/users/${username}`} className="hover:underline">
								<p className="font-semibold">
									{firstName} {lastName}
								</p>
							</Link>

							{/* username */}
							<Link
								to={`/users/${username}`}
								className="hover:underline decoration-slate-500"
							>
								<p className="text-slate-500 text-xs sm:text-sm">@{username}</p>
							</Link>

							<div className="text-slate-500 text-xs sm:text-sm flex gap-x-1">
								<span>·</span>

								{/* dates */}
								<div>
									{createdAt === updatedAt ? (
										<p>{DateTime.fromISO(createdAt).toRelative()}</p>
									) : (
										<p>Updated {DateTime.fromISO(updatedAt).toRelative()}</p>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Dialog */}
					<div
						onClick={(e) => e.preventDefault()} // prevent event bubbling
						className="relative ml-auto"
					>
						<button
							ref={buttonRef}
							onClick={() => setIsDialogOpen(!isDialogOpen)}
							className="w-6 h-6 flex rounded-full items-center justify-center hover:text-sky-600 hover:bg-sky-100 hover:dark:text-sky-300 hover:dark:bg-sky-900 transition-colors"
						>
							<BsThreeDotsVertical />
						</button>

						<Dialog
							isOpen={isDialogOpen}
							setIsOpen={setIsDialogOpen}
							buttonRef={buttonRef}
							className="-translate-x-[calc(100%-20px)]"
						>
							<PostDialogItems
								authorId={authorId}
								postId={postId}
								postContent={content}
							/>
						</Dialog>
					</div>
				</div>

				{/* content */}
				<div className="mt-4">
					<p className="break-all">{content}</p>
				</div>

				{/* control group */}
				<div className="flex pt-2 mt-2 border-t-[1px] border-slate-300 dark:border-slate-800">
					<div
						onClick={(e) => e.preventDefault()} // stop event bubbling
						className="flex gap-4"
					>
						<PostLikes likedBy={likedBy} postId={postId} />

						<Link
							to={`/post/${postId}`}
							className="flex items-center gap-2 py-1 px-3 rounded-full text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
						>
							<p>{commentCount}</p>
							<FaRegComment className="w-5 h-5" />
						</Link>
					</div>
				</div>
			</div>
		</Link>
	);
}

export function PostSkeleton() {
	return (
		<div className="bg-white dark:bg-slate-900 shadow-md p-4 rounded-lg">
			<div className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[50px_1fr_auto] gap-2">
				<div className="bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center aspect-square animate-pulse"></div>

				<div className="text-sm sm:text-base flex flex-col justify-around animate-pulse">
					<div className="flex gap-1 flex-wrap font-semibold">
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-16"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
					</div>
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
				</div>

				<div className="text-slate-200 animate-pulse">
					<BsThreeDotsVertical />
				</div>
			</div>

			<div className="mt-4 flex flex-wrap gap-2 animate-pulse">
				<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
				<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
				<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
				<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-[75%]"></div>
			</div>
		</div>
	);
}
