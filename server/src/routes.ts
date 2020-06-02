import express from 'express';

const routes = express.Router();

routes.use(express.json())

routes.get('/', (req, res) => {
    return res.json({message: 'Hello world'});
})

export default routes;