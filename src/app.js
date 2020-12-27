import sequelize from './sequelize';
import db from './database/setup';
import server from './server/';
import config from './server/config';

const HTTP_PORT = config.port;
db.reset();

server.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});
