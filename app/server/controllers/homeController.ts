import { Request, Response } from 'express';

async function getHomePage(req: Request, res: Response) {
	res.status(200).json({ user: { username: req.user.username } });
}

export default {
	getHomePage,
};
