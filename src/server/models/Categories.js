import sequelize from '../../sequelize';

const { models } = sequelize;

export default class Categories {
    static async getAllRecords() {
        const data = await models.cat_type.findAll();
        return data;
    }

    static async createCategory(catRec) {
        const data = await models.cat_type.create(catRec);
        return data;
    }
}
