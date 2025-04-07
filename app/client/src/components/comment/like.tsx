import { useState } from 'react';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';
import api from '../../api';

export default function CommentLike({
	likesLength,
	isLiked,
	postId,
	commentId,
}: {
	likesLength: number;
	isLiked: boolean;
	postId: string;
	commentId: number;
}) {
	const [likeCount, setLikeCount] = useState(likesLength);
	const [likeStatus, setLikeStatus] = useState(isLiked);

	async function handleClick() {
		try {
			const response = await api.patch(
				`/posts/${postId}/comments/${commentId}/like`
			);

			if (response.status === 204) {
				setLikeStatus(false);
				setLikeCount(likeCount - 1);
			} else {
				setLikeStatus(true);
				setLikeCount(likeCount + 1);
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="flex items-center	gap-1">
			<p>
				{likeCount}
				<span className="sr-only">likes</span>
			</p>

			<button
				onClick={handleClick}
				className="flex justify-center items-center w-6 h-6 rounded-full text-slate-800 dark:text-slate-200 hover:bg-slate-300 hover:dark:bg-slate-700 transition-colors"
			>
				<div className="relative w-[18px] h-[18px]">
					<IoHeartSharp
						className={`absolute top-0 left-0 transition-all duration-[400ms] w-[18px] h-[18px] ${
							likeStatus ? 'opacity-100 text-rose-500' : 'opacity-0'
						}`}
					/>
					<IoHeartOutline
						className={`absolute top-0 left-0 transition-all duration-[400ms] w-[18px] h-[18px] ${
							likeStatus ? 'opacity-0 text-rose-500' : 'opacity-100'
						}`}
					/>
				</div>
			</button>
		</div>
	);
}
