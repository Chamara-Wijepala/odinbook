import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { DateTime } from 'luxon';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Dialog from '../../components/dialog';
import PostDialogItems from '../../components/post/post-dialog-items';
import PostLikes from '../../components/post-likes';
import BackButton from '../../components/back-button';
import CreateComment from '../../components/create-comment';
import useData from '../../hooks/useData';
import coloredNotification from '../../services/notifications';
import type { PostType } from '../../types';
import { AxiosError } from 'axios';

function formatDate(isoString: string) {
	const dt = DateTime.fromISO(isoString);
	const time = dt.toFormat('h:mm a');
	const date = dt.toFormat('MMM d, yyyy');

	return `${time} · ${date}`;
}

export default function PostPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const params = useParams();
	const {
		isLoading,
		data: post,
		error,
	} = useData<PostType>(`/posts/${params.id}`);
	const navigate = useNavigate();

	useEffect(() => {
		if (!error) return;

		if (error instanceof AxiosError) {
			const { toast } = error.response?.data;

			coloredNotification(toast);
			navigate('/');
		}
	}, [error]);

	return (
		<div>
			<div className="p-4">
				<BackButton />
			</div>

			{isLoading && <Skeleton />}

			{!isLoading && post && (
				<>
					<div className="border-b-[1px] border-slate-300 dark:border-slate-800">
						<div className="p-4">
							<div className="flex gap-2">
								{/* profile */}
								<div>
									<Link to={`/users/${post.author.username}`}>
										<div className="bg-sky-500 rounded-full flex items-center justify-center gap-2 w-[40px] sm:w-[50px] aspect-square">
											<span>{post.author.firstName[0]}</span>
										</div>
									</Link>
								</div>

								{/* names and username */}
								<div className="text-sm sm:text-base flex flex-col flex-grow gap-x-1 h-fit">
									<div className="font-semibold flex flex-wrap gap-1">
										<Link
											to={`/users/${post.author.username}`}
											className="hover:underline"
										>
											<p>
												{post.author.firstName} {post.author.lastName}
											</p>
										</Link>
									</div>
									<Link
										to={`/users/${post.author.username}`}
										className="hover:underline decoration-slate-500"
									>
										<p className="text-slate-500 text-xs sm:text-sm">
											@{post.author.username}
										</p>
									</Link>
								</div>

								{/* dialog */}
								<div className="relative">
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
											authorId={post.author.id}
											postId={post.id}
											postContent={post.content}
										/>
									</Dialog>
								</div>
							</div>

							{/* content */}
							<div className="my-4">
								<p>{post.content}</p>
							</div>

							{/* dates */}
							<div className="flex flex-wrap gap-1 text-sm lg:text-base text-wrap">
								<p className="text-slate-500">{formatDate(post.createdAt)}</p>
								{post.createdAt !== post.updatedAt && (
									<p className="text-slate-500">
										· Updated {formatDate(post.updatedAt)}
									</p>
								)}
							</div>
						</div>

						{/* likes */}
						<div className="p-4">
							<div className="pt-4 border-t-[1px] border-slate-300 dark:border-slate-800">
								<PostLikes likedBy={post.likedBy} postId={post.id} />
							</div>
						</div>
					</div>

					{/* create comment */}
					<div className="p-4 border-b-[1px] border-slate-300 dark:border-slate-800">
						<CreateComment url={`/posts/${post.id}/comments`} />
					</div>
				</>
			)}
		</div>
	);
}

function Skeleton() {
	return (
		<div className="border-b-[1px] border-slate-300 dark:border-slate-800">
			<div className="p-4">
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

				<div className="my-4 flex flex-wrap gap-2 animate-pulse">
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-[75%]"></div>
				</div>

				<div className="flex gap-1 items-center animate-pulse">
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-12"></div>
					<span className="text-slate-200 dark:text-slate-700">·</span>
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
				</div>
			</div>
		</div>
	);
}
