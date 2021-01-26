import sequelize from '../sequelize/index';

async function addDefData() {
    try {
        await sequelize.models.cat_type.create({ name: 'Доходы', code: 'income', allowPlan: true });
    } catch (e) {
        //console.log('row already exists');
    }
    try {
        await sequelize.models.cat_type.create({ name: 'Счета', code: 'accounts', allowPlan: false });
    } catch (e) {
        //console.log('row already exists');
    }
    try {
        await sequelize.models.cat_type.create({ name: 'Расходы', code: 'expenses', allowPlan: true });
    } catch (e) {
        //console.log('row already exists');
    }
}

async function reset() {
    //console.log('Will rewrite the SQLite database');

    await sequelize.sync({ force: true });
    await addDefData();

    //console.log('Done!');
}

async function create() {
    //console.log('Will create the SQLite database');

    await sequelize.sync();
    await addDefData();

    //console.log('Done!');
}

async function sync() {
    //console.log('Will sync the SQLite database');

    await sequelize.sync({ force: false });
    await addDefData();

    //console.log('Done!');
}

export default { reset, create, sync };
// reset();
