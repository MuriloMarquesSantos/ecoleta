import express from 'express';
import routes from './routes';
import cors from 'cors';
import {errors} from 'celebrate';

const app = express();

app.use(cors());
app.listen(3333);
app.use(express.json());
app.use(routes);
app.use(errors());