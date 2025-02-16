import { useState, useEffect } from 'react';
import useNewPostStore from '../../stores/new-post';
import CreatePost from '../../components/create-post';
import Post from '../../components/post';
import { PostType } from '../../types';

export default function Home() {
	const newPost = useNewPostStore((state) => state.newPost);
	const [posts, setPosts] = useState<PostType[]>([]);

	useEffect(() => {
		if (newPost) setPosts((prev) => [newPost, ...prev]);
	}, [newPost]);

	return (
		<div className="flex flex-col">
			<div className="p-4 border-b-[1px] bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800">
				<CreatePost />
			</div>

			<div className="p-4 flex flex-col gap-4">
				{posts.map((post) => (
					<Post
						key={post.id}
						postId={post.id}
						authorId={post.author.id}
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
