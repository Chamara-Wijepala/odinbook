export type PostType = {
	id: string;
	content: string;
	author: {
		id: string;
		firstName: string;
		lastName: string;
		username: string;
	};
};
