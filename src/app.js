import sequelize from './sequelize';
import db from './database/setup';
import server from './server/index';
import config from './server/config';

const HTTP_PORT = config.port;
sync.create();
// db.reset();

server.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});
