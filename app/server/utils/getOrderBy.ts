import { Prisma } from '@prisma/client';
// export type SortOption = 'new' | 'old' | 'likes' | 'comments';

export default function getOrderBy(
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
