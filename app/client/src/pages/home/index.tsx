import CreatePost from '../../components/create-post';

export default function Home() {
	return (
		<div className="flex flex-col">
			<div className="p-4 border-b-[1px] bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800">
				<CreatePost />
			</div>
		</div>
	);
}
