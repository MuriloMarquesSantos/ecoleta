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

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.15.15:3333/uploads/${point.image}`
            }
        })

        return response.json(serializedPoints);
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

        const imageToBeAdded = request.file ? request.file.filename : "";

        const point = {
            image: imageToBeAdded,
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

        const point_items = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
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

        const serializedPoint = {
            ...foundPoint,
            image_url: `http://192.168.15.15:3333/uploads/${foundPoint.image}`

        }

        return response.json({ foundPoint: serializedPoint, pointItems });
    }

    private getPointItems = async (id: number) => {
        return knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');
    }
}

export default PointsController;