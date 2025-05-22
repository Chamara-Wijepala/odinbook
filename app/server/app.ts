import dotenv from 'dotenv';
import cors from 'cors';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes';
import verifyJWT from './middleware/verifyJWT';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app: Application = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/ping', (req, res) => {
	res.status(200).send('Server is alive!');
});

app.use('/auth', routes.auth);

app.use(verifyJWT);

app.use('/posts', routes.posts);
app.use('/users', routes.users);
app.use('/posts/:postId/comments', routes.comments);

app.use(errorHandler);

export default app;
