import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async getPoints(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const cityQuery = city ? city : "";
        const ufQuery = uf ? uf : "";
        const itemsQuery = items ? items : [0];

        console.log(`${city}, ${uf}, ${items}`);

        const parsedItems = String(itemsQuery)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(cityQuery))
            .where('uf', String(ufQuery))
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
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=50',
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