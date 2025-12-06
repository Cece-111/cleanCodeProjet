import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cardsRouter from './routes/cards.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/cards', cardsRouter);

export default app;
