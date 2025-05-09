import { Prisma } from '@prisma/client';

export function getPostOrderBy(
	sort: string
): Prisma.PostOrderByWithRelationInput[] {
	switch (sort) {
		case 'new':
			return [{ createdAt: 'desc' }];
		case 'old':
			return [{ createdAt: 'asc' }];
		case 'likes':
			return [
				{
					likedBy: {
						_count: 'desc',
					},
				},
				{ createdAt: 'desc' },
			];
		case 'comments':
			return [
				{
					comments: {
						_count: 'desc',
					},
				},
				{ createdAt: 'desc' },
			];
		default:
			return [{ createdAt: 'desc' }];
	}
}

export function getCommentOrderBy(
	sort: string
): Prisma.CommentOrderByWithRelationInput[] {
	switch (sort) {
		case 'new':
			return [{ createdAt: 'desc' }];
		case 'old':
			return [{ createdAt: 'asc' }];
		case 'likes':
			return [
				{
					likes: {
						_count: 'desc',
					},
				},
				{ createdAt: 'desc' },
			];
		case 'replies':
			return [
				{
					replies: {
						_count: 'desc',
					},
				},
				{ createdAt: 'desc' },
			];
		default:
			return [{ createdAt: 'desc' }];
	}
}
