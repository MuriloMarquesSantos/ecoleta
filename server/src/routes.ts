import express from 'express';
import path from 'path';
import knex from './database/connection';
import getItems from './controllers/ItemsController';
import createPoint from './controllers/PointsController';

const routes = express.Router();

routes.use(express.json())

const uploads = express.static(path.resolve(__dirname, '..', 'uploads'));

routes.use('/uploads', uploads);

routes.get('/items', getItems);

routes.post('/points', createPoint);

export default routes;