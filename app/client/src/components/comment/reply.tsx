import { useState, useEffect, useRef } from 'react';
import { validateComment } from '@odinbook/utils';
import useCommentsStore from '../../stores/comments';
import coloredNotification from '../../services/notifications';
import api from '../../api';
import { AxiosError } from 'axios';

export default function Reply({
	url,
	setIsBeingRepliedTo,
}: {
	url: string;
	setIsBeingRepliedTo: (isBeingUpdated: boolean) => void;
}) {
	const [content, setContent] = useState('');
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState('');
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const setComments = useCommentsStore((s) => s.setComments);

	async function handleSubmit() {
		const validation = validateComment(content);

		if (validation.error) {
			setError(validation.error);
			return;
		}

		setError('');

		try {
			setIsPending(true);
			const response = await api.post(url, {
				content,
			});
			setComments([response.data.comment]);
			setIsBeingRepliedTo(false);
		} catch (error) {
			if (error instanceof AxiosError) {
				const data = error.response?.data;

				if (data.toast) {
					coloredNotification(data.toast);
					return;
				}

				setError(data);
			}
		} finally {
			setIsPending(false);
		}
	}

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [content]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			className="border-[1px] border-slate-300 dark:border-slate-800 rounded-lg p-2"
		>
			<textarea
				ref={textareaRef}
				placeholder="What are your thoughts?"
				value={content}
				rows={1}
				maxLength={250}
				onChange={(e) => {
					setContent(e.target.value);
				}}
				className="w-full max-h-[50svh] lg:max-h-full resize-none bg-transparent"
			></textarea>

			<div className="flex items-center justify-between">
				<p className="text-xs text-rose-500">{error}</p>
				<span className="text-sm text-slate-600 dark:text-slate-300">
					{content.length}/250
				</span>
			</div>

			<div className="flex mt-4 justify-end gap-2">
				<button
					onClick={() => setIsBeingRepliedTo(false)}
					className="bg-rose-500 hover:bg-rose-400 py-1 px-2 rounded-full transition-colors"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={content === '' || isPending}
					className="bg-sky-400 hover:bg-sky-300 disabled:opacity-60 disabled:hover:bg-sky-400 disabled:cursor-not-allowed py-1 px-2 rounded-full transition-colors"
				>
					Reply
				</button>
			</div>
		</form>
	);
}
