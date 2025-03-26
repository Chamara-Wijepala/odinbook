import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { validatePost } from '@odinbook/utils';
import api from '../api';
import coloredNotification from '../services/notifications';
import { AxiosError } from 'axios';

export default function UpdatePost({
	postId,
	postContent,
	toggleModal,
}: {
	postId: string;
	postContent: string;
	toggleModal(): void;
}) {
	const [content, setContent] = useState(postContent);
	const [error, setError] = useState('');
	const [isPosting, setIsPosting] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	async function handleClick() {
		const validation = validatePost(content);

		if (validation.error) {
			setError(validation.error);
			return;
		}

		setError('');

		try {
			setIsPosting(true);
			const response = await api.patch(`/posts/${postId}`, { content });
			setIsPosting(false);
			coloredNotification(response.data.toast);
			toggleModal();
			// refresh when on post page, navigate when on other pages.
			if (location.pathname.split('/')[1] === 'post') {
				navigate(0);
			} else {
				navigate(`/post/${postId}`);
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				const data = error.response?.data;

				if (data.error) setError(data.error);

				if (data.toast) {
					coloredNotification(data.toast);
					toggleModal();
					navigate('/');
				}
			}
		}
	}

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [content]);

	return (
		<div>
			<form onSubmit={(e) => e.preventDefault()}>
				<textarea
					ref={textareaRef}
					name="content"
					id="content"
					placeholder="Post can't be blank."
					value={content}
					rows={1}
					maxLength={500}
					onChange={(e) => {
						setContent(e.target.value);
					}}
					className="w-full max-h-[50svh] lg:max-h-full resize-none bg-transparent p-4 text-lg"
				></textarea>

				<div className="flex items-center justify-between">
					<p className="text-xs text-rose-500">{error}</p>
					<span className="text-sm text-slate-600 dark:text-slate-300">
						{content.length}/500
					</span>
				</div>

				<div className="flex gap-4 mt-4">
					<button
						disabled={isPosting}
						onClick={() => toggleModal()}
						className="ml-auto bg-rose-500 hover:bg-rose-400 py-2 px-4 rounded-full transition-colors"
					>
						Cancel
					</button>

					<button
						type="submit"
						disabled={content === '' || isPosting}
						onClick={handleClick}
						className="bg-sky-400 hover:bg-sky-300 disabled:opacity-60 disabled:hover:bg-sky-400 disabled:cursor-not-allowed py-2 px-4 rounded-full transition-colors"
					>
						Update
					</button>
				</div>
			</form>
		</div>
	);
}
