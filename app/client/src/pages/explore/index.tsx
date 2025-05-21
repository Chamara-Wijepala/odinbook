import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useNewPostStore from '../../stores/new-post';
import Post, { PostSkeleton } from '../../components/post';
import PostSorter from '../../components/post-sorter';
import usePosts from '../../hooks/usePosts';

export default function Explore() {
	const [sort, setSort] = useState('new');
	const { isLoading, posts, loaderRef } = usePosts('/posts?page=explore', sort);
	const newPost = useNewPostStore((s) => s.newPost);
	const navigate = useNavigate();

	// Navigate to post page when a new post is created. This is only done here as
	// new posts are rendered on home and profile pages.
	useEffect(() => {
		if (newPost) {
			navigate(`/post/${newPost.id}`);
		}
	}, [newPost]);

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
				{posts && posts.length > 0 && (
					<PostSorter sort={sort} setSort={setSort} />
				)}

				{posts?.map((post) => (
					<Post
						key={post.id}
						postId={post.id}
						authorId={post.author.id}
						firstName={post.author.firstName}
						lastName={post.author.lastName}
						username={post.author.username}
						avatar={post.author.avatar}
						content={post.content}
						createdAt={post.createdAt}
						updatedAt={post.updatedAt}
						likedBy={post.likedBy}
						commentCount={post._count.comments}
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
	);
}
