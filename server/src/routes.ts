import express from 'express';
import path from 'path';
import knex from './database/connection';

const routes = express.Router();

routes.use(express.json())

const uploads = express.static(path.resolve(__dirname, '..', 'uploads'));

routes.use('/uploads', uploads);

routes.get('/items', async (request, response) => {
    const items = await knex('items').select('*');

    const serializedItems = items.map((item) => {
        return { 
            id: item.id,
            title: item.title,
            image_url: `http://localhost:3333/uploads/${item.image}`
        }
    })

    return response.json(serializedItems);
})

routes.post('/points', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
    } = request.body;
    
    const createdPoint = await knex('points').insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
    });
    
    return response.json({success: 'true'});
})

export default routes;