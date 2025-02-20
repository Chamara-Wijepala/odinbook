export type PostType = {
	id: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	likedBy: string[];
	author: {
		id: string;
		firstName: string;
		lastName: string;
		username: string;
	};
};
