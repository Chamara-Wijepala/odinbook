import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DateTime } from 'luxon';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaRegCalendarAlt } from 'react-icons/fa';
import useAuthStore from '../../stores/auth';
import useData from '../../hooks/useData';
import UserPosts from './user-posts';
import coloredNotification from '../../services/notifications';
import api from '../../api';
import { AxiosError } from 'axios';

type User = {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	createdAt: string;
	_count: {
		posts: number;
		followedBy: number;
		following: number;
	};
};

function formatDate(isoString: string) {
	return DateTime.fromISO(isoString).toFormat('MMM d, yyyy');
}

export default function Profile() {
	const params = useParams();
	const {
		isLoading,
		data: user,
		error,
	} = useData<User>(`/users/${params.username}`);
	const navigate = useNavigate();
	const currentUser = useAuthStore((state) => state.user);
	const updateUserFollowing = useAuthStore(
		(state) => state.updateUserFollowing
	);
	const deleteUserFollowing = useAuthStore(
		(state) => state.deleteUserFollowing
	);

	async function handleFollow() {
		if (!user) return;

		try {
			if (currentUser?.following.includes(user.id)) {
				await api.patch(`/users/${user.id}/unfollow`);
				deleteUserFollowing(user.id);
			} else {
				await api.patch(`/users/${user.id}/follow`);
				updateUserFollowing(user.id);
			}
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		if (!error) return;

		if (error instanceof AxiosError) {
			coloredNotification(error.response?.data.toast);
			navigate('/');
		}
	}, [error]);

	return (
		<div>
			{/* back button */}
			<div className="p-4">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2"
				>
					<IoIosArrowRoundBack className="w-8 h-8" />
					<p className="font-semibold">Back</p>
				</button>
			</div>

			{isLoading && <Skeleton />}

			{!isLoading && user && (
				<div>
					<div className="p-4 border-b-[1px] border-slate-300 dark:border-slate-800">
						<div>
							{/* profile picture */}
							<div className="bg-sky-500 rounded-full flex items-center justify-center gap-2 w-[80px] sm:w-[100px] aspect-square">
								{user.firstName[0]}
							</div>

							<div className="my-6 text-sm sm:text-base flex gap-x-1 items-start">
								{/* name and handle */}
								<div>
									<p className="font-semibold">
										{user.firstName} {user.lastName}
									</p>
									<p className="text-slate-500 text-xs sm:text-sm">
										@{user.username}
									</p>
								</div>

								{/* follow button */}
								<button
									onClick={handleFollow}
									className="ml-auto bg-sky-400 hover:bg-sky-300 font-semibold py-1 px-3 rounded-full"
								>
									{currentUser?.following.includes(user.id)
										? 'Unfollow'
										: 'Follow'}
								</button>
							</div>

							{/* join date */}
							<div className="my-6 text-slate-500 flex gap-2 items-center">
								<FaRegCalendarAlt />
								<p>Joined {formatDate(user.createdAt)}</p>
							</div>

							{/* follower and post count */}
							<div className="flex gap-x-4">
								<p>
									<span className="font-semibold">{user._count.following}</span>{' '}
									<span className="text-slate-500">Following</span>
								</p>

								<p>
									<span className="font-semibold">
										{user._count.followedBy}
									</span>{' '}
									<span className="text-slate-500">
										{user._count.followedBy === 1 ? 'Follower' : 'Followers'}
									</span>
								</p>

								<span className="text-slate-500">·</span>

								<p>
									<span className="font-semibold">{user._count.posts}</span>{' '}
									<span className="text-slate-500">
										{user._count.posts === 1 ? 'Post' : 'Posts'}
									</span>
								</p>
							</div>
						</div>
					</div>

					<UserPosts id={user.id} />
				</div>
			)}
		</div>
	);
}

function Skeleton() {
	return (
		<div className="p-4 animate-pulse">
			<div className="bg-slate-200 dark:bg-slate-700 rounded-full w-[80px] sm:w-[100px] aspect-square"></div>

			<div className="my-6 flex gap-x-1 items-start">
				<div>
					<div className="flex gap-x-1 mb-2">
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-24"></div>
					</div>

					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-32"></div>
				</div>

				<div className="ml-auto bg-slate-200 dark:bg-slate-700 h-8 w-20 rounded-full"></div>
			</div>

			<div className="my-6 bg-slate-200 dark:bg-slate-700 h-4 w-32 rounded-md"></div>

			<div className="flex gap-x-4 items-center">
				<div className="bg-slate-200 dark:bg-slate-700 h-4 w-16 rounded-md"></div>
				<div className="bg-slate-200 dark:bg-slate-700 h-4 w-16 rounded-md"></div>

				<span className="text-slate-500">·</span>

				<div className="bg-slate-200 dark:bg-slate-700 h-4 w-16 rounded-md"></div>
			</div>
		</div>
	);
}
