import knex from '../database/connection';

const baseUrl = 'http://localhost:3333';

class ItemsController {
    async getItems(request: any, response: any) {
        const items = await knex('items').select('*');

        const serializedItems = items.map((item: any) => {
            return {
                id: item.id,
                title: item.title,
                image_url: `${baseUrl}/uploads/${item.image}`
            }
        })

        return response.json(serializedItems);
    }
}

export default ItemsController;