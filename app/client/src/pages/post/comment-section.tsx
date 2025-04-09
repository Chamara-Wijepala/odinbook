import { useEffect, useMemo } from 'react';
import useCommentsStore from '../../stores/comments';
import useComments from '../../hooks/useComments';
import CommentSkeleton from '../../components/comment/comment-skeleton';
import CommentThread from '../../components/comment-thread';

export default function CommentSection({
	postId,
	postAuthor,
}: {
	postId: string;
	postAuthor: string;
}) {
	const clearComments = useCommentsStore((s) => s.clearComments);
	const comments = useCommentsStore((s) => s.comments);
	const rootComments = useMemo(
		() => comments.filter((c) => !c.replyToId),
		[comments]
	);
	const { isLoading, loadMore, nextCursor } = useComments(
		`/posts/${postId}/comments`
	);

	useEffect(() => {
		return () => clearComments();
	}, []);

	return (
		<div className="p-2">
			{isLoading && rootComments.length < 1 && (
				<>
					<div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-md">
						<CommentSkeleton />
					</div>
					<div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-md">
						<CommentSkeleton />
					</div>
					<div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-md">
						<CommentSkeleton />
					</div>
					<div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-md">
						<CommentSkeleton />
					</div>
					<div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-md">
						<CommentSkeleton />
					</div>
				</>
			)}

			{rootComments.length > 0 && (
				<>
					<div className="flex flex-col gap-2 mb-2">
						{rootComments.map((comment) => (
							<div
								key={comment.id}
								className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-md"
							>
								<CommentThread
									postId={postId}
									postAuthor={postAuthor}
									comment={comment}
									depth={1}
								>
									{comment._count.replies > 0 && (
										<CommentThread.LoadMore
											postId={postId}
											commentId={comment.id}
											depth={1}
										/>
									)}
								</CommentThread>
							</div>
						))}
					</div>

					<div className="flex justify-center">
						<button
							disabled={isLoading}
							onClick={loadMore}
							className={`rounded-full py-2 px-4 w-full font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-300 hover:dark:bg-slate-700 disabled:text-slate-600 disabled:cursor-not-allowed ${
								!nextCursor && 'hidden'
							}`}
						>
							Load more
						</button>
					</div>
				</>
			)}
		</div>
	);
}
