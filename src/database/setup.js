import sequelize from '../sequelize/index';

async function reset() {
    console.log('Will rewrite the SQLite database');

    await sequelize.sync({ force: true });

    console.log('Done!');
}

async function create() {
    console.log('Will create the SQLite database');

    await sequelize.sync();

    console.log('Done!');
}

async function sync() {
    console.log('Will sync the SQLite database');

    await sequelize.sync({ force: false });

    console.log('Done!');
    console.log(JSON.stringify(sequelize.models.users));
}

export default { reset, create, sync };
// reset();
