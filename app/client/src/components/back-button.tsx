import { useNavigate } from 'react-router';
import { IoIosArrowRoundBack } from 'react-icons/io';

export default function BackButton() {
	const navigate = useNavigate();

	return (
		<button
			onClick={() => navigate(-1)}
			// extra padding on right to offset space inside icon
			className="flex items-center gap-2 hover:bg-slate-300 hover:dark:bg-slate-700 rounded-full pl-2 pr-4"
		>
			<IoIosArrowRoundBack className="w-8 h-8" />
			<p className="font-semibold">Back</p>
		</button>
	);
}
