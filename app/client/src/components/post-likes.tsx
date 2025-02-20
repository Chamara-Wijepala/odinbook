import { useState, useEffect } from 'react';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';
import useAuthStore from '../stores/auth';
import api from '../api';
import { AxiosError } from 'axios';

export default function PostLikes({
	likedBy,
	postId,
}: {
	likedBy: string[];
	postId: string;
}) {
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(likedBy.length);
	const currentUserId = useAuthStore((state) => state.user?.id);

	async function handleClick() {
		try {
			if (isLiked) {
				await api.delete(`/posts/${postId}/like`);
				setIsLiked(false);
				setLikeCount(likeCount - 1);
			} else {
				await api.post(`/posts/${postId}/like`);
				setIsLiked(true);
				setLikeCount(likeCount + 1);
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				// update like without requesting the server
				if (err.response?.status === 409) {
					if (isLiked) {
						setIsLiked(false);
						setLikeCount(likeCount - 1);
					} else {
						setIsLiked(true);
						setLikeCount(likeCount + 1);
					}
				}
			}
		}
	}

	useEffect(() => {
		if (!currentUserId) return;

		if (likedBy.includes(currentUserId)) setIsLiked(true);
	}, [likedBy, currentUserId]);

	return (
		<div className="flex items-center gap-2 text-slate-500">
			<p>
				{likeCount}
				<span className="sr-only">likes</span>
			</p>

			<button onClick={handleClick} className="relative w-6 h-6 ">
				<IoHeartSharp
					className={`absolute top-0 left-0 transition-all duration-[400ms] w-6 h-6  ${
						isLiked ? 'opacity-100 text-rose-500' : 'opacity-0'
					}`}
				/>
				<IoHeartOutline
					className={`absolute top-0 left-0 transition-all duration-[400ms] w-6 h-6  ${
						isLiked ? 'opacity-0 text-rose-500' : 'opacity-100'
					}`}
				/>
			</button>
		</div>
	);
}
