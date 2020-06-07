import express from 'express';
import path from 'path';
import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';
import multer from 'multer';
import multerConfig from './config/multer';
import {celebrate, Joi} from 'celebrate';

const routes = express.Router();
const upload = multer(multerConfig);

routes.use(express.json())

const uploads = express.static(path.resolve(__dirname, '..', 'uploads'));

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.use('/uploads', uploads);

routes.get('/items', itemsController.getItems);
routes.get('/points/:id', pointsController.getById);
routes.get('/points', pointsController.getPoints);

routes.post('/points',
upload.single('image'),
celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
    },
    )
}, {
    abortEarly: false
}),
pointsController.createPoint);

export default routes;