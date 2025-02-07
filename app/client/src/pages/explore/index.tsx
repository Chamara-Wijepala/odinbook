import { useState, useEffect } from 'react';
import Post, { PostSkeleton } from '../../components/post';
import api from '../../api';
import type { PostType } from '../../types';

export default function Explore() {
	const [posts, setPosts] = useState<PostType[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const response = await api.get('/posts/explore');
				setPosts(response.data);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	return (
		<div className="p-4">
			<h2 className="text-slate-700 dark:text-slate-300 text-lg font-semibold my-4">
				See what people are saying
			</h2>

			{posts.length < 1 && !isLoading && (
				<div className="text-center p-4 pt-8">
					<p className="text-lg text-slate-500">
						Looks like there's nothing here. Be the first to create a post!
					</p>
				</div>
			)}

			{posts.length < 1 && isLoading && (
				<div className="p-4 flex flex-col gap-4">
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}

			<div className="flex flex-col gap-4">
				{posts?.map((post) => (
					<Post
						key={post.id}
						firstName={post.author.firstName}
						lastName={post.author.lastName}
						username={post.author.username}
						content={post.content}
					/>
				))}
			</div>
		</div>
	);
}
