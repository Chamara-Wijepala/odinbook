import Post, { PostSkeleton } from '../../components/post';
import useData from '../../hooks/useData';
import type { PostType } from '../../types';

export default function Explore() {
	// Error isn't needed because endpoint will always return an array.
	const { isLoading, data: posts } = useData<PostType[]>('/posts?page=explore');

	return (
		<div className="p-4">
			<h2 className="text-slate-700 dark:text-slate-300 text-lg font-semibold my-4">
				See what people are saying
			</h2>

			{isLoading && (
				<div className="p-4 flex flex-col gap-4">
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}

			{posts && posts.length < 1 && !isLoading && (
				<div className="text-center p-4 pt-8">
					<p className="text-lg text-slate-500">
						Looks like there's nothing here. Be the first to create a post!
					</p>
				</div>
			)}

			<div className="flex flex-col gap-4">
				{posts?.map((post) => (
					<Post
						key={post.id}
						postId={post.id}
						authorId={post.author.id}
						firstName={post.author.firstName}
						lastName={post.author.lastName}
						username={post.author.username}
						content={post.content}
						createdAt={post.createdAt}
						updatedAt={post.updatedAt}
					/>
				))}
			</div>
		</div>
	);
}
