import { useEffect, useState } from 'react';
import useNewPostStore from '../stores/new-post';
import { PostType } from '../types';

export default function useNewPosts() {
	const [newPosts, setNewPosts] = useState<PostType[]>([]);
	const newPost = useNewPostStore((state) => state.newPost);

	useEffect(() => {
		if (newPost) setNewPosts((prev) => [newPost, ...prev]);
	}, [newPost]);

	return {
		newPosts,
	};
}
