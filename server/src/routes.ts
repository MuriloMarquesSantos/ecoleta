import express from 'express';
import path from 'path';
import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';

const routes = express.Router();

routes.use(express.json())

const uploads = express.static(path.resolve(__dirname, '..', 'uploads'));

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.use('/uploads', uploads);

routes.get('/items', itemsController.getItems);

routes.post('/points', pointsController.createPoint);
routes.get('/points/:id', pointsController.getById);


export default routes;