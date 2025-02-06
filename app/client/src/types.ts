export type PostType = {
	id: string;
	content: string;
	author: {
		firstName: string;
		lastName: string;
		username: string;
	};
};
