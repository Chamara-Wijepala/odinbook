import { useParams } from 'react-router';
import useAuthStore from '../../stores/auth';

export default function Skeleton() {
	const params = useParams();
	const currentUser = useAuthStore((s) => s.user);

	return (
		<div className="p-4 animate-pulse">
			{/* avatar */}
			<div className="bg-slate-200 dark:bg-slate-700 rounded-full w-[80px] sm:w-[120px] aspect-square"></div>

			<div className="my-6 flex gap-x-1 items-start">
				{/* names and username */}
				<div>
					<div className="flex gap-x-1 mb-2">
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-24"></div>
					</div>

					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-32"></div>
				</div>

				{/* follow/unfollow button */}
				{currentUser?.username !== params.username && (
					<div className="ml-auto bg-slate-200 dark:bg-slate-700 h-8 w-20 rounded-full"></div>
				)}
			</div>

			{/* join date */}
			<div className="my-6 bg-slate-200 dark:bg-slate-700 h-4 w-32 rounded-md"></div>

			{/* followers and post count */}
			<div className="flex gap-x-4 items-center">
				<div className="bg-slate-200 dark:bg-slate-700 h-4 w-16 rounded-md"></div>
				<div className="bg-slate-200 dark:bg-slate-700 h-4 w-16 rounded-md"></div>

				<span className="text-slate-500">·</span>

				<div className="bg-slate-200 dark:bg-slate-700 h-4 w-16 rounded-md"></div>
			</div>
		</div>
	);
}
