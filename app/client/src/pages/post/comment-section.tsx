import Comment, { CommentSkeleton } from '../../components/comment';
import useComments from '../../hooks/useComments';

export default function CommentSection({ postId }: { postId: string }) {
	const { isLoading, comments, loadMore, nextCursor } = useComments(
		`/posts/${postId}/comments`
	);

	return (
		<div className="p-2">
			{isLoading && comments.length < 1 && (
				<>
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
				</>
			)}

			{comments.length > 0 && (
				<>
					{comments.map((comment) => (
						<Comment key={comment.id} postId={postId} {...comment} />
					))}

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
