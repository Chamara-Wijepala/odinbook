export type CreateUserErrors = {
	firstName?: string[];
	lastName?: string[];
	username?: string[];
	password?: string[];
	confirmPassword?: string[];
};

export type CommentType = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	content: string | null;
	replyToId: number | null;
	_count: {
		replies: number;
	};
	author: {
		firstName: string;
		lastName: string;
		username: string;
	} | null;
	likes: {
		userId: string;
	}[];
};

export interface ICommentWithReplies extends CommentType {
	replies: CommentType[];
}
