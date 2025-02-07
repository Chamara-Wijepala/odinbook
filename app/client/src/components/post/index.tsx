import { BsThreeDotsVertical } from 'react-icons/bs';
import Dialog from './dialog';

type Props = {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	content: string;
};

export default function Post({
	id,
	firstName,
	lastName,
	username,
	content,
}: Props) {
	return (
		<div className="bg-white dark:bg-slate-900 shadow-md p-4 rounded-lg">
			<div className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[50px_1fr_auto] gap-2">
				<div className="bg-sky-500 rounded-full flex items-center justify-center aspect-square">
					<span>{firstName[0]}</span>
				</div>

				<div className="text-sm sm:text-base flex flex-col justify-between">
					<div className="flex gap-1 flex-wrap font-semibold">
						<p>{firstName}</p>
						<p>{lastName}</p>
					</div>
					<p className="text-slate-500">@{username}</p>
				</div>

				<Dialog postId={id} postContent={content} />
			</div>

			<div className="mt-4">
				<p>{content}</p>
			</div>
		</div>
	);
}

export function PostSkeleton() {
	return (
		<div className="bg-white dark:bg-slate-900 shadow-md p-4 rounded-lg">
			<div className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[50px_1fr_auto] gap-2">
				<div className="bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center aspect-square animate-pulse"></div>

				<div className="text-sm sm:text-base flex flex-col justify-around animate-pulse">
					<div className="flex gap-1 flex-wrap font-semibold">
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-16"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
					</div>
					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
				</div>

				<div className="text-slate-200 animate-pulse">
					<BsThreeDotsVertical />
				</div>
			</div>

			<div className="mt-4 flex flex-wrap gap-2 animate-pulse">
				<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
				<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
				<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
				<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-[75%]"></div>
			</div>
		</div>
	);
}
