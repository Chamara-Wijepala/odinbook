import CreatePost from '../../components/create-post';
import Post, { PostSkeleton } from '../../components/post';
import usePosts from '../../hooks/usePosts';
import useNewPosts from '../../hooks/useNewPosts';

export default function Home() {
	const { newPosts } = useNewPosts();
	const { isLoading, posts, loaderRef } = usePosts('/posts?page=home');

	return (
		<div className="flex flex-col">
			<div className="p-4 border-b-[1px] bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800">
				<CreatePost />
			</div>

			<div className="p-4">
				{/* displays newly created posts by current user */}
				<div className="flex flex-col gap-4">
					{newPosts.map((post) => (
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
							likedBy={post.likedBy}
						/>
					))}
				</div>

				{/* display posts from users followed by current user */}
				<div className="mt-4">
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
								Looks like there's nothing on your feed. Follow some users to
								get updates.
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
								likedBy={post.likedBy}
							/>
						))}
					</div>

					<div ref={loaderRef} className="pt-4 flex flex-col gap-4">
						<PostSkeleton />
						<PostSkeleton />
						<PostSkeleton />
						<PostSkeleton />
						<PostSkeleton />
					</div>
				</div>
			</div>
		</div>
	);
}
