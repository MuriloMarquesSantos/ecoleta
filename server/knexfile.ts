import path from 'path';

module.exports = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'ecoleta'
    },
    useNullAsDefault: true,
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    }
};