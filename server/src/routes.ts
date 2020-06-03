import express from 'express';
import path from 'path';
import knex from './database/connection';

const routes = express.Router();

routes.use(express.json())

routes.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

routes.get('/items', async (request, response) => {
    const items = await knex('items').select('*');

    return response.json(items);
})

export default routes;