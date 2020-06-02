import express from 'express';

const app = express();

app.get('/users', (req, res) => {
    res.json([
        'Diego',
        'Cleiton',
        'John'
    ]);
});


app.listen(3333);