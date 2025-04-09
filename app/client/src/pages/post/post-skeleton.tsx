import { BsThreeDotsVertical } from 'react-icons/bs';

export default function PostSkeleton() {
	return (
		<>
			<div className="border-b-[1px] border-slate-300 dark:border-slate-800">
				<div className="p-4 animate-pulse">
					<div className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[50px_1fr_auto] gap-2">
						<div className="bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center aspect-square"></div>

						<div className="text-sm sm:text-base flex flex-col justify-around">
							<div className="flex gap-1 flex-wrap font-semibold">
								<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-16"></div>
								<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
							</div>
							<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
						</div>

						<div className="text-slate-200">
							<BsThreeDotsVertical />
						</div>
					</div>

					<div className="my-4 flex flex-wrap gap-2">
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-full"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-[75%]"></div>
					</div>

					<div className="flex gap-1 items-center">
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-12"></div>
						<span className="text-slate-200 dark:text-slate-700">·</span>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
					</div>
				</div>

				<div className="p-4">
					<div className="pt-4 border-t-[1px] border-slate-300 dark:border-slate-800 animate-pulse">
						<div className="h-5 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
					</div>
				</div>
			</div>

			<div className="p-4 border-b-[1px] border-slate-300 dark:border-slate-800">
				<div className="p-4 h-20 animate-pulse">
					<div className="h-5 w-56 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
				</div>

				<div className="flex flex-col items-end gap-4 animate-pulse">
					<div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
					<div className="h-9 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
				</div>
			</div>
		</>
	);
}
