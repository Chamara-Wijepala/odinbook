import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	res.status(200).json({ hello: 'world' });
});

app.listen(PORT, () => console.log('Server running'));
