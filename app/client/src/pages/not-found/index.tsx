import { Link } from 'react-router';

export default function NotFound() {
	return (
		<div className="flex flex-col gap-4 justify-center items-center min-h-[100svh] bg-slate-950 text-white">
			<div className="font-norse font-bold">
				<h2 className="text-9xl">404</h2>
				<p className="text-center text-4xl tracking-widest">Not Found</p>
			</div>

			<p>
				Back to{' '}
				<Link
					to="/"
					className="text-sky-600 hover:text-sky-400 transition-colors duration-250"
				>
					Home page
				</Link>
			</p>
		</div>
	);
}
