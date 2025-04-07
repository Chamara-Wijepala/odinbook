export default function Skeleton() {
	return (
		<div className="p-2 animate-pulse">
			{/* top section */}
			<div className="flex gap-1 lg:gap-2 lg:items-center">
				{/* profile picture */}
				<div>
					<div className="bg-slate-300 dark:bg-slate-800 rounded-full w-[20px] sm:w-[25px] aspect-square"></div>
				</div>

				{/* name and username */}
				<div className="flex flex-col lg:flex-row gap-1 lg:gap-2 pt-[5px]">
					<div className="flex gap-1">
						<div className="h-3 w-20 rounded-lg bg-slate-300 dark:bg-slate-800"></div>
						<div className="h-3 w-12 rounded-lg bg-slate-300 dark:bg-slate-800"></div>
					</div>

					<div>
						<div className="h-3 w-16 rounded-lg bg-slate-300 dark:bg-slate-800"></div>
					</div>
				</div>

				<span className="text-slate-300 dark:text-slate-800">·</span>

				{/* date */}
				<div className="pt-[5px]">
					<div className="h-3 w-16 rounded-lg bg-slate-300 dark:bg-slate-800"></div>
				</div>
			</div>

			{/* content section */}
			<div className="py-2 flex flex-col gap-1">
				<div className="h-3 w-full rounded-lg bg-slate-300 dark:bg-slate-800"></div>
				<div className="h-3 w-full rounded-lg bg-slate-300 dark:bg-slate-800"></div>
				<div className="h-3 w-full rounded-lg bg-slate-300 dark:bg-slate-800"></div>
				<div className="h-3 w-full rounded-lg bg-slate-300 dark:bg-slate-800"></div>
				<div className="h-3 w-16 rounded-lg bg-slate-300 dark:bg-slate-800"></div>
			</div>

			{/* toolbar */}
			<div className="flex gap-2">
				<div className="h-4 w-8 rounded-lg bg-slate-300 dark:bg-slate-800"></div>
				<div className="h-4 w-16 rounded-lg bg-slate-300 dark:bg-slate-800"></div>
				<div className="h-4 w-5 rounded-lg bg-slate-300 dark:bg-slate-800"></div>
			</div>
		</div>
	);
}
