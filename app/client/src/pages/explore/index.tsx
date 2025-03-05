import { useState, useEffect, useRef } from 'react';
import Post, { PostSkeleton } from '../../components/post';
import useData from '../../hooks/useData';
import useOnScreen from '../../hooks/useOnScreen';
import type { PostType } from '../../types';

type Data = {
	nextCursor: string | null;
	posts: PostType[];
};

export default function Explore() {
	const [cursor, setCursor] = useState('');
	// Error isn't needed because endpoint will always return an array.
	const { isLoading, data } = useData<Data>(
		`/posts?page=explore&cursor=${cursor}`
	);
	const [posts, setPosts] = useState<PostType[]>([]);
	const loaderRef = useRef<HTMLDivElement>(null);
	const isOnScreen = useOnScreen(loaderRef);

	useEffect(() => {
		if (!data) return;

		if (data.posts.length > 0) setPosts((prev) => [...prev, ...data.posts]);

		// loaderRef element must be in the DOM because it's passed to useOnScreen,
		// so it's hidden instead.
		// explicitly check for null because server returns null when there are no
		// more posts to return.
		if (data.nextCursor === null) loaderRef.current!.className = 'hidden';
	}, [data]);

	// setting cursor also causes useData to refetch
	useEffect(() => {
		if (!data || !data.nextCursor) return;

		if (isOnScreen) {
			setCursor(data.nextCursor);
		}
	}, [isOnScreen]);

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
	);
}
