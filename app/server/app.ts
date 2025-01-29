import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes';
import verifyJWT from './middleware/verifyJWT';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: process.env.CLIENT_URL || 'http://localhost:5173',
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', routes.auth);

app.use(verifyJWT);

app.use('/', routes.home);

app.use(errorHandler);

app.listen(PORT, () => console.log('Server running'));
