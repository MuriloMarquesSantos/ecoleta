import supertest from 'supertest';
import FakePoints from './FakePoints'
import knex from '../../src/database/connection';
import app from '../../src/server';


interface Response {
    id: number,
    name: string
}

describe('Points endpoint', () => {
    afterAll(async () => {
        await knex.destroy();
    })

    it('should get a list of points', async () => {
        const res = await supertest(app).get('/points?city=São paulo&uf=SP&items=1,2,3');
        expect(res.status).toEqual(200);
    });

    it('should be able to create a point properly', async () => {
        const res = await supertest(app).post('/points').send(FakePoints);
        const id = res.body.id;

        const trx = await knex.transaction();
    
        await trx('point_items')
            .where('point_id', id)
            .del();
        await trx('points').where('id', id).del().then(trx.commit);
        expect(res.status).toEqual(201);
    })
});


