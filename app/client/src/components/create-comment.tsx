import { useEffect, useRef, useState } from 'react';
import { validateComment } from '@odinbook/utils';
import useCommentsStore from '../stores/comments';
import api from '../api';
import { AxiosError } from 'axios';

export default function CreateComment({ url }: { url: string }) {
	const [content, setContent] = useState('');
	const [error, setError] = useState('');
	const [isPending, setIsPending] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const setComments = useCommentsStore((s) => s.setComments);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const validation = validateComment(content);

		if (validation.error) {
			setError(validation.error);
			return;
		}

		setError('');

		try {
			setIsPending(true);
			const response = await api.post(url, { content });
			setContent('');
			setIsPending(false);
			setComments([response.data.comment]);
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
		<form onSubmit={handleSubmit}>
			<textarea
				ref={textareaRef}
				name="content"
				id="content"
				placeholder="What are your thoughts?"
				value={content}
				rows={1}
				maxLength={250}
				onChange={(e) => {
					setContent(e.target.value);
				}}
				className="w-full max-h-[50svh] lg:max-h-full resize-none bg-transparent p-4 text-lg"
			></textarea>

			<div className="flex items-center justify-between">
				<p className="text-xs text-rose-500">{error}</p>
				<span className="text-sm text-slate-600 dark:text-slate-300">
					{content.length}/250
				</span>
			</div>

			<div className="flex mt-4">
				<button
					type="submit"
					disabled={content === '' || isPending}
					className="ml-auto bg-sky-400 hover:bg-sky-300 disabled:opacity-60 disabled:hover:bg-sky-400 disabled:cursor-not-allowed py-2 px-4 rounded-full transition-colors"
				>
					Post
				</button>
			</div>
		</form>
	);
}
