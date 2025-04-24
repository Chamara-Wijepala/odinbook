import { Link, useParams } from 'react-router';
import { DateTime } from 'luxon';
import { FaRegCalendarAlt } from 'react-icons/fa';
import useAuthStore from '../../stores/auth';
import useData from '../../hooks/useData';
import UserPosts from './user-posts';
import Avatar from './avatar';
import BackButton from '../../components/back-button';
import Skeleton from './skeleton';
import api from '../../api';

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
	avatar: { id: string; url: string } | null;
};

function formatDate(isoString: string) {
	return DateTime.fromISO(isoString).toFormat('MMM d, yyyy');
}

export default function Profile() {
	const params = useParams();
	const { isLoading, data: user } = useData<User>(`/users/${params.username}`);
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

	return (
		<div>
			<div className="p-4">
				<BackButton />
			</div>

			{isLoading && <Skeleton />}

			{!isLoading && !user && (
				<div className="flex flex-col justify-center items-center p-4 text-center">
					<h2 className="text-2xl font-bold">
						We couldn't find the user you're looking for!
					</h2>

					<p className="text-lg">
						Go to{' '}
						<Link to="/" className="text-sky-400 hover:text-sky-300">
							homepage
						</Link>
					</p>
				</div>
			)}

			{!isLoading && user && (
				<>
					<div>
						<div className="p-4 border-b-[1px] border-slate-300 dark:border-slate-800">
							<div>
								<Avatar
									userId={user.id}
									username={user.username}
									avatarId={user.avatar ? user.avatar.id : null}
									avatarUrl={user.avatar ? user.avatar.url : null}
								/>

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
									{user.id !== currentUser?.id && (
										<button
											onClick={handleFollow}
											className="ml-auto bg-sky-400 hover:bg-sky-300 font-semibold py-1 px-3 rounded-full"
										>
											{currentUser?.following.includes(user.id)
												? 'Unfollow'
												: 'Follow'}
										</button>
									)}
								</div>

								{/* join date */}
								<div className="my-6 text-slate-500 flex gap-2 items-center">
									<FaRegCalendarAlt />
									<p>Joined {formatDate(user.createdAt)}</p>
								</div>

								{/* follower and post count */}
								<div className="flex gap-x-4">
									<p>
										<span className="font-semibold">
											{user._count.following}
										</span>{' '}
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
				</>
			)}
		</div>
	);
}
