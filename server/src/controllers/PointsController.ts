import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async getPoints(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        console.log(`${city}, ${uf}, ${items}`);

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return response.json(points);
    }

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

        await trx('point_items').insert(point_items)
            .then(trx.commit)
            .catch(() => {
                trx.rollback;
                return response.status(400).json({ message: 'Error during Point creation' })
            })

        return response.status(201).json({
            id: point_id,
            ...point
        });
    }

    getById = async (request: Request, response: Response) => {
        const pointId = request.param('id');

        const foundPoint = await knex('points').select('*').where('id', pointId).first();

        const pointItems = await this.getPointItems(foundPoint.id);

        if (!foundPoint) {
            return response.status(404).json({ message: 'Point not found' });
        }

        return response.json({ foundPoint, pointItems });
    }

    private getPointItems = async (id: number) => {
        return knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');
    }
}

export default PointsController;