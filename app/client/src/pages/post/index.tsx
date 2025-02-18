import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { DateTime } from 'luxon';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Dialog from '../../components/post/dialog';
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
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2"
				>
					<IoIosArrowRoundBack className="w-8 h-8" />
					<p className="font-semibold">Back</p>
				</button>
			</div>

			{isLoading && <Skeleton />}

			{!isLoading && post && (
				<div className="border-b-[1px] border-slate-300 dark:border-slate-800">
					<div className="p-4">
						<div className="flex gap-2">
							<div>
								<Link to={`/users/${post.author.username}`}>
									<div className="bg-sky-500 rounded-full flex items-center justify-center gap-2 w-[40px] sm:w-[50px] aspect-square">
										<span>{post.author.firstName[0]}</span>
									</div>
								</Link>
							</div>

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

							<Dialog
								authorId={post.author.id}
								postId={post.id}
								postContent={post.content}
							/>
						</div>

						<div className="my-4">
							<p>{post.content}</p>
						</div>

						<div className="flex flex-wrap gap-1 text-sm lg:text-base text-wrap">
							<p className="text-slate-500">{formatDate(post.createdAt)}</p>
							{post.createdAt !== post.updatedAt && (
								<p className="text-slate-500">
									· Updated {formatDate(post.updatedAt)}
								</p>
							)}
						</div>
					</div>
				</div>
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
