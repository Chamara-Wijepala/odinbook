import { useState, useEffect, useRef } from 'react';
import { validatePost } from '@odinbook/utils';
import useNewPostStore from '../stores/new-post';
import api from '../api';
import { AxiosError } from 'axios';

export default function CreatePost() {
	const [content, setContent] = useState('');
	const [error, setError] = useState('');
	const [isPosting, setIsPosting] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const setNewPost = useNewPostStore((state) => state.setNewPost);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const validation = validatePost(content);

		if (validation.error) {
			setError(validation.error);
			return;
		}

		setError('');

		try {
			setIsPosting(true);
			const response = await api.post('/posts', { content });
			setContent('');
			setIsPosting(false);
			setNewPost(response.data);
		} catch (error) {
			if (error instanceof AxiosError) {
				setError(error.response?.data.error);
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
			<form onSubmit={handleSubmit}>
				<textarea
					ref={textareaRef}
					name="content"
					id="content"
					placeholder="What's on your mind?"
					value={content}
					rows={1}
					maxLength={500}
					onChange={(e) => {
						setContent(e.target.value);
					}}
					// min-h-[3.75rem] is required to stop the textarea from shrinking when inside the modal
					className="w-full max-h-[50svh] lg:max-h-full min-h-[3.75rem] resize-none bg-transparent p-4 text-lg"
				></textarea>

				<div className="flex items-center justify-between">
					<p className="text-xs text-rose-500">{error}</p>
					<span className="text-sm text-slate-600 dark:text-slate-300">
						{content.length}/500
					</span>
				</div>

				<div className="flex mt-4">
					<button
						type="submit"
						disabled={content === '' || isPosting}
						className="ml-auto bg-sky-400 hover:bg-sky-300 disabled:opacity-60 disabled:hover:bg-sky-400 disabled:cursor-not-allowed py-2 px-4 rounded-full transition-colors"
					>
						Post
					</button>
				</div>
			</form>
		</div>
	);
}
