import { Sequelize } from 'sequelize';

// models
import path from 'path';
import _usersModel from './models/users.model';
import _catType from './models/cat_type.model';
import _userCat from './models/user_cat.model';
import _tags from './models/tags.model';
import _moves from './models/moves.model';
import _tagsArr from './models/tags_arr.model';

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);

console.log(`__dirname: ${__dirname}`);
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'db.sqlite'),
    logQueryParameters: true,
    benchmark: true,
});

const modelDefiners = [
    _usersModel, _catType, _userCat,
    _tags, _moves, _tagsArr,
];

// We define all models according to their files.
modelDefiners.forEach((modelDefiner) => {
    modelDefiner(sequelize);
});

sequelize.define('modelName', {
    columnA: Sequelize.STRING,
    columnB: Sequelize.STRING,
    columnC: Sequelize.NUMBER,
});

console.log('>>>>>>  sequelize   sequelize.models.users <<<<<<');
console.log(JSON.stringify(sequelize.models.modelName));

// We export the sequelize connection instance to be used around our app.
export default sequelize;
