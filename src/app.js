// import sequelize from './sequelize';
import db from './database/setup';
import server from './server/index';
import config from './server/config';

db.create();
// db.reset();
// sequelize.sync();

const HTTP_PORT = config.port;

server.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});
