import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', routes.auth);

app.listen(PORT, () => console.log('Server running'));
