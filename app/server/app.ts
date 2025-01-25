import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes';
import verifyJWT from './middleware/verifyJWT';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', routes.auth);

app.use(verifyJWT);

app.use('/', routes.home);

app.listen(PORT, () => console.log('Server running'));
