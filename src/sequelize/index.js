import { Sequelize } from 'sequelize';
import pg from 'pg';
import applyExtraSetup from './extra-setup';

// models
import _usersModel from './models/users.model';
import _catType from './models/cat_type.model';
import _userCat from './models/user_cat.model';
import _tags from './models/tags.model';
import _moves from './models/moves.model';
import _tagsArr from './models/tags_arr.model';

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);

pg.defaults.ssl = false;

const pool = new pg.Pool();

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

pool.on('connect', (err, client) => {
    if (err) console.error(err);
    console.log(client);
    console.log('Successfully connected to postgres.');
});

// const url = 'postgres://tvvdnlvsoajxhh:844034f47b986c3c875d8eeedf2ef963575410dcf63068ff5baaa2ba0defad25@ec2-99-81-238-134.eu-west-1.compute.amazonaws.com:5432/dbdtjsb572lg2e';
const useLocalDb = false;
const url = useLocalDb ? 'postgres://postgres:postgres@localhost:5432/rs-clone-back-db'
    : 'postgres://tvvdnlvsoajxhh:844034f47b986c3c875d8eeedf2ef963575410dcf63068ff5baaa2ba0defad25@ec2-99-81-238-134.eu-west-1.compute.amazonaws.com:5432/dbdtjsb572lg2e';

const dialectOptions = {};
if (!useLocalDb) {
    dialectOptions.ssl = {
        require: true,
        rejectUnauthorized: false,
    };
}

const sequelize = new Sequelize(process.env.DATABASE_URL || url, {
    dialect: 'postgres',
    dialectOptions,
});

const modelDefiners = [
    _usersModel, _catType, _userCat,
    _tags, _moves, _tagsArr,
];

// We define all models according to their files.
modelDefiners.forEach((modelDefiner) => {
    modelDefiner(sequelize);
});

applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
export default sequelize;
