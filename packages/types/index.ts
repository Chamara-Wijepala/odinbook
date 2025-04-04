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
	author: {
		firstName: string;
		lastName: string;
		username: string;
	} | null;
};

export interface ICommentWithReplies extends CommentType {
	replies: CommentType[];
}
