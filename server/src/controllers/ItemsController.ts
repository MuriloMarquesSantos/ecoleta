import knex from '../database/connection';


async function getItems(request: any, response: any) {
    const items = await knex('items').select('*');

    const serializedItems = items.map((item: any) => {
        return { 
            id: item.id,
            title: item.title,
            image_url: `http://localhost:3333/uploads/${item.image}`
        }
    })

    return response.json(serializedItems);
}

export default getItems;