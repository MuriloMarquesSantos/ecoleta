import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async createPoint(request: Request, response: Response) {
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

        const trx = await knex.transaction();

        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const point_items = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        })

        trx('point_items').insert(point_items)
            .then(trx.commit)
            .catch(trx.rollback);

        return response.json({
            id: point_id,
            ...point
        });
    }
}

export default PointsController;